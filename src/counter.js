import React, { useEffect, useRef } from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 15,
      gameWon: false,
      gameLost: false,
    };
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
      const remotePredictions = await this.props.predictRemote();
      const localPredictions = await this.props.predictLocal();

      if (this.props.checkMatch(localPredictions, this.props.searchItems)) {
        this.setState({ gameWon: true, winner: "You are" });
        clearTimeout(searcher);
        clearTimeout(timer);
      }
      if (this.props.checkMatch(remotePredictions, this.props.searchItems)) {
        this.setState({ gameWon: true, winner: "The other person is" });
        clearTimeout(searcher);
        clearTimeout(timer);
      }
    }, 500);
  }

  resetGame() {
    this.setState({ gameWon: false, gameLost: false, counter: 15 });
    this.props.setReadyFalse();
  }

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        {this.state.gameWon && (
          <h2 style={{ color: "white" }}>{this.state.winner} the winner!</h2>
        )}
        {this.state.gameLost && (
          <h4 className="gameText" style={{ textAlign: "center" }}>
            No one found found an item :(
          </h4>
        )}
        {this.state.gameLost || this.state.gameWon ? (
          <button
            onClick={this.resetGame}
            className="hunting"
            style={{ width: "fit-content", alignSelf: "center" }}
          >
            Try again?
          </button>
        ) : (
          <div></div>
        )}

        <h1 className="gameText" style={{ textAlign: "center  " }}>
          {this.state.counter}
        </h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {this.props.searchItems.map((item, index) => {
            return (
              <div key={index}>
                <h2
                  style={{ marginLeft: 50, marginRight: 50, marginTop: 0 }}
                  className="gameText"
                >
                  {item}
                </h2>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Counter;
