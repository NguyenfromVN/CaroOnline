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

class Board {

  // Chức năng xem 1 board với id
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

  // Chức năng xem tất cả các board
  getAllBoards = function (result) {
    BoardModel.find()
      .then((res) => {
        result(null, res);
      })
      .catch((err) => {
        result(null, err);
      });
  };

  // Chức năng thêm board mới
  addBoard = function (user, form, result) {
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

  // Bắt đầu game
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

  // Kết thúc game
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
