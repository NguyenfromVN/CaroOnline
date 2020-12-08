let mongoose = require("mongoose");
const User = require("./user.js");

//Tạo schema
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

//Tạo model
let BoardModel = mongoose.model("Board", boardSchema);

function Board() {

  // Chức năng xem 1 board với id
  this.getBoardById = function (boardId, result) {
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

  // Chức năng xem tất cả các board
  this.getAllBoards = function (result) {
    BoardModel.find()
      .then((res) => {
        result(null, res);
      })
      .catch((err) => {
        result(null, err);
      });
  };

  // Chức năng thêm board mới
  this.addBoard = function (user, form, result) {
    const data = {
      ...form,
      status: "open",
      data: new Date(),
      listUser: [user],
    };

    //Khi thêm board thì người tạo sẽ là người chơi
    User.addBoardToUser(form.id, user);
    BoardModel.create(data, function (err, res) {
      if (err) return result(null, err);
      result(null, res);
    });
  };

  //Khi 1 người dùng khác join vào board
  this.joinBoard = function (user, form, result) {
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

  // Bắt đầu game
  this.startBoard = (id,result) => {
    BoardModel.updateOne(
      {id},
      {status: "play"},
      (err, res) => {
        if (err) return result(null, err);
        result(null, res);
      }
    )
  }

  // Kết thúc game
  this.endBoard  = (id,result) => {
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
