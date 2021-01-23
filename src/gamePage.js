import React from "react";
import { WebcamCanvas } from "./webcamCanvas";
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

class GamePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { playerReady: false, searchItems: getLabels() };
    this.counter = React.createRef();
    this.countdown = this.countdown.bind(this);
    this.readyUp = this.readyUp.bind(this);
    this.checkMatch = this.checkMatch.bind(this);
  }

  readyUp() {
    this.setState({ playerReady: true });
    this.countdown();
  }
  countdown() {
    const timer = setInterval(() => {
      this.counter.current.innerHTML =
        Number(this.counter.current.innerHTML) - 1;

      // setInterval(
      //   this.checkMatch(this.props.predictions, this.state.searchItems),
      //   requestAnimationFrame()
      // );

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
      if (item === top1.className || top2.className) {
        found = true;
      }
    });
    return found;
  }

  render() {
    return (
      <div>
        <button onClick={this.props.predict}>Here?</button>

        {this.state.playerReady ? (
          <div>
            <p>You have 15 seconds to find one of these items!</p>
            <h1 ref={this.counter}>15</h1>
            {this.state.searchItems.map((item) => {
              return (
                <div>
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
    );
  }
}

export default GamePage;
