import React, { useEffect, useState, useRef, Component } from 'react';
import io from "socket.io-client";
import ReactDOM from 'react-dom';

import Peer from "simple-peer";

import logo from './logo.svg';
import './App.css';
import Box from '@material-ui/core/Box';
import CheckIcon from '@material-ui/icons/Check';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

var p5 = require('p5');
var shortid = require('shortid')
// var mySketch = require('./scripts/sketch.js')

import {sketch} from "./scripts/sketch.js"

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
      primary: "#ffffff"
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
  const [inviteCode, setInviteCode] = useState('') // Client creates an invite code
  const [inputInviteCode, setInputInviteCode] = useState('') // Client writing down an invite code from someone else

  const [stream, setStream] = useState();
  const [playingSolo, setPlayingSolo] = useState(false);

  const [incoming, setIncoming] = useState(false) // boolean indicating whether someone is attempting to join your room
  const [incomingAccepted, setIncomingAccepted] = useState(false) // boolean indicating whether you accepted the user's request to join

  const [incomingUser, setIncomingUser] = useState(""); // ID of the incoming user
  const [incomingUserSignal, setIncomingUserSignal] = useState(); // signal of incoming user

  const [youReady, setYouReady] = useState(false); // if you are ready to play
  const [otherReady, setOtherReady] = useState(false); // if other user is ready to play



  const socket = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();

  var generateInvite = () => {
    if (inviteCode === '')
    {
      setInviteCode(shortid.generate());
      // Send new room ID to server

    }
  }
  
  // Open a new game
  var playSolo = () => {
    if (!playingSolo)
    {
      let myp5 = new p5(sketch);
      console.log("play game");
      setPlayingSolo(true)
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
        }
      })
  
      socket.current.on("acceptIncoming", signal => {
        setIncomingAccepted(true);
        setIncoming(false);
        peer.signal(signal);
        console.log("accepted user's request")
      })
    }
  }

  // You accepted the incoming user's request to join
  var acceptIncoming = () => {
    console.log("accepted join")
    setIncomingAccepted(true);
    setIncoming(false); // user accepted request, so close the incoming button

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptIncoming", {signal: data, to: incomingUser})
      setIncomingAccepted(true)
      setIncoming(false)
    })
    
    // Get stream
    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream
    });

    peer.signal(incomingUserSignal)

  }

  var handleReady = () => {
    setYouReady(!youReady);
  }


  // Load webcam on visit site
  useEffect( () => {
      // Call our fetch function below once the component mounts

      // Open webcam
      socket.current = io.connect("/");
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })

      // Listen for receiving join request
      socket.current.on("hey", (data) => {
        if (!incomingAccepted)
        {
          setIncoming(true);
          setIncomingUser(data.from);
          setIncomingUserSignal(data.signal);
          console.log(`User ${data.from} is joining your room`)
        }
      })
      // Make sure ID is set only once
      if (yourID === "")
      {
        // Get your user id
        socket.current.on("yourID", (id) => {
          setYourID(id);
          console.log('myID is', id)
        })
      }


      // Create a new room 
      // Problem, figure out a way to prevent webcam from loading again
      if (inviteCode !== "") {
        console.log("invite code is", inviteCode)

        socket.current.emit("createRoom", {roomID: inviteCode})
      }
      
      socket.current.emit("sendReady", {isReady: youReady, to: incomingUser})

    // Set ready feedback
    socket.current.on("receiveReady", data => {
      console.log("received ready on client")
      setOtherReady(data.isReady);
      })

      console.log("emit ready")


    }, [inviteCode, youReady]);

    let incomingUserNotification;
    if (incoming && !incomingAccepted)
    {
      incomingUserNotification = (

        <Grid item xs = {6}>
        <Button onClick={acceptIncoming}>Accept Join Request</Button> 
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
    if (incomingAccepted && (!youReady || !otherReady))
    {
      readyButtons = (
        <ButtonGroup color="primary" aria-label="outlined primary button group">
            <Button onClick={handleReady}>{youReady ? "Click to Unready" : "Click to Ready"} </Button>
            <Button >{otherReady ? "Friend Ready" : "Friend Not Ready"} </Button>
        </ButtonGroup>
        )
    }
  
  let UserVideo;
  if (stream) {
    UserVideo = (
      <video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (incomingAccepted)
  {
    PartnerVideo = (
      <video playsInline muted ref={partnerVideo} autoPlay />
    );
  }

  const classes = useStyles();

  return (
    
    <MuiThemeProvider theme = {themeDark}>
      <CssBaseline />
    <div className={classes.root}>
      <Box
      justifyContent="center"
      justify="center"
      width="50%"
      m="auto"
      >
        <Grid container spacing = {3}>
          <Grid item xs={6}>
            {UserVideo}
          </Grid> 
          <Grid item xs={6}>
          {PartnerVideo}
          </Grid>

        </Grid>
      </Box>

      <Box
      justifyContent="center"
      justify="center"
      width="50%"
      m="auto"
      >

        <Grid container spacing = {3} 
        style={{backgroundColor: "#333333", borderRadius: 10}}>
          <Grid item xs={12}>
          {readyButtons}
          <Button onClick = {playSolo} variant="contained" color="primary" size="large" fullWidth={true}>Play Solo</Button>
          </Grid>

          <Grid item xs = {6}>
            <TextField id="standard-basic" onChange={(event) => setInputInviteCode(event.target.value)} label="Invite Code" />
          </Grid>

          <Grid item xs = {6}>
          <Button variant="contained" onClick = {connectRoom} color="primary" fullWidth={true}>Join a Friend</Button>
          {incomingUserNotification}

          </Grid>
          <Grid item xs = {6}>
          <Button onClick = {generateInvite} variant="contained" color="primary" fullWidth={true}>Generate Invite Code</Button>
          

          </Grid>

          <Grid item xs = {6}>
          {inviteCode}
          </Grid>
        </Grid>
      </Box>


    </div>
    </MuiThemeProvider>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
