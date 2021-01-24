import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import WelcomeLoader from "./app";
import createClientSocket from "socket.io-client";

const clientSocket = createClientSocket(window.location.origin);
const { RTCPeerConnection, RTCSessionDescription } = window;

function OpponentWait(props) {
  const [ready, setReady] = useState(false);
  const [socketInfo, setSocketInfo] = useState(null);

  clientSocket.on("connect", () => {
    console.log("Connected to server with id ", clientSocket.id);
  });

  clientSocket.on("usersReady", (data) => {
    setReady(true);
    setSocketInfo(data);
  });

  clientSocket.on("notReady", (data) => {
    setReady(false);
  });

  if (ready) {
    return <WelcomeLoader sockets={socketInfo} />;
  } else {
    return (
      <h1 className="headLine">
        Welcome hunter! Please wait for your opponent to join...
      </h1>
    );
  }
}

ReactDOM.render(<OpponentWait />, document.getElementById("root"));
