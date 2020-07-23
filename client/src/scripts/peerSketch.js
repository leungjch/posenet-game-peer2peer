import io from 'socket.io-client'

var p5 = require('p5');

var peerSketch = function(p) {
    var setupListeners = true;
    // connect to host

    p.setup = function() {
        // socket = io();
        // socket.current = io.connect("/");

        p.createCanvas(800,800);
        p.background(100)
        console.log('hi this is peer')
    }

    p.draw = function() {
        // Set up interval to receive and send canvas data
        if (setupListeners)
        {
            setInterval(() => {
                p.socket.current.on("receiveCanvas", (data) => {
                    console.log(`peerCanvas: received specific message from ${data.from}`)
                    console.log("otherScore is", data.hp)
                    });
            }, 5000);

            setupListeners = false;

        }
    }

}
export {peerSketch}