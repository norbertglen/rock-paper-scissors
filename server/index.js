require("dotenv").config();
const express = require("express"),
  app = (module.exports.app = express());
const path = require("path");
const randomstring = require("randomstring");
const http = require("http");
const socket = require("socket.io");
const { checkWin } = require("./utils");

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});

const io = socket(server);

let players = {};

let firstPlayerChoice, opponentChoice;

io.on("connection", (socket) => {
  console.log("connection established");

  socket.on("joinGameEvent", (data) => {
    socket.join(data.roomId);
    socket.to(data.roomId).emit("newPlayerJoinEvent", {
      opponent: data.name,
      currentPlayer: players[data.roomId],
    });

    socket.emit("newPlayerJoinEvent", {
      opponent: players[data.roomId],
      currentPlayer: data.name,
    });
  });

  socket.on("createGame", (data) => {
    const roomId = randomstring.generate({ length: 4 });
    socket.join(roomId);
    players[roomId] = data.name;
    socket.emit("gameCreated", {
      roomId: roomId,
    });
  });

  socket.on("userPlayed", (data) => {
    if (data.currentPlayer) {
        firstPlayerChoice = data.currentPlayer;
    }
    if (data.opponent) {
        opponentChoice = data.opponent
    }
    if (firstPlayerChoice && opponentChoice) {
      console.log({ firstPlayerChoice, opponentChoice})
       processChoices(data.roomId);
    }
  });

  socket.on("disconnect", function (data) {
    console.log("disconnection triggered...", data);
    //TODO: Send notification to room for disconnect event
  });

  const processChoices = (roomId) => {
    var isWin = checkWin(firstPlayerChoice, opponentChoice);
    console.log('Emitting score processed')
    io.sockets.to(roomId).emit("scoreProcessed", {
      isWin,
    });
    opponentChoice = null;
    firstPlayerChoice = null;
  };
});
