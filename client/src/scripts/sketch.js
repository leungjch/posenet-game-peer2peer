
import { Player } from "./classes/player"
import { Enemy } from "./classes/enemy"
import { QuadTree, Circle, Point, Rectangle } from "./classes/quadtree"
import io from 'socket.io-client'

var p5 = require('p5');
var ml5 = require('ml5')

var sketch = function(p) {
    let video;
    let poseNet;
    let pose;
    let skeleton;

    let grin;

    let WIDTH; 
    let HEIGHT; 

    let scaleWidth;
    let scaleHeight;

    let player;

    let icons;

    let setupTime = 5 // 5 seconds to prepare before game starts
    let playTime = 60 // 60 seconds to play game

    let triggerPlay = true; // boolean that is immediately set the false when both players are both ready

    let doneSetup = false;
    let donePlay = false;
    let emitScore = true; // boolean for sending score to server once
    let setupCountdownStarted = false; // user hasn't clicked the start button
    let playCountdownStarted = false; // user hasn't clicked the start button

    let setupIntervalID;
    let playIntervalID;

    let setupListeners = true;

    let myFont;

    var socket;


    function checkCollision(x1, x2, y1, y2, r1, r2)
    {
        var distance = Math.sqrt((x1-x2)**2 + (y1-y2)**2)
        if (distance <= (r1 + r2)/2)
        {
            return true
        }
        else
        {
            return false
        }
    }

    let enemies = [];

    function gotPoses(poses) {
        //console.log(poses); 
        if (poses.length > 0) {
            pose = poses[0].pose;
            skeleton = poses[0].skeleton;

            // let eX = poses[0].pose.keypoints[1].position.x;
            // let eY = poses[0].pose.keypoints[1].position.y;
            // player.head.x = lerp(player.head.x, nX, 0.5);
            // player.head.y = lerp(player.head.y, nY, 0.5);
            // eyelX = lerp(eyelX, eX, 0.5);
            // eyelY = lerp(eyelY, eY, 0.5);
        }
    }

    p.setup = function() {

        var userVideo = document.getElementById("user")
        var userBounds = userVideo.getBoundingClientRect();


        video = p.createCapture(p.VIDEO);
        var scale = video.width/video.height;


        video.hide();

        if (p.playerMode === "multi")
        {
            WIDTH = p.windowWidth/2;
            HEIGHT = p.windowHeight;  
            WIDTH = userVideo.clientWidth;
            HEIGHT = userVideo.clientHeight;
            WIDTH = 640;
            // HEIGHT = 480;
        }
        else
        {
            WIDTH = p.windowWidth;
            HEIGHT = p.windowHeight;
            WIDTH = p.windowHeight * scale * 0.8;
            HEIGHT = p.windowHeight * 0.8 ;
            // WIDTH = 640;
            // HEIGHT = 480;
        }
        p.createCanvas(WIDTH, HEIGHT);

        player = new Player(WIDTH, HEIGHT);  
        var options = options = {
            imageScaleFactor: 0.1,
            outputStride: 16,
            flipHorizontal: false,
            minConfidence: 0.5,
            maxPoseDetections: 5,
            scoreThreshold: 0.5,
            nmsRadius: 20,
            detectionType: 'single',
            multiplier: 0.75,
        };
        // frameRate(10)

        poseNet = ml5.poseNet(video, modelLoaded, options);
        poseNet.on('pose', gotPoses);

        scaleWidth = WIDTH/video.width;
        scaleHeight = HEIGHT/video.height;

        icons = {  'grin': p.loadImage('./icons/grinning_msft.png'),
                    'fist': p.loadImage('./icons/fist_msft.png'),
                    'evil': p.loadImage('./icons/evil_msft.png'),
                    'alien': p.loadImage('./icons/alien_msft.png'),
                    'pain': p.loadImage('./icons/pain_msft.png'),
                    'robot': p.loadImage('./icons/robot_msft.png')
        }

        for (var i = 0; i < 10; i++)
        {
            enemies.push(new Enemy(icons, WIDTH, HEIGHT))
        }
    }

    function modelLoaded() {
        console.log('poseNet ready');
    }

    p.draw = function() {
        // Show webcam
        p.push();
        // Make the webcam view half transparent
        var transparencyc = p.color(255,255,255);
        transparencyc.setAlpha(p.lerp(128,0, setupTime/5))

        p.translate(WIDTH,0);  
        // We need to flip the webcam so that movement is less confusing
        // We also need to scale the webcam and pose coordinates to the screen
        // Flip webcam
        p.scale(-1, 1); 
        p.image(video, 0, 0, WIDTH, HEIGHT);
        p.fill(transparencyc)
        p.rect(0,0, WIDTH,HEIGHT)
        p.pop();
        
        // Play screen
        if (doneSetup && !donePlay)
        {
            // Show timer
            p.textSize(WIDTH/3)
            p.text(playTime, WIDTH/3, HEIGHT/2)
            play();

            if (playTime <= 0)
            {
                doneSetup = true;
                donePlay = true;
            }
        }
        // Countdown (before playing)
        else if (!doneSetup)
        {
            if (setupTime <= 0)
            {
                doneSetup = true;  
                clearInterval(setupIntervalID) 
                
                playIntervalID = setInterval(playCountDownDec, 1000);
                playCountdownStarted = true

            }
            else if (triggerPlay && setupCountdownStarted === false)
            {
                setupIntervalID = setInterval(setupCountDownDec, 1000);
                setupCountdownStarted = true
                triggerPlay = false;
            }
            else if (setupCountdownStarted)
            {
                // Show setup countdown
                p.textSize(WIDTH/4);

                p.text(setupTime, WIDTH/2, HEIGHT/2)    
            }
            else
            {
                p.textAlign(p.CENTER);
                p.fill(0)
                p.stroke(255)
                p.strokeWeight(5)

                p.textSize(WIDTH/4)
                p.fill(255)
                p.noStroke()
                p.text("Click to start!", WIDTH/2, HEIGHT/2)    
            }
        }
        // game over screen
        else if (donePlay)
        {
            // clean up
            // show score
            p.textAlign(p.CENTER);
            p.fill(0);
            p.stroke(255);
            p.strokeWeight(5);

            p.textSize(WIDTH/16);
            p.fill(0);
            p.noStroke();
            
            
            p.text("Your score: " + Math.ceil(player.hp), WIDTH/2, HEIGHT/2);

            // p.text("Play again?", WIDTH/2, 3*HEIGHT/4);

            // clear countdown and reset countdown values
            clearInterval(playIntervalID); 
            playTime = 60;
            setupTime = 5;
            setupCountdownStarted = false;
            playCountdownStarted = false

            if (emitScore)
            {
                if (p.isMulti)
                {
                    p.socket.current.emit("finalScore", {finalScore: player.hp, to: p.to, from:p.from, emitPeer:false})
                }
                else
                {
                    p.socket.current.emit("finalScore", {finalScore: player.hp, from: p.from, emitPeer:true})
                }

                emitScore = false;
                p.remove();
            }

            // Start game again if mouse clicked
            if (p.mouseIsPressed)
            {
                cleanup();

                setupIntervalID = setInterval(setupCountDownDec, 1000);
                setupCountdownStarted = true
                doneSetup = false

                donePlay = false
            }
        }
    }

    function setupCountDownDec()
    {
        setupTime -= 1
    }
    function playCountDownDec()
    {
        playTime -= 1
    }
    function init()
    {

    }

    function cleanup()
    {
        player = new Player(WIDTH, HEIGHT);
        enemies = []
    }

    function play()
    {
        // Fetch pose
        if (pose) {
        // Rough depth estimation by measuring the distance in coordinates between eyes
        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = p.dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        let f = 1/d;

        // Flip and scale pose coordinates and store them in player
        player.head.x = p.lerp(player.head.x, WIDTH - (WIDTH * pose.nose.x/video.width), 0.5);
        player.head.y = p.lerp(player.head.y, HEIGHT * pose.nose.y/video.height, 0.5);
        // player.head.r = d*10

        player.left.x = p.lerp(player.left.x, WIDTH - (WIDTH * pose.leftWrist.x/video.width), 1)
        player.left.y = p.lerp(player.left.y, HEIGHT * pose.leftWrist.y/video.height, 1)

        player.right.x = p.lerp(player.right.x, WIDTH - (WIDTH * pose.rightWrist.x/video.width),1 )
        player.right.y = p.lerp(player.right.y, HEIGHT * pose.rightWrist.y/video.height, 1)

        // Get "speed" of movements
        let kineticLeft = Math.sqrt((player.left.x - player.leftPrev.x)**2 + (player.left.y - player.leftPrev.y)**2)
        let kineticRight = Math.sqrt((player.right.x - player.rightPrev.x)**2 + (player.right.y - player.rightPrev.y)**2)
        let maxKin = Math.sqrt((WIDTH/2)**2+(HEIGHT/2)**2)
        
        // Draw punch effect
        p.strokeWeight(kineticLeft+30)
        p.stroke(255,255,255)
        p.line(player.leftPrev.x, player.leftPrev.y, player.left.x, player.left.y)
        p.strokeWeight(kineticRight)
        p.line(player.rightPrev.x, player.rightPrev.y, player.right.x, player.right.y)

        // Draw inner punch effect
        p.strokeWeight(Math.floor(kineticLeft/2)+30)
        p.stroke(197,255,253)
        p.line(player.leftPrev.x, player.leftPrev.y, player.left.x, player.left.y)
        p.strokeWeight(Math.floor(kineticRight/2)+30)
        p.line(player.rightPrev.x, player.rightPrev.y, player.right.x, player.right.y)

        // line(player.right.x, player.rightPrev.x, player.right.y, player.rightPrev.y)
        p.strokeWeight(1)
        // console.log(Math.ceil(kineticLeft/maxKin*100), Math.ceil(kineticRight/maxKin*100))
        player.damageLeft  = player.damageBase + kineticLeft/maxKin*2
        player.damageRight = player.damageBase + kineticRight/maxKin*2

        // Update previous wrist positions
        player.rightPrev.x = player.right.x
        player.rightPrev.y = player.right.y

        player.leftPrev.x = player.left.x
        player.leftPrev.y = player.left.y
        }
        // for (let i = 0; i < pose.keypoints.length; i++) {
        //   let x = pose.keypoints[i].position.x;
        //   let y = pose.keypoints[i].position.y;
        //   fill(0,255,0);
        //   ellipse(x,y,16,16);
        // }

        // for (let i = 0; i < skeleton.length; i++) {
        //     let a = skeleton[i][0];
        //     let b = skeleton[i][1];
        //     strokeWeight(2);
        //     // stroke(255);
        //     line(a.position.x, a.position.y,b.position.x,b.position.y);      
        // }
        p.fill(0,255,0)

        // Draw the player
        // Draw head
        p.fill(255, 255, 0);
        // ellipse(player.head.x, player.head.y, player.head.r);
        p.image(icons['grin'], player.head.x-player.head.r/2, player.head.y-player.head.r/2, player.head.r, player.head.r)

        // Draw HP
        p.fill(0,0,0)
        p.textSize(WIDTH/6)
        p.text(Math.floor(player.hp), player.head.x-player.head.r/2, player.head.y-player.head.r/2)

        // Draw wrists
        p.fill(0, 0, 255);
        // p.ellipse(player.left.x, player.left.y, player.left.r);
        p.image(icons['fist'], player.left.x-player.left.r/2, player.left.y-player.left.r/2, player.left.r, player.left.r)

        // p.ellipse(player.right.x, player.right.y, player.right.r);
        p.image(icons['fist'], player.right.x-player.right.r/2, player.right.y-player.right.r/2, player.right.r, player.right.r)

        p.fill(255, 0, 0);

        // Move enemies
        for (let enemy of enemies)
        {
            enemy.move(player)
            p.image(enemy.icon, enemy.circle.x-enemy.circle.r/2, enemy.circle.y-enemy.circle.r/2, enemy.circle.r, enemy.circle.r)
        }

        // Build the quadtree
        let boundary = new Rectangle(WIDTH/2, HEIGHT/2, WIDTH, HEIGHT);
        let qtree = new QuadTree(boundary, 2);

        for (let enemy of enemies) {
            let point = new Point(enemy.circle.x, enemy.circle.y, enemy);
            qtree.insert(point);
            if (enemy.circle.x > WIDTH)
            {
                enemy.circle.x = 0
            }
            else if (enemy.circle.x < 0)
            {
                enemy.circle.x = WIDTH
            }
            if (enemy.circle.y > HEIGHT)
            {
                enemy.circle.y = 0
            }
            else if (enemy.circle.y < 0)
            {
                enemy.circle.y = HEIGHT
            }
            
        }

        // Query quadtree
        let headRange = new Circle(player.head.x, player.head.y, player.head.r * 0.5);

        let rangePoints = qtree.query(headRange); // Possible points of collision near the query
        for (let point of rangePoints) {
            if (player.head.contains(point))
            {
                p.fill(255,0,0)
                p.textSize(point.entity.circle.r * 2)
                p.text("-" + Math.floor(player.hp), player.head.x-player.head.r/2, player.head.y-player.head.r/2)

                player.hp -= point.entity.circle.r * 4

                // Show pain face
                p.image(icons['pain'], player.head.x-player.head.r/2, player.head.y-player.head.r/2, player.head.r, player.head.r)

                // point.entity.circle.r*=1.02
                enemies.splice(enemies.indexOf(point.entity),1)
            }
        }

        let leftRange = new Circle(player.left.x, player.left.y, player.left.r * 0.5);
        let rightRange = new Circle(player.right.x, player.right.y, player.right.r * 0.5);
        let leftRangePoints = qtree.query(leftRange); // Possible points of collision near the query
        let rightRangePoints = qtree.query(rightRange); // Possible points of collision near the query

        for (let point of leftRangePoints) {
            if (player.left.contains(point))
            {
                p.fill(0,255,0)
                p.textSize(point.entity.circle.r*3)
                p.text("+" + Math.floor(point.entity.circle.r), player.left.x-player.left.r/2 + Math.random()*player.left.r, player.left.y-player.left.r/2 + Math.random()*player.left.r)
                point.entity.circle.r/=player.damageLeft

                // enemies.splice(enemies.indexOf(point.entity),1)
                player.hp += point.entity.circle.r

                if (point.entity.circle.r < 50)
                {
                    enemies.splice(enemies.indexOf(point.entity),1)
                }
            }
        }
        for (let point of rightRangePoints) {
            if (player.right.contains(point))
            {
                p.fill(0,255,0)
                p.textSize(point.entity.circle.r*3)
                p.text("+" + Math.floor(point.entity.circle.r), player.right.x-player.right.r/2 + Math.random()*player.right.r, player.right.y-player.right.r/2 + Math.random()*player.right.r)
                point.entity.circle.r/=player.damageRight

                // enemies.splice(enemies.indexOf(point.entity),1)
                player.hp += point.entity.circle.r

                if (point.entity.circle.r < 10)
                {
                    enemies.splice(enemies.indexOf(point.entity),1)
                }
            }
        }
        // qtree.show();    
        if (Math.random()>0.5 && enemies.length < 1000)
        {
            enemies.push(new Enemy(icons, WIDTH, HEIGHT))
        }

        // Set up interval to receive and send canvas data
        if (setupListeners && p.isMulti)
        {
            setInterval(() => {
                const cleanEnemies = enemies.map(({icon, ...keepAttrs}) => keepAttrs)
                p.socket.current.emit("sendCanvas", {playerHead: player.head, playerLeft: player.left, playerRight: player.right, playerHP: player.hp,
                                                    enemies: cleanEnemies, to: p.to, from:p.from, originalWidth:WIDTH, originalHeight:HEIGHT})


            }, 30);
            setupListeners = false;
        }
    }
}

export {sketch}