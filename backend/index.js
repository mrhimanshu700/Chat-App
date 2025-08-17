require('dotenv').config();
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const data=require('./src/data/data.js')
const dbConnection= require("./src/config/dataBase.connection.js")
const userRoutes= require("./src/route/userRoutes.js")
const chatRoutes= require("./src/route/chatRoutes.js")
const messageRoutes= require("./src/route/messageRoutes.js")
const app = express()
const port =process.env.PORT||  3000
const dbUrl = process.env.MONGODB_URL;
app.use(
  cors({
  origin: [
    'http://localhost:5173', 
    'https://chat-app-akyx.onrender.com'
  ],
    credentials: true,
  })
);
app.use(bodyParser.json());

dbConnection();  

app.use(express.json()); // to accept json data

app.get("/",(req,res)=>{
  res.send(" server runing succesfully");
})
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)


const server=app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
   cors: {
     origin: [
    'http://localhost:5173', 
    'https://chat-app-akyx.onrender.com'
  ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id); 
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
  });
   socket.on("typing", (room) => socket.in(room).emit("typing"));
   socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
  });

});
