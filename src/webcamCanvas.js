import React, { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import Counter from "./counter";
import { labels, getLabels } from "../imagenetLabels";
import { io } from "socket.io-client";

function checkMatch(predictions, searchItems) {
  let found = false;
  const top1 = predictions[0];
  const top2 = predictions[1];

  searchItems.forEach((item) => {
    if (item === top1.className || item === top2.className) {
      found = true;
    }
  });
  return found;
}

function WebcamCanvas(props) {
  let clientSocket;
  const localVideo = React.useRef();
  const remoteVideo = React.useRef();
  const readyButton = React.useRef();
  const searchItems = React.useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [alert, setAlert] = useState(false);

  const predictLocal = async () => {
    const predictions = await props.model.classify(localVideo.current);

    return predictions;
  };

  const predictRemote = async () => {
    const predictions = await props.model.classify(remoteVideo.current);

    return predictions;
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300, height: 300 }, audio: false })
      .then((stream) => {
        // Show My Video

        localVideo.current.srcObject = stream;

        // Start a Peer Connection to Transmit Stream
        initConnection(stream);
      })
      .catch((error) => console.log(error));
  }, []);

  const initConnection = (stream) => {
    clientSocket = io();
    console.log("CLIENT SOCKET: ", clientSocket);
    let localConnection;
    let remoteConnection;
    let localChannel;
    let remoteChannel;

    // Start a RTCPeerConnection to each client
    clientSocket.on("other-users", (otherUsers) => {
      // Ignore when not exists other users connected
      if (!otherUsers || !otherUsers.length) return;

      const socketId = otherUsers[0];

      // Ininit peer connection
      localConnection = new RTCPeerConnection();

      // Add all tracks from stream to peer connection
      stream
        .getTracks()
        .forEach((track) => localConnection.addTrack(track, stream));

      // Send Candidtates to establish a channel communication to send stream and data
      localConnection.onicecandidate = ({ candidate }) => {
        candidate && clientSocket.emit("candidate", socketId, candidate);
      };

      // Receive stream from remote client and add to remote video area
      localConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.current.srcObject = stream;
        remoteVideo.current.muted = true;
        remoteVideo.current.playsInline = true;
      };

      // Create Offer, Set Local Description and Send Offer to other users connected
      localConnection
        .createOffer()
        .then((offer) => localConnection.setLocalDescription(offer))
        .then(() => {
          clientSocket.emit(
            "offer",
            socketId,
            localConnection.localDescription
          );
        });
    });

    // Receive Offer From Other Client
    clientSocket.on("offer", (socketId, description) => {
      // Ininit peer connection
      remoteConnection = new RTCPeerConnection();

      // Add all tracks from stream to peer connection
      stream
        .getTracks()
        .forEach((track) => remoteConnection.addTrack(track, stream));

      // Send Candidtates to establish a channel communication to send stream and data
      remoteConnection.onicecandidate = ({ candidate }) => {
        candidate && clientSocket.emit("candidate", socketId, candidate);
      };

      // Receive stream from remote client and add to remote video area
      remoteConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.current.srcObject = stream;
        remoteVideo.current.muted = true;
        remoteVideo.current.playsInline = true;
      };

      // Set Local And Remote description and create answer
      remoteConnection
        .setRemoteDescription(description)
        .then(() => remoteConnection.createAnswer())
        .then((answer) => remoteConnection.setLocalDescription(answer))
        .then(() => {
          clientSocket.emit(
            "answer",
            socketId,
            remoteConnection.localDescription
          );
        });
    });

    // Receive Answer to establish peer connection
    clientSocket.on("answer", (description) => {
      localConnection.setRemoteDescription(description);
    });

    // Receive candidates and add to peer connection
    clientSocket.on("candidate", (candidate) => {
      // GET Local or Remote Connection
      const conn = localConnection || remoteConnection;
      conn.addIceCandidate(new RTCIceCandidate(candidate));
    });

    clientSocket.on("allPlayersReady", (data) => {
      searchItems.current = data;
      readyCountdown();
    });

    clientSocket.on("refreshClients", () => {
      setReadyFalse();
    });
  };

  const readyCountdown = () => {
    setAlert(true);
    setTimeout(() => {
      setPlayerReady(true);
      setAlert(false);
    }, 5000);
  };

  const setReadyFalse = () => {
    setPlayerReady(false);
    setAlert(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
      }}
    >
      <div
        id="row-container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div id="left-col" style={{ display: "flex", flexDirection: "column" }}>
          <video
            style={{ margin: 50, border: "5px solid white", borderRadius: 15 }}
            ref={localVideo}
            autoPlay={true}
          ></video>
        </div>
        <div
          id="right-col"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <video
            style={{ margin: 50, border: "5px solid white", borderRadius: 15 }}
            ref={remoteVideo}
            autoPlay={true}
            muted={true}
            playsInline={true}
          ></video>
        </div>
      </div>
      <div id="counterSearch" style={{ alignSelf: "center" }}>
        {!playerReady && !alert ? (
          <button
            ref={readyButton}
            className="hunting"
            onClick={() => {
              clientSocket.emit("readyUp");
              hideReadyButton();
            }}
          >
            Ready!
          </button>
        ) : null}
        {alert && !playerReady ? (
          <h2 className="gameText">
            Someone has hit the ready button! Game will start in 5 seconds.
          </h2>
        ) : (
          <div></div>
        )}
        {playerReady && (
          <Counter
            searchItems={searchItems.current}
            checkMatch={checkMatch}
            predictLocal={predictLocal}
            predictRemote={predictRemote}
            setReadyFalse={setReadyFalse}
          />
        )}
      </div>
    </div>
  );
}

export { WebcamCanvas };
