const express = require("express");
const ws = require("ws");
const app = express();
const wss = new ws.Server({ noServer: true });
const bodyParser = require("body-parser");
const db = require("./utils/db");
const cors = require("cors");
const passport = require("passport");
const User = require("./models/user");
port = process.env.PORT || 3001;
const session = require("express-session");

app.use(
  session({
    secret: "123",
  })
);

//Khởi tạo passport
app.use(passport.initialize());
app.use(passport.session());

const server = app.listen(port);

console.log("API server started on: " + port);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require("./routes/appRoutes"); //importing route
routes(app, passport); //register the route
let fbLogin = require("./utils/facebookLogin"); //importing facebook login
let ggLogin = require("./utils/googleLogin"); //importing google login
fbLogin(passport);
ggLogin(passport);

// global variable to store active users list
const activeUsers = {};

// API to get users list
app.get('/users', (req, res) => {
  User.getAllUsers(function (err, users) {
    if (err) {
      res.send(err);
      return;
    }
    let arr = [];
    users.forEach(user => {
      arr.push({ username: user.username, isActive: false, email: user.email });
      if (activeUsers[user.username]) {
        arr[arr.length - 1].isActive = true;
      }
    });
    res.json(arr);
  });
});

// helpers for active users
function addNewActiveUser(userId) {
  activeUsers[userId] = (activeUsers[userId] | 0) + 1;
}

function removeActiveUser(userId) {
  activeUsers[userId] -= 1;
  if (activeUsers[userId] == 0) {
    delete activeUsers[userId];
  }
}

// helpers
function isPlayersTopic(topic) {
  let arr = topic.split('-');
  return (arr[arr.length - 1] == 'players');
}

// WEB SOCKET
const topics = (() => {
  // private
  let topics = {};

  // public
  function subscribeToTopic(topicName, socket, userId, socketId) {
    if (!topics[topicName]) topics[topicName] = {};
    if (!topics[topicName][userId]) topics[topicName][userId] = {};
    topics[topicName][userId][socketId] = socket;
    console.log(topics);
  }

  function removeSubscription(topicName, userId, socketId) {
    let usersConnections = Object.keys(topics[topicName][userId]).length;
    if (usersConnections == 1) {
      delete topics[topicName][userId];
    } else {
      delete topics[topicName][userId][socketId];
    }
    let numberOfSubscribers = Object.keys(topics[topicName]).length;
    if (numberOfSubscribers == 0) {
      delete topics[topicName];
    }
    console.log(topics);
  }

  function broadcastChange(topicName, message) {
    if (!topics[topicName])
      return;
    let msg = `${topicName}>>>` + (message ? message : 'has new updates');
    if (isPlayersTopic(topicName)) {
      msg = `${topicName}:${Object.keys(topics[topicName]).length}>>>` + (message ? message : 'has new updates');
    }
    for (let userId in topics[topicName]) {
      for (let socketId in topics[topicName][userId]) {
        let socket = topics[topicName][userId][socketId];
        socket.send(msg);
      }
    }
  }

  return {
    subscribeToTopic,
    removeSubscription,
    broadcastChange,
  };
})();

wss.on("connection", (socket, req) => {
  // each user can have more than one connection, each connection will be identified by a random number
  // each connection can have a lot of following topics, so use an array to store these
  let topicsList = [];
  let userId = decodeURI(req.url.split("?")[1].split("=")[1]);
  let socketId = Math.random();
  addNewActiveUser(userId);
  topics.broadcastChange("usersList");

  socket.on("message", (msg) => {
    console.log(`Message from user ${userId}:`);
    console.log(msg);
    if (msg.split(">>>")[1] == "subscribe") {
      // want to subscribe a topic
      const topic = msg.split('>>>')[0];
      topics.subscribeToTopic(topic, socket, userId, socketId);
      if (isPlayersTopic(topic)) {
        topics.broadcastChange(msg.split(">>>")[0]);
      }
      topicsList.push(msg.split(">>>")[0]);
    } else {
      // some changes happend
      const message = msg.split('>>>')[1].split(':')[1];
      topics.broadcastChange(msg.split(">>>")[0], message);
    }
  });

  socket.on("close", () => {
    console.log(`User ${userId} disconnected`);
    topicsList.forEach((topic) => {
      topics.removeSubscription(topic, userId, socketId, socketId);
      if (isPlayersTopic(topic)) {
        topics.broadcastChange(topic);
      }
    });
    topicsList = [];
    removeActiveUser(userId);
    topics.broadcastChange('usersList');
  });
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (socket) => {
    wss.emit("connection", socket, req);
  });
});
