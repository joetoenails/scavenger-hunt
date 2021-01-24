import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import WelcomeLoader from "./app";
import createClientSocket from "socket.io-client";

const clientSocket = createClientSocket(window.location.origin);

function OpponentWait(props) {
  const [ready, setReady] = useState(false);
  const [socketInfo, setSocketInfo] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

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
    return <WelcomeLoader socketInfo={socketInfo} socket={clientSocket} />;
  } else {
    return (
      <h1 className="headLine">
        Welcome...waiting for another hunter to join...
      </h1>
    );
  }
}

ReactDOM.render(<OpponentWait />, document.getElementById("root"));
