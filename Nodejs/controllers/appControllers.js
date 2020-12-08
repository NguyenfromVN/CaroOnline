"use strict";

var Board = require("../models/board.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

exports.get_user_by_credential = function (req, res) {
  User.getUserByCredential(req.body, function (err, user) {
    if (err) res.send(err);
    if (user.length <= 0) {
      res.status(401).send({ message: "Wrong password" });
    }
    user = user[0];
    res.json({
      user: { username: user.username, history: user.history, id: user.id, friends: user.friends,
        elo: user.elo, board: user.board, status: user.status },
      token: jwt.sign(
        { username: user.username},
        "RESTFULAPIs"
      ),
    });
  });
};

exports.add_user_by_credential = function (req, res) {
  User.addUserByCredential(req.body, function (err, user) {
    if (err) res.send(err);
      res.json(user);
  });
};

exports.get_all_boards = function (req, res) {
  Board.getAllBoards(function (err, board) {
    if (err) res.send(err);
    res.send(board);
  });
};

exports.get_board_by_id = function (req, res) {
  if (!req.user.board.includes(req.params.boardId)) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  Board.getBoardById(req.params.boardId, function (err, board) {
    if (err) res.send(err);
    res.json(board);
  });
};

exports.join_board = function (req, res) {
  Board.addBoard(req.user, req.body, function (err, board) {
    if (err) res.send(err);
      res.json(board);
  });
};

exports.add_board = function (req, res) {
  Board.addBoard(req.user, req.body, function (err, board) {
    if (err) res.send(err);
      res.json(board);
  });
};


exports.end_board = (req,res) => {
  Board.endBoard(req.params.boardId, function (err, board) {
    if (err) res.send(err);
      res.json(board);
  });
}

exports.start_board = function (req, res) {
  Board.startBoard(req.params.boardId, function (err, board) {
    if (err) res.send(err);
      res.json(board);
  });
};


