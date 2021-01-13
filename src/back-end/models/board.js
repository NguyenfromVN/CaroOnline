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
  winLine: Array,
  lastTurn: Number,
  hidden: Boolean
});

//Tạo model
let BoardModel = mongoose.model("Board", boardSchema);

function Board() {
  this.getGrid = async function (boardId, stepNum, result) {
    const currentBoard = await getBoard(boardId);
    result(
      null,
      currentBoard.history[stepNum || currentBoard.history.length - 1]
    );
  };

  this.getBoardbyId = async function (boardId, result) {
    const currentBoard = await getBoard(boardId);
    result(null, currentBoard);
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
    const newLastTurn = new Date().getTime();
    const newNextTurn =
      currentBoard.nextTurn === currentBoard.userId1
        ? currentBoard.userId2
        : currentBoard.userId1;
    let newWinner = "";
    let history = currentBoard.history.slice(0, newStepNum);
    let record = {};
    const current = JSON.parse(JSON.stringify(history[history.length - 1]));
    const position = row * 20 + col;

    current.squares[position] =
      currentBoard.nextTurn === currentBoard.userId1 ? "X" : "O";
    const winnerCheck = calculateWinner(
      current.squares,
      row,
      col,
      current.squares[position]
    );
    if (winnerCheck.win) {
      newWinner = currentBoard.nextTurn;
      record = await User.setPlayerTrophy(newWinner, newNextTurn, boardId);
    }

    history = history.concat(current);

    BoardModel.updateOne(
      { boardId },
      {
        history,
        stepNum: newStepNum,
        nextTurn: newNextTurn,
        winner: newWinner,
        winLine: winnerCheck.winLine,
        lastTurn: newLastTurn,
      },
      (err, res) => {
        if (err) return result(null, err);
        result(null, { winnerCheck, winner: newWinner, record });
      }
    );
  };

  this.surrender = async function (boardId, username, result) {
    const currentBoard = await getBoard(boardId);
    console.log(currentBoard);
    const newWinner =
      username === currentBoard.userId1
        ? currentBoard.userId2
        : currentBoard.userId1;
    record = await User.setPlayerTrophy(newWinner, username, boardId);

    BoardModel.updateOne(
      { boardId },
      {
        winner: newWinner,
      },
      (err, res) => {
        if (err) return result(null, err);
        result(null, { winner: newWinner, record });
      }
    );
  };

  this.force_win = async function (boardId, username, result) {
    const currentBoard = await getBoard(boardId);
    console.log(currentBoard);
    const newWinner = username;
    record = await User.setPlayerTrophy(newWinner, currentBoard.nextTurn, boardId);

    BoardModel.updateOne(
      { boardId },
      {
        winner: newWinner,
      },
      (err, res) => {
        if (err) return result(null, err);
        result(null, { winner: newWinner, record });
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
      lastTurn: null,
      nextTurn: userId1,
      hidden: false,
      history: [
        {
          squares,
        },
      ],
    };
    let checkDuplicate = await getBoard(boardId);
    if (checkDuplicate) {
      result(null, "Board name is duplicated");
      return;
    }
    BoardModel.create(data, function (err, res) {
      if (err) {
        return result(null, "An error happened!");
      }
      result(null, "Success");
    });
  };

  this.fastPlay = async function (userId, result) {
    const allHidden = await BoardModel.find({hidden: true})
    const hiddenRoom = JSON.parse(JSON.stringify(allHidden))
    if(allHidden.length > 0){
      return await BoardModel.updateOne({ boardId: allHidden[0].boardId }, { userId2: userId, hidden: false }, (err,res)=>{
        result(null, {...hiddenRoom})
      })
    }
    let randomBoardId = '';
    let checkDuplicate = null
    do {
      randomBoardId = `Random room (${Math.random()})`;
      checkDuplicate = await getBoard(randomBoardId);
    } while (checkDuplicate)
    let squares = [...Array(BOARD_SIZE).fill(null)];
    const data = {
      boardId: randomBoardId,
      name: randomBoardId,
      userId1: userId,
      lastTurn: null,
      nextTurn: userId,
      hidden: true,
      history: [
        {
          squares,
        },
      ],
    };
    BoardModel.create(data, function (err, res) {
      if (err) {
        return result(null, result({message: "error " + err}));
      }
      result(null,{...data});
    });
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

  this.drawGame = async (boardId,result) => {
    const currentBoard = await getBoard(boardId);

    const final = await User.setPlayerDraw(currentBoard.userId1, currentBoard.userId2);

    BoardModel.updateOne(
      { boardId },
      {
        winner: 'draw game',
      },
      (err, res) => {
        if (err) return result(null, {message: "error" + err});
        result(null,  {final});
      }
    );
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
  let winLine = [{ row: tempRow, col: tempCol }];

  while (tempCol - 1 >= 0 && squares[tempRow * 20 + (tempCol - 1)] === player) {
    count++;
    tempCol--;
    winLine.push({ row: tempRow, col: tempCol });
  }
  tempCol = col;
  while (
    tempCol + 1 <= 19 &&
    squares[tempRow * 20 + (tempCol + 1)] === player
  ) {
    count++;
    tempCol++;
    winLine.push({ row: tempRow, col: tempCol });
  }
  tempCol = col;
  if (count === 4) {
    return {
      win: true,
      winLine,
    };
  }
  count = 0;
  winLine = [{ row: tempRow, col: tempCol }];
  while (tempRow - 1 >= 0 && squares[(tempRow - 1) * 20 + tempCol] === player) {
    count++;
    tempRow--;
    winLine.push({ row: tempRow, col: tempCol });
  }
  tempRow = row;
  while (
    tempRow + 1 <= 19 &&
    squares[(tempRow + 1) * 20 + tempCol] === player
  ) {
    count++;
    tempRow++;
    winLine.push({ row: tempRow, col: tempCol });
  }
  tempRow = row;
  if (count === 4) {
    return {
      win: true,
      winLine,
    };
  }
  count = 0;
  winLine = [{ row: tempRow, col: tempCol }];
  while (
    tempRow + 1 <= 19 &&
    tempCol - 1 >= 0 &&
    squares[(tempRow + 1) * 20 + tempCol - 1] === player
  ) {
    count++;
    tempRow++;
    tempCol--;
    winLine.push({ row: tempRow, col: tempCol });
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
    winLine.push({ row: tempRow, col: tempCol });
  }
  tempRow = row;
  tempCol = col;
  if (count === 4) {
    return {
      win: true,
      winLine,
    };
  }
  count = 0;
  winLine = [{ row: tempRow, col: tempCol }];
  while (
    tempRow + 1 <= 19 &&
    tempCol + 1 <= 19 &&
    squares[(tempRow + 1) * 20 + tempCol + 1] === player
  ) {
    count++;
    tempRow++;
    tempCol++;
    winLine.push({ row: tempRow, col: tempCol });
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
    winLine.push({ row: tempRow, col: tempCol });
  }
  tempRow = row;
  tempCol = col;
  if (count === 4) {
    return {
      win: true,
      winLine,
    };
  }
  return {
    win: false,
    winLine: [],
  };
};

module.exports = new Board();
