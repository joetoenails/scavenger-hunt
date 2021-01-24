import React, { useEffect, useRef } from "react";
import { render } from "react-dom";
import Counter from "./counter";
import { labels, getLabels } from "../public/imagenetLabels";

const constraints = { audio: false, video: { width: 400, height: 400 } };

//
class WebcamCanvas extends React.Component {
  constructor(props) {
    super(props);
    //state
    this.state = {
      counter: 15,
      videoLoaded: false,
      playerReady: false,
      searchItems: [...getLabels(), "coffee mug"],
    };
    //refs
    this.localVideo = React.createRef();
    this.remoteVideo = React.createRef();

    //bindings
    this.readyUp = this.readyUp.bind(this);
    this.checkMatch = this.checkMatch.bind(this);
    this.predict = this.predict.bind(this);
  }

  async predict() {
    const predictions = await this.props.model.classify(
      this.LocalVideo.current
    );
    return predictions;
  }

  readyUp() {
    this.setState({ playerReady: true });
  }

  checkMatch(predictions, searchItems) {
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

  render() {
    if (this.localVideo.current && this.remoteVideo.current) {
      this.localVideo.current.srcObject = this.props.localStream;
      this.remoteVideo.current.srcObject = this.props.remoteStream;
    }

    return (
      <div
        id="row-container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div id="left-col" style={{ display: "flex", flexDirection: "column" }}>
          {!this.localVideo.current && <h4>Grabbing webcam feed...</h4>}
          <video
            style={{ borderRadius: 5 }}
            ref={this.localVideo}
            autoPlay={true}
          ></video>

          <div>
            {this.state.playerReady ? (
              <div>
                <p>You have 15 seconds to find one of these items!</p>
                <Counter
                  searchItems={this.state.searchItems}
                  checkMatch={this.checkMatch}
                  predict={this.predict}
                />
              </div>
            ) : (
              <div>
                <h4>The timer begins when you click ready!</h4>
                <button onClick={this.readyUp}> READY! </button>
              </div>
            )}
          </div>
        </div>
        <div
          id="right-col"
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <video
            style={{ borderRadius: 5, borderColor: "white", borderWidth: 5 }}
            ref={this.remoteVideo}
            autoPlay={true}
          ></video>
        </div>
      </div>
    );
  }
}

export { WebcamCanvas };
