import React, { useEffect, useRef } from "react";
import { render } from "react-dom";
import Counter from "./counter";
import { labels, getLabels } from "../public/imagenetLabels";

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
  const localVideo = React.useRef();
  const remoteVideo = React.useRef();
  const searchItems = React.useRef([...getLabels(), "coffee mug"]);
  const [playerReady, setReady] = React.useState(false);

  const predictLocal = async () => {
    const predictions = await props.model.classify(localVideo.current);

    return predictions;
  };

  const predictRemote = async () => {
    const predictions = await props.model.classify(remoteVideo.current);

    return predictions;
  };

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((stream) => {
      // Show My Video

      localVideo.current.srcObject = stream;

      // Start a Peer Connection to Transmit Stream
      initConnection(stream);
    })
    .catch((error) => console.log(error));

  const initConnection = (stream) => {
    const socket = io("/");
    let localConnection;
    let remoteConnection;
    let localChannel;
    let remoteChannel;

    // Start a RTCPeerConnection to each client
    socket.on("other-users", (otherUsers) => {
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
        candidate && socket.emit("candidate", socketId, candidate);
      };

      // Receive stream from remote client and add to remote video area
      localConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.current.srcObject = stream;
      };

      // Create Offer, Set Local Description and Send Offer to other users connected
      localConnection
        .createOffer()
        .then((offer) => localConnection.setLocalDescription(offer))
        .then(() => {
          socket.emit("offer", socketId, localConnection.localDescription);
        });
    });

    // Receive Offer From Other Client
    socket.on("offer", (socketId, description) => {
      // Ininit peer connection
      remoteConnection = new RTCPeerConnection();

      // Add all tracks from stream to peer connection
      stream
        .getTracks()
        .forEach((track) => remoteConnection.addTrack(track, stream));

      // Send Candidtates to establish a channel communication to send stream and data
      remoteConnection.onicecandidate = ({ candidate }) => {
        candidate && socket.emit("candidate", socketId, candidate);
      };

      // Receive stream from remote client and add to remote video area
      remoteConnection.ontrack = ({ streams: [stream] }) => {
        remoteVideo.current.srcObject = stream;
      };

      // Set Local And Remote description and create answer
      remoteConnection
        .setRemoteDescription(description)
        .then(() => remoteConnection.createAnswer())
        .then((answer) => remoteConnection.setLocalDescription(answer))
        .then(() => {
          socket.emit("answer", socketId, remoteConnection.localDescription);
        });
    });

    // Receive Answer to establish peer connection
    socket.on("answer", (description) => {
      localConnection.setRemoteDescription(description);
    });

    // Receive candidates and add to peer connection
    socket.on("candidate", (candidate) => {
      // GET Local or Remote Connection
      const conn = localConnection || remoteConnection;
      conn.addIceCandidate(new RTCIceCandidate(candidate));
    });
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
            style={{ width: 400, height: 400, margin: 0 }}
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
            style={{ width: 400, height: 400, margin: 0 }}
            ref={remoteVideo}
            autoPlay={true}
          ></video>
        </div>
      </div>
      <div id="counterSearch" style={{ alignSelf: "center" }}>
        <Counter
          searchItems={searchItems.current}
          checkMatch={checkMatch}
          predictLocal={predictLocal}
          predictRemote={predictRemote}
        />
      </div>
    </div>
  );
}

export { WebcamCanvas };
