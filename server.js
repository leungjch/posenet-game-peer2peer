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
    if (!rooms[socket.id]) {
      rooms[socket.id] = socket.id;
    }
    socket.emit("yourID", socket.id);


    console.log("rooms is", rooms)

    socket.on("connectRoom", (data) => {
      io.to(data.roomToJoin).emit('hey', {signal: data.signalData, from: data.from})
    })

});

const port = process.env.PORT || 8080;

// console.log that your server is up and running
server.listen(8080, () => console.log('server is running on port 8000'));
