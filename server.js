const express = require('express');
const http = require("http");
const app = express();
const server = http.createServer(app);
const shortid = require('shortid');


const socket = require("socket.io");
const io = socket(server);

const rooms = {};

io.on('connection', socket => {

    // Create room ID
    socket.on("createRoom", (data) => {
      rooms[data['roomID']] = socket.id
      console.log("received new rooms: ", rooms)

    })

    // Give user their ID
    socket.emit("yourID", socket.id);

    socket.on("connectRoom", (data) => {
      io.to(rooms[data.roomToJoin]).emit('hey', {signal: data.signalData, from: data.from})
    })

    socket.on("acceptIncoming", (data) => {
      io.to(data.to).emit('acceptIncoming', data.signal);
  })

});

const port = process.env.PORT || 8080;

// console.log that your server is up and running
server.listen(8080, () => console.log('server is running on port 8080'));
