import React from "react";
import * as tfjs from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { WebcamCanvas } from "./webcamCanvas";
import Radium, { StyleRoot } from "radium";
import { rubberBand, fadeIn } from "react-animations";

const constraints = { audio: false, video: { width: 400, height: 400 } };

const styles = {
  fadeIn: {
    animation: "x 1s",
    animationName: Radium.keyframes(fadeIn, "fadeIn"),
  },
  rubberBand: {
    animation: "x 1s",
    animationName: Radium.keyframes(rubberBand, "rubberBand"),
  },
};

class WelcomeLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModelLoaded: false,
      model: null,
      localStream: null,
      remoteStream: null,
      launchGame: false,
    };
    this.callUser = this.callUser.bind(this);
  }

  async componentDidMount() {
    const model = await mobilenet.load();
    this.setState({ isModelLoaded: true, model: model });
  }

  async callUser(clientSocket, socketId) {
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
    });

    const localstream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: 400, height: 400 },
    });

    this.setState({ localStream: localstream });

    localstream
      .getTracks()
      .forEach((track) => connection.addTrack(track, localstream));

    const remoteStream = new MediaStream();

    connection.addEventListener("track", async (event) => {
      remoteStream.addTrack(event.track, remoteStream);
    });

    this.setState({ remoteStream: remoteStream });
  }

  render() {
    console.log("state: ", this.state);
    if (this.state.launchGame) {
      return (
        <StyleRoot>
          <div style={styles.fadeIn}>
            <WebcamCanvas
              socketInfo={this.props.socketInfo}
              model={this.state.model}
              localStream={this.state.localStream}
              remoteStream={this.state.remoteStream}
            />
          </div>
        </StyleRoot>
      );
    }

    return (
      <StyleRoot>
        <div style={styles.fadeIn}>
          <div id="intro-graph">
            <h1>Welcome Hunters!</h1>
            <p>
              You and a friend are about to embark a wild hunt, in your own
              home!
            </p>
            <p>
              You'll both be given 15 seconds to find one of 3 random objects.
            </p>
            <p>
              Be the first to hold that item up to your webcam, and you win.
            </p>
            <p>
              Click the button below to load your webcam and get ready for the
              hunt!
            </p>

            {this.state.isModelLoaded && (
              <button
                className="hunting"
                style={styles.fadeIn}
                onClick={() => {
                  this.setState({ launchGame: true });
                  this.callUser(this.props.socket, this.props.socketInfo[1]);
                }}
              >
                Let's go hunting!
              </button>
            )}
          </div>
        </div>
      </StyleRoot>
    );
  }
}

export default WelcomeLoader;
