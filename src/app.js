import React from "react";
import GamePage from "./gamePage";

class WelcomeLoader extends React.Component {
  constructor() {
    super();
    this.state = { isModelLoaded: false };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isModelLoaded: true });
    }, 3000);
  }

  render() {
    if (this.state.isModelLoaded) {
      return (
        <div>
          <GamePage />
        </div>
      );
    }

    return (
      <div>
        <h1>Model is loading...</h1>
      </div>
    );
  }
}

export default WelcomeLoader;
