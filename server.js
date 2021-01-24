const path = require("path");
const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(1337, function () {
  console.log("The server is listening on port 1337!");
});

var io = socketio(server);

let activeSockets = [];

io.on("connection", function (socket) {
  console.log("A new client has connected!");
  console.log(socket.id);

  socket.broadcast.emit("userJoin", socket.id);

  socket.on("call-user", () => {});
});
