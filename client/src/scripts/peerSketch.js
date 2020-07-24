import io from 'socket.io-client'

var p5 = require('p5');

var peerSketch = function(p) {
    var setupListeners = true;
    var canvas;
    var peerVideo;
    var peerBounds;
    var icons;
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

        icons = {  'grin': p.loadImage('./icons/grinning_msft.png'),
                    'fist': p.loadImage('./icons/fist_msft.png'),
                    'evil': p.loadImage('./icons/evil_msft.png'),
                    'alien': p.loadImage('./icons/alien_msft.png'),
                    'pain': p.loadImage('./icons/pain_msft.png'),
                    'robot': p.loadImage('./icons/robot_msft.png'),
                    'cat': p.loadImage('./icons/cat_msft.png')
        }
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
                    
                    // Draw background
                    p.background('rgba(255,255,255, 0.50)')
                    p.fill(255, 255, 0);

                    // Draw player
                    // p.ellipse(data.playerHead.x, data.playerHead.y, data.playerHead.r);
                    // Show other player

                    // Draw HP
                    p.fill(0,0,0)
                    p.textSize(100)
                    p.text(Math.floor(data.playerHP), data.playerHead.x-data.playerHead.r/2, data.playerHead.y-data.playerHead.r/2)

                    
                    p.image(icons['cat'], data.playerHead.x-data.playerHead.r/2, data.playerHead.y-data.playerHead.r/2, data.playerHead.r, data.playerHead.r)


                    p.image(icons['fist'], data.playerLeft.x-data.playerLeft.r/2, data.playerLeft.y-data.playerLeft.r/2, data.playerLeft.r, data.playerLeft.r)

                    p.image(icons['fist'], data.playerRight.x-data.playerRight.r/2, data.playerRight.y-data.playerRight.r/2, data.playerRight.r, data.playerRight.r)
            

                    // for (let enemy of data.enemies)
                    // {
                    //     var enemyIcon;
                    //     if (enemy.type === "roamer")
                    //     {
                    //         enemyIcon = icons['alien']
                    //     }
                    //     else if (enemy.type === "seeker")
                    //     {
                    //         enemyIcon = icons['evil']
                    //     }
                    //     else if (enemy.type === "robot")
                    //     {
                    //         enemyIcon = icons['robot']
                    //     }

                    //     p.image(enemyIcon, enemy.circle.x-enemy.circle.r/2, enemy.circle.y-enemy.circle.r/2, enemy.circle.r, enemy.circle.r)

                        
                    // }

                    });
            }, 50);


            p.resizeCanvas(peerVideo.clientWidth, peerVideo.clientHeight)

            setupListeners = false;

        }
    }

}
export {peerSketch}