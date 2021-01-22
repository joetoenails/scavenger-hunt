import React from "react";
import { WebcamCanvas } from "./webcamCanvas";

class GamePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Ready to play?</h1>
        <WebcamCanvas />
        <div>
          <p>Find these items:</p>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </div>
      </div>
    );
  }
}

export default GamePage;
