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
  this.getGrid = async function (boardId, stepNum, result) {
    const currentBoard = await getBoard(boardId);
    result(null, currentBoard.history[stepNum | currentBoard.history.length-1]);
  };

  this.joinBoard = function (boardId, userId2, result) {
    BoardModel.updateOne({ boardId }, { userId2 }, (err, res) => {
      if (err) return result(null, err);
      result(null, res);
    });
  };

  this.makeTurn = async function (boardId, row, col, result) {
    row=parseInt(row);
    col=parseInt(col);
    const currentBoard = await getBoard(boardId);
    const newStepNum = currentBoard.history.length;
    const newNextTurn = currentBoard.nextTurn === currentBoard.userId1 ? currentBoard.userId2 : currentBoard.userId1;
    let newWinner = "";
    let history = currentBoard.history.slice(0, newStepNum);
    const current = JSON.parse(JSON.stringify(history[history.length - 1]));
    const position = row*3+col;
    current.squares[position] = currentBoard.nextTurn === currentBoard.userId1 ? "X" : "O";

    if (calculateWinner(current)) {
      newWinner = currentBoard.nextTurn;
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
    const data = {
      boardId,
      name,
      userId1,
      history: [
        {
          squares: [null,null,null,null,null,null,null,null,null]
        }
      ]
    };
    let checkDuplicate= await getBoard(boardId);
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
      from
    };
    let newChat = currentBoard.chat.slice(0,currentBoard.chat.length);
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
      res=await BoardModel.find({ boardId });
    } catch (err){
      return "err";
    }
    return (res.length ? res[0] : undefined);
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
