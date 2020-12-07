let mongoose = require("mongoose");
let userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  status: String,
  board: String,
  email: String,
  history: Array,
  friends: Array,
  elo: Number,
});

let UserModel = mongoose.model("User", userSchema);

class User {
  getModel = () => {
    return UserModel;
  };
  getUserByCredential = function (credential, result) {
    UserModel.find({
      username: credential.username, // search query
      password: credential.password,
    })
      .then((res) => {
        console.log(res);
        result(null, res);
      })
      .catch((err) => {
        console.log(err);
        result(null, err);
      });
  };
  addUserByCredential = function (credential, result) {
    UserModel.create(
      { ...credential, status: "offline", elo: 0, board: ""},
      function (err, res) {
        if (err) return result(null, err);
        result(null, res);
      }
    );
  };
  addBoardToUser = function (boardId, user) {
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
