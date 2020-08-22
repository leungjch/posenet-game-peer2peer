# Emoji Ninja - a Peer2Peer fitness game leveraging TensorFlow's PoseNet

Use your hands to smash down an onslaught of emojis coming for your head, and aim for the highest possible score in a 60-second time limit. The damage you inflict is proportional to how fast you are moving. Play solo or securely with a friend (made possible through WebRTC peer-to-peer technology). No Kinect required!

## Play it here ##

[Link to game (please be patient as this is hosted on a free Heroku dyno which sleeps)](https://posenet-game-p2p-react.herokuapp.com/)

## Gameplay Instructions

- Set up a webcam that shows a clear space. **Make sure your surroundings are clear of potential sources of injuries (e.g. walls, tripping hazards)!**
- Use your wrists to fight off approaching enemies. If they touch your head, you receive damage and your score is lowered.
- Hold off for as long as you can and reach for a high score!
- **To play solo**:
  - Click on the "play solo" button. You will have five seconds to prepare before the game starts.
- **To play with a friend**:
  - Generate an invite code
  - Copy the invite code and send it to your friend.
  - Wait for your friend to enter the invite code.
  - Press "accept join request".
  - You and your friend should now be connected. Click the "ready" button and wait for your friend to be ready too. After you are both ready, you will have five seconds to prepare before the game starts.

## Build Instructions
The app consists of two components: the **server** and the **client**. To run this project locally, you will need to run both of them simultaneously.
1. Server: On a command line interface, navigate to the root of the directory and build the server with `npm run build`. To start the server, run `npm run start`. When you play the game, you will notice that the console output of this CLI updates the status of the rooms and users joining as it handles the peer2peer connections.


2. Client: Navigate to the `/client` directory on your command line interface. Build the project using `npm run build`, then start the project using `npm run start`. You can now access it at `localhost:3000`. This is the address of the actual app to play the game. Make sure that you have started the server first. 

## Implementation Details

- Websocket server run through **Node.js**, specifically **Express**. The server listens for connections and disconnections, requests to connect to another peer, and relays game data to other peers.
- Smooth video calling between two peers is achieved through **simple-peer**, a WebRTC Javascript library.
- Frontend / client created using **React** app and **Material-UI** for styling.
- Canvas graphics and game handled through **p5.js**.
- Fast and simple PoseNet implementation using **ml5.js**.
- Implemented efficient collision handling through a **quadtree data structure** which improves time complexity from O(n^2) to O(nlogn). 
- Project deployed on **Heroku**. 