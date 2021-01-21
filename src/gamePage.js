import React from "react";
import { Canvas } from "./webcamCanvas";

class GamePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Ready to play?</h1>
        <Canvas />
      </div>
    );
  }
}

export default GamePage;
