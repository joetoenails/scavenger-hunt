import React, { useEffect, useRef } from "react";
import { render } from "react-dom";
import GamePage from "./gamePage";
import labels from "../dist/imagenetLabels";

function randomNum() {
  return Math.floor(Math.random() * 999);
}

function getLabels() {
  return [
    labels[randomNum()].split(",")[0],
    labels[randomNum()].split(",")[0],
    labels[randomNum()].split(",")[0],
  ];
}

class WebcamCanvas extends React.Component {
  constructor(props) {
    super(props);
    //state
    this.state = {
      videoLoaded: false,
      playerReady: false,
      searchItems: getLabels(),
    };
    //refs
    this.video = React.createRef();
    this.counter = React.createRef();
    this.predictions = React.createRef();

    //bindings
    this.countdown = this.countdown.bind(this);
    this.readyUp = this.readyUp.bind(this);
    this.checkMatch = this.checkMatch.bind(this);
    this.predict = this.predict.bind(this);
    this.setVidSrc = this.setVidSrc.bind(this);
  }

  setVidSrc() {
    this.video.current.srcObject = this.props.videoSource;
  }

  async predict() {
    const predictions = await this.props.model.classify(this.video.current);
    this.predictions.current = predictions;
    console.log(this.predictions.current);
  }

  readyUp() {
    this.setState({ playerReady: true });
    this.countdown();
  }
  countdown() {
    const timer = setInterval(() => {
      this.counter.current.innerHTML =
        Number(this.counter.current.innerHTML) - 1;

      if (this.counter.current.innerHTML === "0") {
        clearInterval(timer);
        this.counter.current.innerHTML = "OUT OF TIME!";
      }
    }, 1000);
  }

  checkMatch(predictions, searchItems) {
    let found = false;
    const top1 = predictions[0];
    const top2 = predictions[1];

    searchItems.forEach((item) => {
      console.log(item);
      if (item === top1.className || item === top2.className) {
        found = true;
      }
    });
    return found;
  }

  render() {
    if (this.video.current) {
      this.setVidSrc();
    }

    return (
      <div>
        <div>
          <video ref={this.video} autoPlay={true}></video>
        </div>
        <button onClick={this.predict}> Predict</button>
        <button
          onClick={() => {
            this.checkMatch(this.predictions.current, this.state.searchItems);
          }}
        >
          Check Match
        </button>
        <div>
          {this.state.playerReady ? (
            <div>
              <p>You have 15 seconds to find one of these items!</p>
              <h1 ref={this.counter}>15</h1>
              {this.state.searchItems.map((item, index) => {
                return (
                  <div key={index}>
                    <ol>{item}</ol>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>
              <h1>The timer begins when you click ready!</h1>
              <button onClick={this.readyUp}> READY! </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export { WebcamCanvas };
