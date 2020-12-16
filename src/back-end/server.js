const express = require("express");
const ws=require('ws');
const app = express();
const wss=new ws.Server({noServer:true});
const bodyParser = require("body-parser");
const db = require("./utils/db");
const cors = require("cors");
const passport = require("passport");
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

const server=app.listen(port);

console.log("API server started on: " + port);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require("./routes/appRoutes"); //importing route
routes(app, passport); //register the route
let fbLogin = require("./utils/facebookLogin"); //importing facebook login
fbLogin(passport);

// global variable to store active users list
const activeUsers={};

// API to get active users
app.get('/active-users',(req,res)=>{
  res.send(activeUsers);
});

// helpers for active users
function addNewActiveUser(userId){
  activeUsers[userId]=(activeUsers[userId] | 0)+1;
}

function removeActiveUser(userId){
  activeUsers[userId]-=1;
  if (activeUsers[userId]==0){
      delete activeUsers[userId];
  }
}

// WEB SOCKET
const topics=(()=>{
  // private
  let topics={};

  // public
  function subscribeToTopic(topicName,socket,userId,socketId){
      if (!topics[topicName])
          topics[topicName]={};
      if (!topics[topicName][userId])
          topics[topicName][userId]={};
      topics[topicName][userId][socketId]=socket;
      console.log(topics);
  }

  function removeSubscription(topicName,userId,socketId){
      let usersConnections=Object.keys(topics[topicName][userId]).length;
      if (usersConnections==1){
          delete topics[topicName][userId];
      } else {
          delete topics[topicName][userId][socketId];
      }
      let numberOfSubscribers=Object.keys(topics[topicName]).length;
      if (numberOfSubscribers==0){
          delete topics[topicName];
      }
      console.log(topics);
  }

  function broadcastChange(topicName){
      for (let userId in topics[topicName]){
          for (let socketId in topics[topicName][userId]){
              let socket=topics[topicName][userId][socketId];
              socket.send(`${topicName}>>>has new update`);
          }
      }
  }

  return {
      subscribeToTopic,
      removeSubscription,
      broadcastChange
  }
})();

wss.on('connection',(socket,req)=>{
  // each user can have more than one connection, each connection will be identified by a random number
  // each connection can have a lot of following topics, so use an array to store these
  let topics = ['general']; // by default, every connection subscribes to "general" topic
  let userId=req.url.split('?')[1].split('=')[1];
  let socketId=Math.random();
  topics.subscribeToTopic('general',socket,userId,socketId);
  addNewActiveUser(userId);
  topics.broadcastChange('general'); // use this topic for general or private notification

  socket.on('message',msg=>{
      console.log(`Message from user ${userId}:`);
      console.log(msg);
      // do something
  });

  socket.on('close',()=>{
      console.log(`User ${userId} disconnected`);
      topics.removeSubscription('general',userId,socketId,socketId);
      removeActiveUser(userId);
      topics.broadcastChange('general');
  })
});

server.on('upgrade',(req,socket,head)=>{
  wss.handleUpgrade(req,socket,head,socket=>{
      wss.emit('connection',socket,req);
  });
});

// a topic needs to be defined as an object with 3 properties: onSubscribe, onChange, onRemove
// const topic = { general, gameChat, gameGrid, gameHistory }