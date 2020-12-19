let mongoose = require("mongoose");
let nodemailer = require("nodemailer");
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
  this.getModel = () => {
    return UserModel;
  };

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

  // Chức năng Register
  this.addUserByCredential = function (credential, result) {
    UserModel.create(
      { ...credential, status: "offline", board: "", isValidated: false },
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
        text: `http://localhost:3000/validate?username=${username}`, // Nội dung mail dạng text
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

module.exports = new User();
