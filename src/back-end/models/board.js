let mongoose = require("mongoose");
const User = require("./user.js");
const BOARD_SIZE = 400;
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
  this.getGrid = async function (boardId, stepNum, result) {
    const currentBoard = await getBoard(boardId);
    result(
      null,
      currentBoard.history[stepNum | (currentBoard.history.length - 1)]
    );
  };

  this.joinBoard = function (boardId, userId2, result) {
    BoardModel.updateOne({ boardId }, { userId2 }, (err, res) => {
      if (err) return result(null, err);
      result(null, res);
    });
  };

  this.makeTurn = async function (boardId, row, col, result) {
    row = parseInt(row);
    col = parseInt(col);
    const currentBoard = await getBoard(boardId);
    const newStepNum = currentBoard.history.length;
    const newNextTurn =
      currentBoard.nextTurn === currentBoard.userId1
        ? currentBoard.userId2
        : currentBoard.userId1;
    let newWinner = "";
    let history = currentBoard.history.slice(0, newStepNum);
    const current = JSON.parse(JSON.stringify(history[history.length - 1]));
    const position = row * 20 + col;
    current.squares[position] =
      currentBoard.nextTurn === currentBoard.userId1 ? "X" : "O";

    if (calculateWinner(current.squares, row, col, current.squares[position])) {
      newWinner = currentBoard.nextTurn;
      console.log("winner", newWinner);
    }

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
  this.createBoard = async function (boardId, name, userId1, result) {
    let squares = [...Array(BOARD_SIZE).fill(null)];
    const data = {
      boardId,
      name,
      userId1,
      history: [
        {
          squares,
        },
      ],
    };
    let checkDuplicate = await getBoard(boardId);
    if (checkDuplicate) {
      result(null, "err");
      return;
    }
    BoardModel.create(data, function (err, res) {
      if (err) {
        return result(null, err);
      }
      result(null, res);
    });
  };

  this.forceWin = async function (boardId, username, result) {
    const currentBoard = await getBoard(boardId);
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

  this.getBoardChat = async (boardId, result) => {
    const currentBoard = await getBoard(boardId);
    result(null, currentBoard.chat);
  };

  this.makeMessage = async (boardId, time, content, from, result) => {
    const currentBoard = await getBoard(boardId);
    const newMessage = {
      time,
      content,
      from,
    };
    let newChat = currentBoard.chat.slice(0, currentBoard.chat.length);
    newChat.push(newMessage);
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
  this.getBoardHistory = async (boardId, result) => {
    const currentBoard = await getBoard(boardId);
    result(null, currentBoard.history);
  };

  const getBoard = async (boardId) => {
    let res;
    try {
      res = await BoardModel.find({ boardId });
    } catch (err) {
      return "err";
    }
    return res.length ? res[0] : undefined;
  };
}
const calculateWinner = (squares, row, col, player) => {
  let count = 0;
  let tempRow = row;
  let tempCol = col;
  while (tempCol - 1 >= 0 && squares[tempRow * 20 + (tempCol - 1)] === player) {
    count++;
    tempCol--;
  }
  tempCol = col;
  while (
    tempCol + 1 <= 19 &&
    squares[tempRow * 20 + (tempCol + 1)] === player
  ) {
    count++;
    tempCol++;
  }
  tempCol = col;
  if (count === 4) {
    return true;
  }
  count = 0;

  while (tempRow - 1 >= 0 && squares[(tempRow - 1) * 20 + tempCol] === player) {
    count++;
    tempRow--;
  }
  tempRow = row;
  while (
    tempRow + 1 <= 19 &&
    squares[(tempRow + 1) * 20 + tempCol] === player
  ) {
    count++;
    tempRow++;
  }
  tempRow = row;
  if (count === 4) {
    return true;
  }
  count = 0;

  while (
    tempRow + 1 <= 19 &&
    tempCol - 1 >= 0 &&
    squares[(tempRow + 1) * 20 + tempCol - 1] === player
  ) {
    count++;
    tempRow++;
    tempCol--;
  }
  tempRow = row;
  tempCol = col;
  while (
    tempRow - 1 >= 0 &&
    tempCol + 1 <= 19 &&
    squares[(tempRow - 1) * 20 + tempCol + 1] === player
  ) {
    count++;
    tempRow--;
    tempCol++;
  }
  tempRow = row;
  tempCol = col;
  console.log(count);

  if (count === 4) {
    return true;
  }
  count = 0;

  while (
    tempRow + 1 <= 19 &&
    tempCol + 1 <= 19 &&
    squares[(tempRow + 1) * 20 + tempCol + 1] === player
  ) {
    count++;
    tempRow++;
    tempCol++;
  }
  tempRow = row;
  tempCol = col;
  while (
    tempRow - 1 >= 0 &&
    tempCol - 1 >= 0 &&
    squares[(tempRow - 1) * 20 + tempCol - 1] === player
  ) {
    count++;
    tempRow--;
    tempCol--;
  }
  tempRow = row;
  tempCol = col;
  if (count === 4) {
    return true;
  }
  return false;
};

module.exports = new Board();
