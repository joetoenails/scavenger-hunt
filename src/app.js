import React from "react";
import * as tfjs from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { WebcamCanvas } from "./webcamCanvas";
import Radium, { StyleRoot } from "radium";
import { bounce } from "react-animations";

const constraints = { audio: false, video: { width: 400, height: 400 } };

const styles = {
  bounce: {
    animation: "x 1s",
    animationName: Radium.keyframes(bounce, "bounce"),
  },
};

class WelcomeLoader extends React.Component {
  constructor() {
    super();
    this.state = { isModelLoaded: false, model: null, videoSource: null };
    this.image = React.createRef();
    this.getMedia = this.getMedia.bind(this);
    this.videoRef = React.createRef();
  }

  async componentDidMount() {
    const model = await mobilenet.load();
    this.getMedia(constraints);
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
    if (this.state.isModelLoaded) {
      return (
        <div>
          <WebcamCanvas
            model={this.state.model}
            videoSource={this.state.videoSource}
          />
        </div>
      );
    }

    return (
      <StyleRoot>
        <div style={styles.bounce}>
          <h1>Game is loading...don't forget to grant us webcam access!</h1>
        </div>
      </StyleRoot>
    );
  }
}

export default WelcomeLoader;
