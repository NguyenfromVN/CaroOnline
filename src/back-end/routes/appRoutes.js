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
          req.user = decode.user;
          next();
        }
      );
    } else {
      //Nếu người dùng không có token sẽ báo lỗi
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.use("/board", protectedRoutes);

  protectedRoutes.get("/get_grid", controller.get_grid);
  protectedRoutes.get("/join_board", controller.join_board);
  protectedRoutes.get("/make_turn", controller.make_turn);
  protectedRoutes.get("/create_board", controller.create_board);
  protectedRoutes.get("/force_win", controller.force_win);
  protectedRoutes.get("/get_all_boards", controller.get_all_boards);
  protectedRoutes.get("/get_board_chat", controller.get_board_chat);
  protectedRoutes.get("/get_board_history", controller.get_board_history);
  protectedRoutes.get("/make_message", controller.make_message);

  // user Routes
  app.route("/login").post(controller.get_user_by_credential);
  app.route("/register").post(controller.add_user_by_credential);

  // facebook Routes
  app.get("/auth/fb", passport.authenticate("facebook", { scope: ["email"] }));
  app.get(
    "/auth/fb/cb",
    passport.authenticate("facebook", {
      failureRedirect: "/login ",
      successRedirect: "/",
    })
  );
};
