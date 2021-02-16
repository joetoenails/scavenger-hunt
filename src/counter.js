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
      let localResult;
      let remoteResult;

      if (localPredictions) {
        localResult = this.props.checkMatch(
          localPredictions,
          this.props.searchItems
        );
      }
      if (remotePredictions) {
        remoteResult = this.props.checkMatch(
          remotePredictions,
          this.props.searchItems
        );
      }
      if (localResult) {
        this.setState({
          gameWon: true,
          winner: ` You found a ${localResult} and are`,
        });
        clearTimeout(searcher);
        clearTimeout(timer);
      }
      if (remotePredictions) {
        if (remoteResult) {
          this.setState({
            gameWon: true,
            winner: `The other person found a ${remoteResult} and is`,
          });
          clearTimeout(searcher);
          clearTimeout(timer);
        }
      }
    }, 500);
  }

  resetGame() {
    this.setState({ gameWon: false, gameLost: false, counter: 15 });
    this.props.setReadyFalse();
    this.props.clientSocket.emit("RESETGAME");
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
          <h2 style={{ textAlign: "center" }} className="gameText">
            {this.state.winner} the winner!
          </h2>
        )}
        {this.state.gameLost && (
          <h4
            className="gameText"
            style={{ textAlign: "center", fontSize: "1em" }}
          >
            Time's up! No one found found an item.
          </h4>
        )}
        {this.state.gameLost || this.state.gameWon ? (
          <button
            onClick={this.resetGame}
            className="hunting"
            style={{
              width: "fit-content",
              alignSelf: "center",
              marginBottom: "10px",
            }}
          >
            Try again?
          </button>
        ) : (
          <div></div>
        )}
        {this.state.counter !== 0 && !this.state.gameWon && (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#CFD7C7",
              borderRadius: "50%",
              width: "4em",
              height: "4em",
              alignSelf: "center",
              marginBottom: "20px",
            }}
          >
            <h1
              className="gameText"
              style={{
                margin: 0,
                padding: 0,
                textAlign: "center",
                fontSize: "3em",
                alignSelf: "center",
              }}
            >
              {this.state.counter}
            </h1>
          </div>
        )}
        {this.state.counter !== 0 && !this.state.gameWon && (
          <h2 style={{ textAlign: "center" }} className="gameText">
            Find one of these items!
          </h2>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#CFD7C7",
            alignItems: "center",
            borderRadius: "20px",
          }}
        >
          {this.props.searchItems.map((item, index) => {
            return (
              <div key={index}>
                <h2
                  style={{
                    marginLeft: 50,
                    marginRight: 50,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
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
