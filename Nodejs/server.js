const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./utils/db");
const cors = require("cors");
const passport = require("passport");
port = process.env.PORT || 3001;
const session = require("express-session");
const passportfb = require("passport-facebook").Strategy;
const config = require("./config");
const userModel = require("./models/user");

app.use(
  session({
    secret: "123",
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new passportfb(
    {
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/fb/cb",
      profileFields: ["id", "displayName", "email", "name", "photos"],
      passReqToCallback: true,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      userModel.getModel().findOne({ id: profile._json.id }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, user);
        const newUser = new userModel.getModel()({
          id: profile._json.id,
          name: profile._json.name,
          email: profile._json.email,
          isVerify: true,
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
  db.findOne({ id }, (err, user) => {
    done(null, user);
  });
});

app.listen(port);

console.log("API server started on: " + port);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./routes/appRoutes"); //importing route
routes(app, passport); //register the route
