# Emoji Ninja - a Peer2Peer fitness game leveraging TensorFlow's PoseNet

Use your hands to smash down an onslaught of emojis coming for your head, and aim for the highest possible score in a 60-second time limit. The damage you inflict is proportional to how fast you are moving. Play solo or securely with a friend (made possible through WebRTC peer-to-peer technology). No Kinect required!

## Play it here ##

[Link to game (please be patient as this is hosted on a free Heroku dyno which sleeps)](https://posenet-game-p2p-react.herokuapp.com/)

### Instructions

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

## Technical details

- Websocket server run through **Node.js**, specifically **Express**. The server listens for connections and disconnections, requests to connect to another peer, and relays game data to other peers.
- Smooth video calling between two peers is achieved through **simple-peer**, an WebRTC Javascript library.
- Frontend / client created using **React** webapp and **Material-UI** for styling.
- Canvas graphics and game handled through **p5.js**.
- Fast and simple PoseNet implementation using **ml5.js**.
- Implemented efficient collision handling through a **quadtree data structure** which improves time complexity from O(n&2) to O(nlogn). 
- Project deployed on Heroku. 