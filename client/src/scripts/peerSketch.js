import io from 'socket.io-client'

var p5 = require('p5');

var peerSketch = function(p) {
    var setupListeners = true;
    var canvas;
    var peerVideo;
    var peerBounds;
    var setupDimsOnce = true
    // connect to host

    p.setup = function() {
        // socket = io();
        // socket.current = io.connect("/");

        peerVideo = document.getElementById("partner")
        peerBounds = peerVideo.getBoundingClientRect();


        canvas = p.createCanvas(peerVideo.clientWidth,peerVideo.clientHeight);
        console.log("peer dims is", peerBounds)
        canvas.position(peerBounds.left,peerBounds.top);
        canvas.style('z-index', '1');
        // p.background(100)
        // console.log('hi this is peer')
    }

    p.draw = function() {
        // Set up interval to receive and send canvas data

        if (setupListeners)
        {

            peerVideo = document.getElementById("partner")
            peerBounds = peerVideo.getBoundingClientRect();
    
            setInterval(() => {
                p.socket.current.on("receiveCanvas", (data) => {
                    // console.log(`peerCanvas: received specific message from ${data.from}`)
                    // console.log("otherScore is", data.hp)
                    p.clear();
                    p.background('rgba(255,255,255, 0.50)')
                    p.fill(255, 255, 0);
                    p.ellipse(data.myHead.x, data.myHead.y, data.myHead.r);
            
                    });
            }, 500);


            p.resizeCanvas(peerVideo.clientWidth, peerVideo.clientHeight)

            setupListeners = false;

        }
    }

}
export {peerSketch}