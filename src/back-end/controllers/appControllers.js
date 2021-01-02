"use strict";

var Board = require("../models/board.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

exports.get_user_by_credential = function (req, res) {
  User.getUserByCredential(req.body, function (err, user) {
    if (err) {
      return res.send(err);
    }
    if (user.length <= 0) {
      res.status(401).send({ message: "Invalid" });
      return;
    }
    user = JSON.parse(JSON.stringify(user[0]));
    if (!user.isValidated) {
      res.status(401).send({ message: "Account is not validated" });
      return;
    }
    res.json({
      user: user,
      token: jwt.sign({ user: user }, "RESTFULAPIs"),
    });
  });
};

exports.get_user_by_username = function (req, res) {
  User.getUserByUsername(req.params.username, function (err, user) {
    if (err) {
      res.send(err);
      return;
    }
    if (user.length <= 0) {
      res.status(401).send({ message: "Invalid" });
      return;
    }
    user = JSON.parse(JSON.stringify(user[0]));
    res.json(user);
  });
};

exports.add_user_by_credential = function (req, res) {
  User.addUserByCredential(req.body, function (err, user) {
    if (err) return res.send(err);
    res.json(user);
  });
};

exports.validate_user = (req, res) => {
  User.validateUser(req.params.username, function (err, user) {
    if (err) return res.send(err);
    res.send(user);
  });
};

exports.get_grid = function (req, res) {
  const { boardId, stepNum } = req.query;
  Board.getGrid(boardId, stepNum, function (err, grid) {
    if (err) return res.send(err);
    res.send(grid);
  });
};

exports.get_board_by_id = function (req, res) {
  const boardId = req.params.id;
  Board.getBoardbyId(boardId, function (err, board) {
    if (err) {
      res.send(err);
      return;
    }
    res.send(board);
  });
};

exports.join_board = function (req, res) {
  const { boardId } = req.query;
  Board.joinBoard(boardId, req.user.username, function (err, grid) {
    if (err) return res.send(err);
    res.send(grid);
  });
};

exports.make_turn = function (req, res) {
  const { boardId, row, col } = req.query;
  Board.makeTurn(boardId, row, col, function (err, board) {
    if (err) return res.send(err);
    res.json(board);
  });
};

exports.create_board = function (req, res) {
  const { name, boardId } = req.query;
  Board.createBoard(boardId, name, req.user.username, function (err, board) {
    if (err) {
      return res.send(err);
    }
    res.json(board);
  });
};

exports.force_win = function (req, res) {
  const { boardId } = req.body;
  Board.forceWin(boardId, req.user.username, function (err, board) {
    if (err) return res.send(err);
    res.json(board);
  });
};

exports.get_all_boards = function (req, res) {
  Board.getAllBoards(function (err, board) {
    if (err) return res.send(err);
    res.json(board);
  });
};

exports.get_board_chat = function (req, res) {
  const { boardId } = req.query;
  Board.getBoardChat(boardId, function (err, board) {
    if (err) return res.send(err);
    res.json(board);
  });
};

exports.get_board_history = function (req, res) {
  const { boardId } = req.query;
  Board.getBoardHistory(boardId, req.user.username, function (err, board) {
    if (err) return res.send(err);
    res.json(board);
  });
};

exports.make_message = function (req, res) {
  const { boardId, time, content } = req.query;
  Board.makeMessage(
    boardId,
    time,
    content,
    req.user.username,
    function (err, board) {
      if (err) return res.send(err);
      res.json(board);
    }
  );
};
