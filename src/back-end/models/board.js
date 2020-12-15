let mongoose = require("mongoose");
const User = require("./user.js");

//Tạo schema
let boardSchema = new mongoose.Schema({
  boardId: String,
  name: String,
  userId1: String,
  userId2: String,
  winner: String,
  nextTurn: String,
  stepNum: Number,
  history: Array,
  chat: Array,
});

//Tạo model
let BoardModel = mongoose.model("Board", boardSchema);

function Board() {
  this.getGrid = function (boardId, stepNum, result) {
    const currentBoard = getBoard(boardId);
    result(null, currentBoard.history[stepNum]);
  };

  this.joinBoard = function (boardId, userId2, result) {
    BoardModel.updateOne({ boardId }, { userId2 }, (err, res) => {
      if (err) return result(null, err);
      result(null, res);
    });
  };

  this.makeTurn = function (boardId, row, col, result) {
    const currentBoard = getBoard(boardId);
    const newStepNum = currentBoard.stepNum + 1;
    const newNextTurn = currentBoard.nextTurn === userId1 ? userId2 : userId1;
    let newWinner = "";
    let history = currentBoard.history.slice(0, newStepNum);
    const current = history[history.length - 1];

    if (calculateWinner(current)) {
      newWinner = currentBoard.nextTurn;
    }

    const position = col - 1 + (row - 1) * 3;
    current[position] = currentBoard.nextTurn === userId1 ? "X" : "O";

    history = history.concat(current);

    BoardModel.updateOne(
      { boardId },
      {
        history,
        stepNum: newStepNum,
        nextTurn: newNextTurn,
        winner: newWinner,
      },
      (err, res) => {
        if (err) return result(null, err);
        result(null, res);
      }
    );
  };

  // Chức năng thêm board mới
  this.createBoard = function (boardId, name, userId1, result) {
    const data = {
      boardId,
      name,
      userId1,
    };
    if (getBoard(boardId)) {
      result(null, "err");
    }
    BoardModel.create(data, function (err, res) {
      if (err) return result(null, err);
      result(null, res);
    });
  };

  this.forceWin = function (boardId, username, result) {
    const currentBoard = getBoard(boardId);
    BoardModel.updateOne(
      { boardId },
      {
        winner: username === currentBoard.userId1 ? userId2 : userId1,
      },
      (err, res) => {
        if (err) return result(null, err);
        result(null, res);
      }
    );
  };

  this.getAllBoards = (result) => {
    BoardModel.find()
      .then((res) => {
        result(null, res);
      })
      .catch((err) => {
        result(null, err);
      });
  };

  this.getBoardChat = (boardId, result) => {
    const currentBoard = getBoard(boardId);
    result(null, currentBoard.chat);
  };

  this.makeMessage = (boardId, time, content, result) => {
    const currentBoard = getBoard(boardId);
    const newMessage = {
      time,
      content,
    };
    const newChat = { ...currentBoard.chat, newMessage };
    BoardModel.updateOne(
      { boardId },
      {
        chat: newChat,
      },
      (err, res) => {
        if (err) return result(null, err);
        result(null, res);
      }
    );
  };
  this.getBoardHistory = (boardId, result) => {
    const currentBoard = getBoard(boardId);
    result(null, currentBoard.history);
  };

  const getBoard = (boardId) => {
    BoardModel.find({ boardId })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return "err";
      });
  };
}
const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

module.exports = new Board();
