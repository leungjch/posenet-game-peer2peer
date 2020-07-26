import io from 'socket.io-client'

var p5 = require('p5');

var peerSketch = function(p) {
    var setupListeners = true;
    var canvas;
    var peerVideo;
    var peerBounds;
    var icons;
    var MYWIDTH; 
    var MYHEIGHT;
    var setupDimsOnce = true
    // connect to host

    p.setup = function() {
        // socket = io();
        // socket.current = io.connect("/");

        peerVideo = document.getElementById("partner")
        peerBounds = peerVideo.getBoundingClientRect();

        MYWIDTH = peerVideo.clientWidth;
        MYHEIGHT = peerVideo.clientHeight;
        console.log("width and height are", MYWIDTH, MYHEIGHT)
        canvas = p.createCanvas(MYWIDTH,MYHEIGHT);
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
    
                p.socket.current.on("receiveCanvas", (data) => {

                    peerVideo = document.getElementById("partner") //suspect
                    peerBounds = peerVideo.getBoundingClientRect();
                    canvas.position(peerBounds.left,peerBounds.top);
                    canvas.style('z-index', '1');
        

                    console.log("width is", data.originalWidth, MYWIDTH)
                    // console.log(`peerCanvas: received specific message from ${data.from}`)
                    // console.log("otherScore is", data.hp)
                    p.clear();
                    
                    // Draw background
                    p.background('rgba(255,255,255, 0.25)')
                    p.fill(255, 255, 0);

                    // Draw player
                    // p.ellipse(data.playerHead.x, data.playerHead.y, data.playerHead.r);
                    // Show other player

                    // Scale the normalized player coordinates
                    var playerHeadx = data.playerHead.x / data.originalWidth * MYWIDTH;
                    var playerHeady = data.playerHead.y / data.originalHeight * MYHEIGHT;
                    var playerHeadr = data.playerHead.r / data.originalWidth * MYWIDTH;
    
                    var playerLeftx = data.playerLeft.x / data.originalWidth * MYWIDTH;
                    var playerLefty = data.playerLeft.y / data.originalHeight * MYHEIGHT;
                    var playerLeftr = data.playerLeft.r / data.originalWidth * MYWIDTH;
    
                    var playerRightx = data.playerRight.x/ data.originalWidth * MYWIDTH;
                    var playerRighty = data.playerRight.y/ data.originalHeight * MYHEIGHT;
                    var playerRightr = data.playerRight.r/ data.originalWidth * MYWIDTH;


                    p.image(icons['cat'], playerHeadx-playerHeadr/2, playerHeady-playerHeadr/2, playerHeadr, playerHeadr)

                    p.image(icons['fist'], playerLeftx-playerLeftr/2, playerLefty-playerLeftr/2, playerLeftr, playerLeftr)
                    p.image(icons['fist'], playerRightx-playerRightr/2, playerRighty-playerRightr/2, playerRightr, playerRightr)
            

                    for (let enemy of data.enemies)
                    {
                        var enemyIcon;
                        if (enemy.type === "roamer")
                        {
                            enemyIcon = icons['alien']
                        }
                        else if (enemy.type === "seeker")
                        {
                            enemyIcon = icons['evil']
                        }
                        else if (enemy.type === "robot")
                        {
                            enemyIcon = icons['robot']
                        }
                        
                        // expand out normalized coordinates
                        var enemyx = enemy.circle.x / data.originalWidth * MYWIDTH
                        var enemyy = enemy.circle.y / data.originalHeight *MYHEIGHT
                        var enemyr = enemy.circle.r / data.originalWidth * MYWIDTH

                        p.image(enemyIcon, enemyx-enemyr/2, enemyy-enemyr/2, enemyr, enemyr)

                        // Draw HP
                        p.fill(0,0,0)
                        p.textSize(100)
                        p.text(Math.floor(data.playerHP), playerHeadx-playerHeadr/2, playerHeady-playerHeadr/2)
            
                    }
                    });
                p.socket.current.on("receivePeerScore", (data) => {
                    p.remove();
                });



            p.resizeCanvas(peerVideo.clientWidth, peerVideo.clientHeight)

            setupListeners = false;

        }
    }

}
export {peerSketch}