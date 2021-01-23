import React, { useEffect, useRef } from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 15, gameWon: false, gameLost: false };
    this.countdown = this.countdown.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  componentDidMount() {
    this.countdown();
  }

  countdown() {
    let searcher;
    let timer = setInterval(() => {
      this.setState({ counter: this.state.counter - 1 });
      if (this.state.counter === 0) {
        clearTimeout(timer);
        clearTimeout(searcher);
        this.setState({ gameLost: true });
      }
    }, 1000);

    searcher = setInterval(async () => {
      console.log("searching...");
      const currentPredictions = await this.props.predict();
      if (this.props.checkMatch(currentPredictions, this.props.searchItems)) {
        this.setState({ gameWon: true });
        clearTimeout(searcher);
        clearTimeout(timer);
      }
    }, 500);
  }

  resetGame() {
    this.setState({ gameWon: false, gameLost: false, counter: 15 });
    this.countdown();
  }

  render() {
    return (
      <div>
        {this.state.gameWon && <p>Winner!</p>}
        {this.state.gameLost && <p>Loser!</p>}
        {this.state.gameLost ||
          (this.state.gameWon && (
            <button onClick={this.resetGame}>Try again?</button>
          ))}

        <h1>{this.state.counter}</h1>
        {this.props.searchItems.map((item, index) => {
          return (
            <div key={index}>
              <ol>{item}</ol>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Counter;
