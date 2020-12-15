let mongoose = require("mongoose");

// Tạo schema
let userSchema = new mongoose.Schema({
   
});

// Tạo model
let UserModel = mongoose.model("User", userSchema);

function User() {
  this.getModel = () => {
    return UserModel;
  };

  //Chức năng login
  this.getUserByCredential = function (credential, result) {
    UserModel.find(
      {
        username: credential.username, // search query
        password: credential.password,
      }
    )
      .then((res) => {
        console.log(res, "res");
        result(null, res);
      })
      .catch((err) => {
        console.log(err, "err");
        result(null, err);
      });
  };

  // Chức năng Register
  this.addUserByCredential = function (credential, result) {
    UserModel.create(
      { ...credential, status: "offline", elo: 0, board: "" },
      function (err, res) {
        if (err) return result(null, err);
        result(null, res);
      }
    );
  };

  // Chức năng join vào 1 board
  this.addBoardToUser = function (boardId, user) {
    UserModel.updateOne(
      { username: user.username },
      { board: boardId, status: "in-game" },
      function (err, res) {
        if (err) return result(null, err);
        result(null, res);
      }
    );
  };
}

module.exports = new User();
