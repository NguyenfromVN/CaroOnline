let mongoose = require("mongoose");

const server = `mongodb+srv://bindzo:binbin@cluster0.kpwkn.mongodb.net/caroonline?retryWrites=true&w=majority
`; // REPLACE WITH YOUR DB SERVER

const connectionParams = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
class Database {
  constructor() {
    this._connect();
  }
  _connect() {
    mongoose
    //Kết nối với db, nếu Back-end đang trên host sẽ chọn đường dẫn process.env.DATABASE_URL
      .connect(process.env.DATABASE_URL || server, connectionParams)
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }
}

module.exports = new Database();
