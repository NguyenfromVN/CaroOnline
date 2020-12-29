const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("../config");
const userModel = require("../models/user");
module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/google/callback",
        profileFields: ["email", "name"],
      },
      function (accessToken, refreshToken, profile, done) {
        const { name, email } = profile._json;
        userModel.Model.findOne({ username: name }, (err, user) => {
          if (err) return done(err);
          //Nếu đã có User trong db rồi thì đăng nhập
          if (user) return done(null, user);
          //Nếu chưa có User trong db thì tạo mới
          const newUser = new userModel.Model({
            username: name,
            email: email,
            status: "offline",
            isValidated: true,
            board: "",
          });
          newUser.save((err) => {
            return done(null, newUser);
          });
        });
      }
    )
  );
};
