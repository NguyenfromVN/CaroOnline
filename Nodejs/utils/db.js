let mongoose = require("mongoose");

const server = `mongodb+srv://bindzo:binbin@cluster0.kpwkn.mongodb.net/caroonline?retryWrites=true&w=majority
`; // REPLACE WITH YOUR DB SERVER
const database = "caroonline"; // REPLACE WITH YOUR DB NAME
const atlas = process.env.DATABASE_URL;

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
