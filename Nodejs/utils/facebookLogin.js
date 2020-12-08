const passportfb = require("passport-facebook").Strategy;
const config = require("../config");
const userModel = require("../models/user");

module.exports = function (passport) {
  //Nhận giá trị trả về từ face book
  passport.use(
    new passportfb(
      {
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        //URL nhận giá trị trả về
        callbackURL: "http://localhost:3000/auth/fb/cb",
        //Các trường dữ liệu yêu cầu fb trả về
        profileFields: ["email", "name"],
        passReqToCallback: true,
      },
      (accessToken, refreshToken, profile, done) => {
        userModel
          .getModel()
          .findOne({ username: profile._json.name }, (err, user) => {
            if (err) return done(err);
            //Nếu đã có User trong db rồi thì đăng nhập
            if (user) return done(null, user);
            //Nếu chưa có User trong db thì tạo mới
            const newUser = new userModel.getModel()({
              username: profile._json.name,
              email: profile._json.email,
              elo: 0,
            });
            newUser.save((err) => {
              return done(null, newUser);
            });
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    userModel.getModel().findOne({ id }, (err, user) => {
      done(null, user);
    });
  });
};
