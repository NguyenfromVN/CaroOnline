"use strict";
const express = require("express");
const protectedRoutes = express.Router();
const jsonwebtoken = require("jsonwebtoken");

module.exports = function (app, passport) {
  var controller = require("../controllers/appControllers");
  
  //Xác thực người dùng có token hay không
  protectedRoutes.use((req, res, next) => {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      jsonwebtoken.verify(
        req.headers.authorization.split(" ")[1],
        "RESTFULAPIs",
        function (err, decode) {
          if (err) req.user = undefined;
          req.user = decode;
          next();
        }
      );
    } else {
      //Nếu người dùng không có token sẽ báo lỗi
        res.status(401).json({message: "Unauthorized"})
    }
  });

  // board Routes
  app.use("/", protectedRoutes);

  protectedRoutes.get("/", controller.get_all_boards);
  protectedRoutes.get("/:boardId", controller.get_board_by_id);
  protectedRoutes.get("/:boardId/join", controller.get_board_by_id);
  protectedRoutes.get("/:boardId/start", controller.start_board);
  protectedRoutes.get("/:boardId/end", controller.end_board);

  // user Routes
  app.route("/login").post(controller.get_user_by_credential);
  app.route("/register").post(controller.add_user_by_credential);

  // facebook Routes
  app.get("/auth/fb", passport.authenticate("facebook", {scope: ['email']}))
  app.get("/auth/fb/cb", passport.authenticate("facebook", {
    failureRedirect: '/login ', successRedirect: '/'
  }))
}; 
