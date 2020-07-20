const express = require('express');
const http = require("http");
const path = require('path');
const shortid = require('shortid');
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);


const io = socket(server);

const rooms = {};
const port = process.env.PORT || 8080;


io.on('connection', socket => {

  // If user has disconnected, remove the room
  socket.on('disconnect', (reason) => {
    io.to(socket.id).emit('kick', {msg: "You've disconnected"})
    for (var room in rooms)
    {
      if (rooms.hasOwnProperty(room) && rooms[room] === socket.id)
      {
        delete rooms[room];
      }
    }

    console.log(`${socket.id} has left`)
    console.log("rooms is now", rooms)
  });

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

    socket.on("sendReady", (data) => {
      console.log("received indicate ready on server")
      io.to(data.to).emit("receiveReady", {isReady: data.isReady})
    })

});


app.use(express.static(path.resolve(__dirname, '../client/build')));

 // All remaining requests return the React app, so it can handle routing.
 app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// console.log that your server is up and running
server.listen(port, () => console.log('server is running on port 8080'));
