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
        callbackURL: `${config.BACKEND_HOST}/auth/fb/cb`,
        //Các trường dữ liệu yêu cầu fb trả về
        profileFields: ["email", "name"],
        enableProof: true,
      },
      (accessToken, refreshToken, profile, done) => {
        const { first_name, email } = profile._json;
        userModel.Model.findOne({ username: first_name }, (err, user) => {
          if (err) return done(err);
          //Nếu đã có User trong db rồi thì đăng nhập
          if (user) return done(null, user);
          //Nếu chưa có User trong db thì tạo mới
          const newUser = new userModel.Model({
            username: first_name,
            email: email,
            status: "offline",
            isValidated: true,
            board: "",
            win: 0,
            lose: 0,
            trophy: 0,
            draw: 0,
          });
          newUser.save((err) => {
            return done(null, newUser);
          });
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((username, done) => {
    userModel.Model.findOne({ username }, (err, user) => {
      done(null, user);
    });
  });
};
