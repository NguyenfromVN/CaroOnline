"use strict";
const express = require("express");
const protectedRoutes = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const config = require("../config");
const url = require("url");

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

  protectedRoutes.get("/get_board/:id", controller.get_board_by_id);
  protectedRoutes.get("/get_grid", controller.get_grid);
  protectedRoutes.get("/join_board", controller.join_board);
  protectedRoutes.get("/make_turn", controller.make_turn);
  protectedRoutes.get("/create_board", controller.create_board);
  protectedRoutes.get("/get_all_boards", controller.get_all_boards);
  protectedRoutes.get("/get_board_chat", controller.get_board_chat);
  protectedRoutes.get("/get_board_history", controller.get_board_history);
  protectedRoutes.get("/make_message", controller.make_message);
  protectedRoutes.get("/surrender", controller.surrender);
  protectedRoutes.get("/force_win", controller.force_win);
  protectedRoutes.get("/draw_game", controller.draw_game);

  app.use("/admin", protectedRoutes);
  protectedRoutes.get("/block_user", controller.block_user);
  protectedRoutes.get("/search_user", controller.search_user);

  // user Routes
  app.route("/get_leaderboard").get(controller.get_leaderboard);
  app.route("/user/:username").get(controller.get_user_by_username);
  app.route("/login").post(controller.get_user_by_credential);
  app.route("/change_password").post(controller.change_password);
  app.route("/update_password").post(controller.update_password);
  app.route("/register").post(controller.add_user_by_credential);
  app.route("/validate/:username").post(controller.validate_user);

  // facebook Routes
  app.get("/auth/fb", passport.authenticate("facebook", { scope: ["email"] }));
  app.get(
    "/auth/fb/cb",
    passport.authenticate("facebook", {
      failureRedirect: `${config.FRONTEND_HOST}/error`,
    }),
    (req, res) => {
      res.json({
        user: req.user,
        token: jsonwebtoken.sign({ user: req.user }, "RESTFULAPIs"),
      });
    }
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/error" }),
    function (req, res) {
      res.redirect(
        url.format({
          pathname: "http://localhost:3000/google",
          query: {
            user: req.user.username,
            token: jsonwebtoken.sign({ user: req.user }, "RESTFULAPIs"),
          },
        })
      );
    }
  );
};
