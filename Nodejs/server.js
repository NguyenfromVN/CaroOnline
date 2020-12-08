const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./utils/db");
const cors = require("cors");
const passport = require("passport");
port = process.env.PORT || 3001;
const session = require("express-session");

app.use(
  session({
    secret: "123",
  })
);

//Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

app.listen(port);

console.log("API server started on: " + port);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require("./routes/appRoutes"); //importing route
routes(app, passport); //register the route
var fbLogin = require("./utils/facebookLogin"); //importing facebook login
fbLogin(passport);
