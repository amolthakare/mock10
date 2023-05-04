const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");
const { User } = require("./routes/user.route");
const app = express();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { authentication } = require("./middleware/authentication");
const formateMessage = require("./msg/message");
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.json());
app.use(cors({ origin: "*" }));
// app.use("/",(err,res)=>{
//     res.send("welcome to the mock");
// })

app.use("/", User);
// app.use(authentication)
io.on("connection", (socket) => {
  socket.on("send-message", async ({ username,receive, text }) => {
    const new_msg = new formateMessage({ username,receive, text });
    await new_msg.save();

    io.to(receive).emit("r_msg", new_msg)
  });

//   socket.on("join-room", (room) => {
//     console.log(`${socket.id} joined`);
//     socket.join(room);
//   });
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("connected to mongo");
  } catch (err) {
    console.log("msg:", err);
  }
  console.log(`connected to port ${process.env.port} successfully`);
});
