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
      user: {
        username: user.username,
        history: user.history,
        friends: user.friends,
        elo: user.elo,
        board: user.board,
        status: user.status,
      },
      token: jwt.sign({ username: user.username }, "RESTFULAPIs"),
    });
  });
};

exports.add_user_by_credential = function (req, res) {
  User.addUserByCredential(req.body, function (err, user) {
    if (err) res.send(err);
    res.json(user);
  });
};

exports.get_grid = function (req, res) {
  const { boardId, stepNum } = req.body;
  Board.getGrid(boardId, stepNum, function (err, grid) {
    if (err) res.send(err);
    res.send(grid);
  });
};

exports.join_board = function (req, res) {
  const { boardId } = req.body;
  Board.joinBoard(boardId, req.user.username, function (err, grid) {
    if (err) res.send(err);
    res.send(grid);
  });
};

exports.make_turn = function (req, res) {
  const { boardId, row, col } = req.body;
  Board.makeTurn(boardId, row, col, function (err, board) {
    if (err) res.send(err);
    res.json(board);
  });
};

exports.create_board = function (req, res) {
  const { name, boardId } = req.body;
  Board.createBoard(boardId, name, req.user.username, function (err, board) {
    if (err) res.send(err);
    res.json(board);
  });
};

exports.force_win = function (req, res) {
  const { boardId } = req.body;
  Board.forceWin(boardId, req.user.username, function (err, board) {
    if (err) res.send(err);
    res.json(board);
  });
};

exports.get_all_boards = function (req, res) {
  Board.getAllBoards(function (err, board) {
    if (err) res.send(err);
    res.json(board);
  });
};

exports.get_board_chat = function (req, res) {
  const { boardId } = req.body;
  Board.getBoardChat(boardId, req.user.username, function (err, board) {
    if (err) res.send(err);
    res.json(board);
  });
};

exports.get_board_history = function (req, res) {
  const { boardId } = req.body;
  Board.getBoardHistory(boardId, req.user.username, function (err, board) {
    if (err) res.send(err);
    res.json(board);
  });
};

exports.make_message = function (req, res) {
  const { boardId, time, content } = req.body;
  Board.makeMessage(
    boardId,
    time,
    content,
    req.user.username,
    function (err, board) {
      if (err) res.send(err);
      res.json(board);
    }
  );
};
