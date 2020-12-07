let mongoose = require("mongoose");
const User = require("./user.js");
let boardSchema = new mongoose.Schema({
  id: String,
  name: String,
  password: String,
  listUser: Array,
  status: String,
  firstTimer: Number,
  secondTimer: Number,
  date: Date,
  move: Array
});
let BoardModel = mongoose.model("Board", boardSchema);

class Board {
  getBoardById = function (boardId, result) {
    BoardModel.find({
      id: boardId, // search query
    })
      .then((res) => {
        result(null, res);
      })
      .catch((err) => {
        result(null, err);
      });
  };
  getAllBoards = function (result) {
    BoardModel.find()
      .then((res) => {
        result(null, res);
      })
      .catch((err) => {
        result(null, err);
      });
  };
  addBoard = function (user, form, result) {
    const data = {
      ...form,
      status: "open",
      data: new Date(),
      listUser: [user],
    };
    User.addBoardToUser(form.id, user);
    BoardModel.create(data, function (err, res) {
      if (err) return result(null, err);
      result(null, res);
    });
  };
  joinBoard = function (user, form, result) {
    const data = {
      ...form,
      status: "open",
      data: new Date(),
      listUser: [user],
    };
    User.addBoardToUser(form.id, user);
    BoardModel.create(data, function (err, res) {
      if (err) return result(null, err);
      result(null, res);
    });
  };
  startBoard = (id,result) => {
    BoardModel.updateOne(
      {id},
      {status: "play"},
      (err, res) => {
        if (err) return result(null, err);
        result(null, res);
      }
    )
  }
  endBoard  = (id,result) => {
    BoardModel.updateOne(
      {id},
      {status: "end"},
      (err, res) => {
        if (err) return result(null, err);
        result(null, res);
      }
    )
  }
}

module.exports = new Board();
