import React, { useEffect, useState, useRef, Component } from 'react';
import io from "socket.io-client";
import ReactDOM from 'react-dom';

import Peer from "simple-peer";

import logo from './logo.svg';
import './App.css';
import Box from '@material-ui/core/Box';
import CheckIcon from '@material-ui/icons/Check';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grow from '@material-ui/core/Grow';

import Paper from '@material-ui/core/Paper';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import {sketch} from "./scripts/sketch.js"

import {peerSketch} from "./scripts/peerSketch.js"

import Grid from '@material-ui/core/Grid';

var myp5;
var otherp5;

var p5 = require('p5');
var shortid = require('shortid')
// var mySketch = require('./scripts/sketch.js')

const themeLight = createMuiTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  }
});

const themeDark = createMuiTheme({
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#000000"
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  webcamView: {
    border: 5,
    borderRadius: 10,
    backgroundColor:"white"
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

export default function App() {
  const [yourID, setYourID] = useState("");
  const [yourVideoExists, setYourVideoExists] = useState(false)
  const [partnerExists, setPartnerExists] = useState(false)

  const [yourScore, setYourScore] = useState('waiting');
  const [peerScore, setPeerScore] = useState('waiting');

  const [userInactive, setUserInactive] = useState(false)

  const [inviteCode, setInviteCode] = useState('') // Client creates an invite code
  const [requestNewRoom, setRequestNewRoom] = useState(false);
  const [inputInviteCode, setInputInviteCode] = useState('') // Client writing down an invite code from someone else

  const [stream, setStream] = useState();
  const [playingSolo, setPlayingSolo] = useState(false);
  const [playingMulti, setPlayingMulti] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [incoming, setOther] = useState(false) // boolean indicating whether someone is attempting to join your room
  const [incomingAccepted, setOtherAccepted] = useState(false) // boolean indicating whether you accepted the user's request to join

  const [incomingUser, setOtherUser] = useState(""); // ID of the incoming user
  const [incomingUserSignal, setOtherUserSignal] = useState(); // signal of incoming user

  const [youReady, setYouReady] = useState(false); // if you are ready to play
  const [otherReady, setOtherReady] = useState(false); // if other user is ready to play

  const [youDone, setYouDone] = useState(false); // your game done (set when you receive your final score)
  const [otherDone, setOtherDone] = useState(false); // peer done

  const socket = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();

  var generateInvite = () => {
    if (inviteCode === '')
    {
      setInviteCode(shortid.generate());
      setRequestNewRoom(true)
      // Send new room ID to server
    }
  }
  
  // Open a new game
  var playSolo = () => {
    if (!playingSolo)
    {
      myp5 = new p5(sketch);
      myp5.isMulti = false;
      myp5.socket = socket;
      myp5.from = yourID;
      
      var canvas = document.getElementById('defaultCanvas0');
      canvas.style.display="none";
      userVideo.current.srcObject = canvas.captureStream(60);

      console.log("play game");
      
      setPlayingSolo(true);
      setPlaying(true);
    }
    else
    {
      console.log("already playing game")
    }
  }

  // Connect to a room
  var connectRoom = () =>{
    if (!incomingAccepted)
    {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", data => {
        socket.current.emit("connectRoom", {roomToJoin: inputInviteCode, signalData: data, from:yourID})
      })
  
      peer.on("stream", stream => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream;
          setPartnerExists(true);
        }
      })
  
      socket.current.on("acceptIncoming", data => {
        setOtherAccepted(true); // other user has accepted
        setOther(false); // other user is not incoming anymore
        setOtherUser(data.from)
        peer.signal(data.signal);
        console.log("accepted user's request")
      })
    }
  }

  // You accepted the incoming user's request to join
  var acceptIncoming = () => {
    console.log("accepted join")
    setOtherAccepted(true);
    setOther(false); // user accepted request, so close the incoming button

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptIncoming", {signal: data, roomID: inviteCode, to: incomingUser, from: yourID})
      setOtherAccepted(true)
      setOther(false)
    })
    
    // Get stream
    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream
    });
    setPartnerExists(true);

    peer.signal(incomingUserSignal)
  }

  var handleReady = () => {
    setYouReady(!youReady);
  }

  // Load webcam on visit site
  useEffect( () => {
      // Call our fetch function below once the component mounts

      // Open webcam
      if (!yourVideoExists)
      {
        socket.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
          setStream(stream);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
        })
        setYourVideoExists(true);
      }

      // Listen for receiving join request
      socket.current.on("hey", (data) => {
        if (!incomingAccepted)
        {
          setOther(true);
          setOtherUser(data.from);
          setOtherUserSignal(data.signal);
          console.log(`User ${data.from} is joining your room`)
        }
      })
        // Get your user id
        socket.current.on("yourID", (id) => {
          // Make sure ID is set only once
          if (yourID === "")
          {
            setYourID(id);
            console.log('myID is', id)
          }
        })

        socket.current.on("kick", (data) => {
          setUserInactive(true);
          console.log("Someone disconnected");
        })
  

      // Create a new room 
      // Problem, figure out a way to prevent webcam from loading again
      if (requestNewRoom) {
        console.log("invite code is", inviteCode)
        socket.current.emit("createRoom", {roomID: inviteCode})
        setRequestNewRoom(false);
      }
    
      socket.current.emit("sendReady", {isReady: youReady, to: incomingUser, from:yourID})
      
      console.log("sending ready ", youReady, "to ", incomingUser)
      // Set ready feedback
      socket.current.on("receiveReady", data => {
        console.log("received ready on client")
        setOtherReady(data.isReady);
        })

      socket.current.on("receiveYourScore", (data) => {
        console.log("received my score ", data.finalScore)
        setYourScore(data.finalScore);

        // myp5.remove();
        myp5 = null;
        if (document.getElementById("defaultCanvas0"))
        {
          document.getElementById("defaultCanvas0").remove()
        }

        // Get normal webcam stream back
        if (!yourVideoExists) {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) {
              userVideo.current.srcObject = stream;
            }
          })
          setYourVideoExists(true);
          }

        setYouDone(true);
        setYouReady(false);
        setOtherReady(false);
        setPlaying(false);
        setPlayingSolo(false);
        setPlayingMulti(false);
      })
      socket.current.on("receivePeerScore", (data) => {
        setPeerScore(data.finalScore);
        otherp5 = null;
        if (document.getElementById("defaultCanvas1"))
        {
          document.getElementById("defaultCanvas1").remove()
        }

        console.log("received peer score ", data.finalScore)
      });
      }, [inviteCode, youReady, otherReady]);

    let incomingUserNotification;
    if (incoming && !incomingAccepted)
    {
      incomingUserNotification = (

        <Grid item xs = {6}>
        <Button variant = "contained" color="secondary" style={{marginTop:'2%'}} onClick={acceptIncoming}>Accept Join Request</Button> 
        </Grid>
      )
    }
    else
    {

      incomingUserNotification = (
        <Grid item xs = {6}>
        </Grid>
      )
    }

    let readyButtons;
    // if (incomingAccepted && (!youReady || !otherReady))
    if (incomingAccepted)
    {
      readyButtons = (
        <Grow in={!playing} timeout = {1500}>

        <Box width="50%" m="auto" justify="center" justifyContent="center" style={{textAlign:'center'}}>

          <ButtonGroup variant="contained" size="large" fullWidth = {true} color="primary" aria-label="outlined primary button group">
              <Button fullWidth = {true} color={youReady? "primary" : "secondary"} onClick={handleReady}>{youReady ? "Click to Unready" : "Click to Ready"} </Button>
              <Button fullWidth = {true} color={otherReady ? "primary" : "secondary"}>{otherReady ? "Friend Ready" : "Friend Not Ready"} </Button>
          </ButtonGroup>

          <Grow in={youDone}>
            <Card width="50%" style={{borderRadius:"10px", marginTop:"2%"}}>
              <Typography variant = "h2"> {yourScore!=="waiting" && peerScore !=="waiting" && yourScore > peerScore ? "You Won! 🎉" : yourScore!=="waiting" && peerScore !=="waiting" && yourScore < peerScore ? "You Lost! 😢" : "Waiting 🕒"} </Typography>
              <Typography variant = "h4"> Your score: {yourScore === "waiting" ? "Waiting" : Math.ceil(yourScore)} </Typography>
              <Typography variant = "h4"> Friend's score: {peerScore === "waiting" ? "Waiting" : Math.ceil(peerScore)} </Typography>
            </Card>
          </Grow>

        </Box>
        </Grow>

        )
    }

    // Create game if all players are ready
    if (youReady && otherReady && !playingMulti)  {

      // Create only one canvas
      if (!document.getElementById('defaultCanvas0')) {
          myp5 = new p5(sketch);
          myp5.isMulti = true;
          myp5.to = incomingUser
          myp5.from = yourID
          myp5.socket = socket;
          myp5.io = io;
          var canvas0 = document.getElementById('defaultCanvas0');
          canvas0.style.display="none";
          userVideo.current.srcObject = canvas0.captureStream(60);

          otherp5 = new p5(peerSketch, 'partnerVideoContainer');
          otherp5.isMulti = true;
          otherp5.to = incomingUser
          otherp5.from = yourID
          otherp5.socket = socket;
        }
      console.log("making canvas")

      setPlayingMulti(true);
      setPlaying(true);

      // reset ready buttons
      // TODO: hide UI/buttons
    }
  // Send your canvas graphics
  // Retrieve other player's graphics and draw them on the other canvas
  
    // Conditionally render elements
  
  // Render user video
  let UserVideo;
  if (stream) {
    UserVideo = (
      <Box
      display="flex" 
      flexDirection="column"
      m="auto"      
      alignItems="center"
      justifyContent="center"
      > 
      <Card style ={{ padding: 5, paddingBottom: 2, paddingTop:2, display: 'inline-block', marginLeft: '0%', marginBottom:"1px", marginTop: '2%'}} > <Typography variant="h6"> You </Typography> </Card>

      <video playsInline id="user" style = {{marginBottom:"2%", textAlign: 'center', borderStyle:"solid", borderRadius:'10px', borderColor:"white", borderWidth:"2px", display:'inline-block'}} muted ref={userVideo} autoPlay />

      </Box>
      );
  }

  // Render partner video
  let PartnerVideo;
  if (incomingAccepted)
  {
    PartnerVideo = (
    <Grid item xs={12} sm={6}>
      <div id="partnerVideoContainer">
          <Box
          display="flex" 
          flexDirection="column"
          m="auto"      
          alignItems="center"
          justifyContent="center"
          > 
          <Card style ={{ padding: 5, paddingBottom: 2, paddingTop:2, display: 'inline-block', marginLeft: '0%', marginBottom:"1px", marginTop: '2%'}} > <Typography variant="h6"> Friend </Typography> </Card>
          <video playsInline id="partner" style={{marginBottom:"2%", textAlign: 'center', borderStyle:"solid", borderRadius:'10px', borderColor:"white", borderWidth:"2px", display:'inline-block'}} ref={partnerVideo} autoPlay />
          </Box>
      </div>
      </Grid>
    );
  }

  // Conditionally render inactive alert
  let userInactiveElement;
  if (userInactive)
  {
    userInactiveElement = (
      <Alert severity="error">You've been removed for inactivity. Please reload the page to play again.</Alert>
    )
  }

  let inviteCodeElement;
  if (inviteCode !== '')
  {
    inviteCodeElement = (
      <Button variant="contained" fullWidth={true} style={{textTransform: 'none'}} onClick={() => {navigator.clipboard.writeText(inviteCode)}}>Your Invite Code: {inviteCode}</Button> 
    );
  }
  let displayLastScore;
  if (yourScore !== "waiting")
  {
    displayLastScore = (
      <Card style={{marginBottom:"2%"}}>
      <Typography variant="h4">Your last score: {Math.ceil(yourScore) } </Typography> 
    </Card>
    )
  }
  else
  {
    displayLastScore = null;
  }

  const classes = useStyles();
  return (
    <MuiThemeProvider theme = {themeDark}>
      <CssBaseline />
    <div className={classes.root}>
      {userInactiveElement}
      <Grow in={yourVideoExists}>
      <Grid
      container
      spacing={0}
      padding={10}
      justify="center"
      direction="row" alignItems="center"
      style={{ minHeight: '60vh', maxWidth: '100%' }}
      >
          <Grid item xs={12} sm={6}>
            {UserVideo}
          </Grid> 
          {PartnerVideo}

        </Grid>
      </Grow>

      {readyButtons}

      <Grow in={!partnerExists && !playing && yourVideoExists}>

      <Box
      justifyContent="center"
      justify="center"
      width="50%"
      m="auto"
      >
        {displayLastScore}

        <Grid container spacing = {3} 
        style={{backgroundColor: "#999999", borderRadius: 10}}>
          <Grid item xs={12}>
          <Button onClick = {playSolo} variant="contained" color="primary" size="large" fullWidth={true}>Play Solo</Button>
          </Grid>

          <Grid item xs = {6}>
            <TextField id="filled-basic" color="primary" onChange={(event) => setInputInviteCode(event.target.value)} fullWidth = {true} label="Invite Code" variant="filled" />
          </Grid>

          <Grid item xs = {6}>
          <Button onClick = {generateInvite} variant="contained" color="primary" fullWidth={true}>Generate Invite Code</Button>
          </Grid>

          <Grid item xs = {6}>
          <Button variant="contained" onClick = {connectRoom} color="primary" fullWidth={true}>Join With Invite Code</Button>
          {incomingUserNotification}
          </Grid>


          <Grid item xs = {6}>
            {inviteCodeElement}
          </Grid>
        </Grid>
      </Box>
      </Grow>
    </div>
    </MuiThemeProvider>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
