import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import WelcomeLoader from "./app";
import createClientSocket from "socket.io-client";

const clientSocket = createClientSocket(window.location.origin);
const { RTCPeerConnection, RTCSessionDescription } = window;

function OpponentWait(props) {
  const mySocket = useRef(null);
  const [otherSocket, setOtherSocket] = useState(null);

  clientSocket.on("connect", () => {
    console.log("Connected to server with id ", clientSocket.id);
    mySocket.current = clientSocket.id;
  });

  clientSocket.on("userJoin", (data) => {
    if (!otherSocket) {
      setOtherSocket(data);
    }
  });

  // async function connectUser(otherSocketId) {
  //   const offer = await peerConnection.createOffer();
  //   await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

  //   socket.emit("call-user", {
  //     offer,
  //     to: socketId,
  //   });
  // }

  console.log("OTHER?? ", otherSocket);
  if (otherSocket) {
    return (
      <WelcomeLoader mySocket={clientSocket.id} foreignSocket={otherSocket} />
    );
  } else {
    return <h1>Waiting for opponent...</h1>;
  }
}

ReactDOM.render(<OpponentWait />, document.getElementById("root"));
