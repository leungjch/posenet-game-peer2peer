# Emoji Ninja - a Peer2Peer fitness game leveraging TensorFlow's PoseNet

Use your hands to smash down an onslaught of emojis coming for your head, and aim for the highest possible score in a 60-second time limit. The damage you inflict is proportional to how fast you are moving. Play solo or securely with a friend (made possible through WebRTC peer-to-peer technology). No Kinect required!

## Play it here ##

[Link to game (please be patient as this is hosted on a free Heroku dyno which sleeps)](https://posenet-game-p2p-react.herokuapp.com/)

## Technical details

- Websocket server run through **Node.js**, specifically **Express**. The server listens for connections and disconnections, requests to connect to another peer, and relays game data to other peers.
- Smooth video calling between two peers is achieved through **simple-peer**, an WebRTC Javascript library.
- Frontend / client created using **React** webapp and **Material-UI** for styling.
- Canvas graphics and game handled through **p5.js**.
- Efficient collision handling done through a **quadtree data structure** which improves time complexity from O(n&2) to O(nlogn). 
- Project deployed on Heroku. 