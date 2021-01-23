import React, { useEffect, useRef } from "react";
import { render } from "react-dom";
import GamePage from "./gamePage";
import labels from "../dist/imagenetLabels";

function randomNum() {
  return Math.floor(Math.random() * 999);
}

function getLabels() {
  let arr = [];
  while (arr.length < 3) {
    let num = Math.floor(Math.random() * 999);
    if (arr.indexOf(num) === -1) {
      arr.push(num);
    }
  }
  return [
    labels[arr[0]].split(",")[0],
    labels[arr[1]].split(",")[0],
    labels[arr[2]].split(",")[0],
  ];
}

class WebcamCanvas extends React.Component {
  constructor(props) {
    super(props);
    //state
    this.state = {
      videoLoaded: false,
      playerReady: false,
      searchItems: [...getLabels(), "coffee mug"],
      gameIsWon: false,
    };
    //refs
    this.video = React.createRef();
    this.counter = React.createRef();

    //bindings
    this.countdown = this.countdown.bind(this);
    this.readyUp = this.readyUp.bind(this);
    this.checkMatch = this.checkMatch.bind(this);
    this.predict = this.predict.bind(this);
  }

  async predict() {
    const predictions = await this.props.model.classify(this.video.current);
    return predictions;
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
      if (this.state.gameIsWon) {
        clearInterval(timer);
        this.counter.current.innerHTML = "FOUND IT!";
      }
    }, 1000);

    const searcher = setInterval(async () => {
      const currentPredictions = await this.predict();
      const found = this.checkMatch(currentPredictions, this.state.searchItems);
      if (this.state.gameIsWon) {
        clearInterval(searcher);
      }
    }, 500);
  }

  checkMatch(predictions, searchItems) {
    const top1 = predictions[0];
    const top2 = predictions[1];

    searchItems.forEach((item) => {
      if (item === top1.className || item === top2.className) {
        this.setState({ gameIsWon: true });
        return true;
      }
    });
  }

  render() {
    if (this.video.current) {
      this.video.current.srcObject = this.props.videoSource;
    }

    return (
      <div>
        {!this.video.current && <h4>Grabbing webcam feed...</h4>}
        <div>
          <video ref={this.video} autoPlay={true}></video>
        </div>
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
