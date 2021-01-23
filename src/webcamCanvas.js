import React, { useEffect, useRef } from "react";
import { render } from "react-dom";
import GamePage from "./gamePage";
import labels from "../dist/imagenetLabels";

const constraints = { audio: false, video: { width: 400, height: 400 } };

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
      <div
        id="row-container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <div id="left-col" style={{ display: "flex", flexDirection: "column" }}>
          {!this.video.current && (
            <h4 style={{ width: 400, height: 400 }}>Grabbing webcam feed...</h4>
          )}
          <video
            style={{ borderRadius: 5 }}
            ref={this.video}
            autoPlay={true}
          ></video>

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
          <img
            src="https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            width={400}
            height={400}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    );
  }
}

export { WebcamCanvas };
