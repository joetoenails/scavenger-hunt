const path = require("path");
const express = require("express");
const app = express();
const socketio = require("socket.io");

const PORT = proce.ENV.PORT || 1337;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(PORT, function () {
  console.log(`The server is listening on port ${PORT}`);
});

var io = socketio(server);

let connectedUsers = [];

io.on("connection", function (socket) {
  console.log("A new client has connected!");

  connectedUsers.push(socket.id);

  // Emit to myself the other users connected array to start a connection with each them
  const otherUsers = connectedUsers.filter(
    (socketId) => socketId !== socket.id
  );
  socket.emit("other-users", otherUsers);

  // Send Offer To Start Connection
  socket.on("offer", (socketId, description) => {
    socket.to(socketId).emit("offer", socket.id, description);
  });

  // Send Answer From Offer Request
  socket.on("answer", (socketId, description) => {
    socket.to(socketId).emit("answer", description);
  });

  // Send Signals to Establish the Communication Channel
  socket.on("candidate", (socketId, candidate) => {
    socket.to(socketId).emit("candidate", candidate);
  });

  // Remove client when socket is disconnected
  socket.on("disconnect", () => {
    connectedUsers = connectedUsers.filter(
      (socketId) => socketId !== socket.id
    );
  });
});
