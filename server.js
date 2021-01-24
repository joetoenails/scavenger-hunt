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

  if (activeSockets.length === 2) {
    activeSockets.shift();
    activeSockets.push(socket.id);
  } else {
    activeSockets.push(socket.id);
  }

  if (activeSockets.length === 2) {
    socket.broadcast.emit("usersReady", activeSockets);
    socket.emit("usersReady", activeSockets);
  } else {
    socket.broadcast.emit("notReady", "nope");
    socket.emit("notReady", "nope");
  }

  socket.on("disconnect", () => {
    activeSockets = activeSockets.filter((conn) => conn !== socket.id);
    console.log(socket.id, " has left the building");
    if (activeSockets.length === 2) {
      socket.broadcast.emit("usersReady", activeSockets);
      socket.emit("usersReady", activeSockets);
    } else {
      socket.broadcast.emit("notReady", "nope");
      socket.emit("notReady", "nope");
    }
  });
});
