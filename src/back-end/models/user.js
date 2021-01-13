let mongoose = require("mongoose");
let nodemailer = require("nodemailer");
const config = require("../config");
// Tạo schema
let userSchema = new mongoose.Schema({
  username: String,
  password: String,
  status: String,
  board: String,
  email: String,
  history: Array,
  friends: Array,
  isValidated: Boolean,
  win: Number,
  lose: Number,
  trophy: Number,
  draw: Number,
  block: Boolean,
});

// Tạo model
let UserModel = mongoose.model("User", userSchema);

const option = {
  service: "gmail",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "phanpham1133@gmail.com", // email hoặc username
    pass: "phan@123", // password
  },
};
var transporter = nodemailer.createTransport(option);

function User() {
  this.Model = UserModel;
  //Chức năng login
  this.getUserByCredential = function (credential, result) {
    UserModel.find({
      username: credential.username, // search query
      password: credential.password,
    })
      .then((res) => {
        console.log(res, "res");
        result(null, res);
      })
      .catch((err) => {
        console.log(err, "err");
        result(null, err);
      });
  };

  this.getUserByUsername = function (username, result) {
    UserModel.find({
      username, // search query
    })
      .then((res) => {
        console.log(res, "res");
        result(null, res);
      })
      .catch((err) => {
        console.log(err, "err");
        result(null, err);
      });
  };
  // chức năng lấy tất cả user
  this.getAllUsers = (result) => {
    UserModel.find()
      .then((res) => {
        result(null, res);
      })
      .catch((err) => {
        result(null, err);
      });
  };

  // Chức năng Register
  this.addUserByCredential = function (credential, result) {
    UserModel.create(
      {
        ...credential,
        status: "offline",
        board: "",
        isValidated: false,
        win: 0,
        lose: 0,
        trophy: 0,
        draw: 0,
        block: false,
      },
      function (err, res) {
        if (err) return result(null, err);
        sendValidatedMail(credential.email, credential.username);
        result(null, res);
      }
    );
  };

  // Chức năng join vào 1 board
  this.validateUser = function (username, result) {
    UserModel.updateOne(
      { username: username },
      { isValidated: true },
      function (err, res) {
        if (err) return result(null, "error");
        result(null, "success");
      }
    );
  };

  this.changePassword = function (email, result) {
    UserModel.find({
      email: email, // search query
    })
      .then((res) => {
        if (res.length !== 0) {
          sendChangePasswordMail(email, res[0].username);
          result(null, {
            message: "Please go to your email to change your password",
          });
        } else {
          result(null, { message: "No user has been found" });
        }
      })
      .catch((err) => {
        result(null, { message: `error: ${err}` });
      });
  };

  this.updatePassword = function (email, password, result) {
    UserModel.updateOne(
      { email },
      {
        password,
      }
    )
      .then((res) => {
        result(null, { message: "password changed" });
      })
      .catch((err) => {
        result(null, err);
      });
  };

  this.getLeaderBoard = (result) => {
    UserModel.find({}, ["username", "trophy"], {
      skip: 0,
      limit: 10,
      sort: {
        trophy: -1,
      },
    })
      .then((res) => {
        console.log(res, "res");
        result(null, res);
      })
      .catch((err) => {
        console.log(err, "err");
        result(null, err);
      });
  };
  this.setPlayerTrophy = async (winnerId, loserId, boardId) => {
    const winner = await getUser(winnerId);
    const loser = await getUser(loserId);
    console.log(winner);
    UserModel.updateOne(
      { username: winnerId },
      {
        win: winner.win + 1,
        trophy: winner.trophy + 1,
        history: [...winner.history, { boardId, result: "win" }],
      },
      function (err, res) {}
    );
    UserModel.updateOne(
      { username: loserId },
      {
        lose: loser.lose + 1,
        trophy: loser.trophy - 1,
        history: [...loser.history, { boardId, result: "lose" }],
      },
      function (err, res2) {}
    );
    return {
      winner: winnerId,
      loser: loserId,
      winnerTrophy: winner.trophy + 1,
      loserTrophy: loser.trophy - 1,
    };
  };

  this.setPlayerDraw = async (userId1, userId2, boardId) => {
    const user1 = await getUser(userId1);
    const user2 = await getUser(userId2);
    UserModel.updateOne(
      { username: userId1 },
      {
        draw: user1.draw + 1,
        history: [...user1.history, { boardId, result: "draw" }],
      },
      function (err, res) {}
    );
    UserModel.updateOne(
      { username: userId2 },
      {
        draw: user2.draw + 1,
        history: [...user2.history, { boardId, result: "draw" }],
      },
      function (err, res2) {}
    );
    return {
      userId1,
      userId2,
      user1draw: user1.draw + 1,
      user2draw: user2.draw + 1,
    };
  };

  this.blockUser = async (username, blockingUser, result) => {
    if (username !== "Admin") {
      return result(null, { message: "Not allowed!" });
    }
    UserModel.updateOne(
      { username: blockingUser },
      {
        block: true,
      },
      function (err, res) {
        result(null, {
          username: blockingUser,
          block: true,
        });
      }
    );
  };

  this.searchUser = async (username, keyword, result) => {
    if (username !== "Admin") {
      return result(null, { message: "Not allowed!" });
    }
    UserModel.find({
      $or: [
        { username: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    })
      .then((res) => {
        console.log(res, "res");
        result(null, res);
      })
      .catch((err) => {
        console.log(err, "err");
        result(null, err);
      });
  };
}
const sendValidatedMail = (email, username) => {
  transporter.verify((error, success) => {
    // Nếu có lỗi.
    if (error) {
      console.log(error);
    } else {
      //Nếu thành công.
      console.log("Kết nối thành công! Gửi mail đến " + email);
      var mail = {
        from: "hpesc1133@gmail.com", // Địa chỉ email của người gửi
        to: email, // Địa chỉ email của người gửi
        subject: "Validate mail", // Tiêu đề mail
        text: `${config.FRONTEND_HOST}/validate?username=${username}`, // Nội dung mail dạng text
      };
      //Tiến hành gửi email
      transporter.sendMail(mail, function (error, info) {
        if (error) {
          // nếu có lỗi
          console.log(error);
        } else {
          //nếu thành công
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
};
const sendChangePasswordMail = (email, username) => {
  transporter.verify((error, success) => {
    // Nếu có lỗi.
    if (error) {
      console.log(error);
    } else {
      //Nếu thành công.
      console.log("Kết nối thành công! Gửi mail đến " + email);
      var mail = {
        from: "hpesc1133@gmail.com", // Địa chỉ email của người gửi
        to: email, // Địa chỉ email của người gửi
        subject: "Change password mail", // Tiêu đề mail
        text: `username: ${username} . Link: ${config.FRONTEND_HOST}/change-password?email=${email}`, // Nội dung mail dạng text
      };
      //Tiến hành gửi email
      transporter.sendMail(mail, function (error, info) {
        if (error) {
          // nếu có lỗi
          console.log(error);
        } else {
          //nếu thành công
          console.log("Email sent: " + info.response);
        }
      });
    }
  });
};
const getUser = async (username) => {
  let res;
  try {
    res = await UserModel.find({ username });
  } catch (err) {
    return "err";
  }
  return res.length ? res[0] : undefined;
};
module.exports = new User();
