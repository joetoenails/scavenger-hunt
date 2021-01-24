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
      videoSource: null,
      remoteSource: null,
      launchGame: false,
    };
    this.getMedia = this.getMedia.bind(this);
  }

  async componentDidMount() {
    const model = await mobilenet.load();
    this.setState({ isModelLoaded: true, model: model });
  }

  async getMedia(constraints) {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.setState({ videoSource: stream });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    console.log("PROPS", this.props.sockets);

    if (this.state.launchGame) {
      return (
        <StyleRoot>
          <div style={styles.fadeIn}>
            <WebcamCanvas
              model={this.state.model}
              videoSource={this.state.videoSource}
              remoteSource={this.state.remoteSource}
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
                  this.getMedia(constraints);
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
