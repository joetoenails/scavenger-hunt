import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import WelcomeLoader from "./app";
import createClientSocket from "socket.io-client";

const clientSocket = createClientSocket(window.location.origin);

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

  const callUser = async (socketId) => {
    const connection = await new window.RTCPeerConnection();

    const offer = await connection.createOffer();
    await connection.setLocalDescription(new RTCSessionDescription(offer));

    clientSocket.emit("call-user", {
      offer,
      to: socketId,
    });

    clientSocket.on("call-made", async (data) => {
      console.log("here???");
      await connection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(new RTCSessionDescription(answer));

      clientSocket.emit("make-answer", {
        answer,
        to: data.socket,
      });
    });

    clientSocket.on("answer-made", async (data) => {
      await connection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      console.log("here??");
    });
  };

  if (ready) {
    return (
      <div>
        <button
          onClick={() => {
            callUser(socketInfo[1]);
          }}
        >
          Test
        </button>
        <WelcomeLoader sockets={socketInfo} clientSocket={clientSocket} />
      </div>
    );
  } else {
    return (
      <h1 className="headLine">
        Welcome...waiting for another hunter to join...
      </h1>
    );
  }
}

ReactDOM.render(<OpponentWait />, document.getElementById("root"));
