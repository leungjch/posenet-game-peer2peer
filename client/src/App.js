import React, { useEffect, useState, useRef, Component } from 'react';
import io from "socket.io-client";
import ReactDOM from 'react-dom';

import Peer from "simple-peer";

import logo from './logo.svg';
import './App.css';
import Box from '@material-ui/core/Box';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

var p5 = require('p5');

var mySketch = require('./scripts/sketch.js')

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
  const [rooms, setRooms] = useState({});


  const [stream, setStream] = useState();
  const [playingSolo, setPlayingSolo] = useState(false);

  const [inviteAccepted, setInviteAccepted] = useState(false); // Your invite has been accepted

  const [userIncoming, setUserIncoming] = useState(false); // Someone is requesting to join your room
  const [userIncomingAccepted, setUserIncomingAccepted] = useState(false); // You accepted the incoming person


  const socket = useRef();
  const userVideo = useRef();
  const partnerVideo = useRef();
  
  // Open a new game
  var playSolo = () => {
    if (!playingSolo)
    {
      let myp5 = new p5(mySketch);
      console.log("play game");
      setPlayingSolo(true)

    }
    else
    {
      console.log("already playing game")
    }
  }

  // 
  var connectRoom = (id) =>{
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("connectRoom", {roomToJoin: id, signalData: data, from: yourID})
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    })

    socket.current.on("inviteAccepted", signal => {
      setInviteAccepted(true);
      peer.signal(signal);
    })
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
    }, []);

  
  let UserVideo;
  if (stream) {
    UserVideo = (
      <video playsInline muted ref={userVideo} autoPlay />
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
          <Grid item xs={12}>
            {UserVideo}
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
          <Button onClick = {playSolo} variant="contained" color="primary" size="large" fullWidth={true}>Play Solo</Button>
          </Grid>
          <Grid item xs = {6}>
          <Button variant="contained" color="primary" fullWidth={true}>Join a Friend</Button>

          </Grid>
          <Grid item xs = {6}>
          <Button variant="contained" color="primary" fullWidth={true}>Invite a Friend</Button>
          </Grid>
        </Grid>

      </Box>


    </div>
    </MuiThemeProvider>
  );
}

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
