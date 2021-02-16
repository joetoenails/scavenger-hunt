import React from "react";
import * as tfjs from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { WebcamCanvas } from "./webcamCanvas";
import Radium, { StyleRoot } from "radium";
import { rubberBand, fadeIn } from "react-animations";

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
      launchGame: false,
    };
  }

  async componentDidMount() {
    const model = await mobilenet.load();
    this.setState({ isModelLoaded: true, model: model });
  }

  render() {
    if (this.state.launchGame) {
      return (
        <StyleRoot>
          <div style={styles.fadeIn}>
            <WebcamCanvas model={this.state.model} />
          </div>
        </StyleRoot>
      );
    }

    return (
      <StyleRoot>
        <div style={styles.fadeIn}>
          <div id="intro-graph">
            <h1 style={{ color: "#454235", textShadow: "3px 3px #F6F1D1" }}>
              Welcome Hunters!
            </h1>
            <p>
              You and a friend are about to embark a wild hunt, in your own
              home!
            </p>
            <p>
              You'll both be given 15 seconds to find one of 4 random objects.
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
                }}
              >
                Let's go!
              </button>
            )}
          </div>
        </div>
      </StyleRoot>
    );
  }
}

export default WelcomeLoader;
