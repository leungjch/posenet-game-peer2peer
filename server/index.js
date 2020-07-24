const express = require('express');
const http = require("http");
const path = require('path');
const shortid = require('shortid');
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socket(server, {pingTimeout: 3600000});

const rooms = {};
const port = process.env.PORT || 8080;


io.on('connection', socket => {

  // If user has disconnected, remove the room
  socket.on('disconnect', (reason) => {

    for (var room in rooms)
    {
      console.log("looping", room, "looking for", socket.id)

      if (rooms.hasOwnProperty(room) && rooms[room].includes(socket.id))
      {
        // Emit disconnect message to all clients in room
        socket.emit('kick', {msg: "Someone disconnected"}) // This doesn't work
        delete rooms[room];
      }
    }
    console.log(`${socket.id} has left because ${reason}`)
    console.log("rooms is now", rooms)
    });

    // Create room ID
    socket.on("createRoom", (data) => {
      rooms[data['roomID']] = [socket.id]
      console.log("received new rooms: ", rooms)
    })

    // Give user their ID
    socket.emit("yourID", socket.id);

    socket.on("connectRoom", (data) => {
      io.to(rooms[data.roomToJoin]).emit('hey', {signal: data.signalData, from: data.from})
      console.log("someone is connecting")
    })

    // Inviting user has accepted incoming user
    socket.on("acceptIncoming", (data) => {
      io.to(data.to).emit('acceptIncoming', {signal: data.signal, from: data.from});
      rooms[data.roomID].push(data.from) // Add other user ID to the room
    })

    // Either peers have changed their ready status
    socket.on("sendReady", (data) => {
      console.log(`emit ready from ${data['from']}`)
      io.to(data.to).emit("receiveReady", {isReady: data.isReady})
    })

    socket.on("hello", () => {
      console.log("received hello from sketch")
    })

    // Relay canvas data to other user
    // Either peers have changed their ready status
    socket.on("sendCanvas", (data) => {
      io.to(data['to']).emit("receiveCanvas", data)
    });

});


app.use(express.static(path.resolve(__dirname, '../client/build')));

 // All remaining requests return the React app, so it can handle routing.
 app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// console.log that your server is up and running
server.listen(port, () => console.log('server is running on port 8080'));
