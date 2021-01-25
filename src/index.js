import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import WelcomeLoader from "./app";
import createClientSocket from "socket.io-client";

function OpponentWait(props) {
  const [ready, setReady] = useState(false);
  const localStream = React.useRef(null);
  const remoteStream = React.useRef(null);

  if (ready) {
    return (
      <WelcomeLoader localStream={localStream} remoteStream={remoteStream} />
    );
  } else {
    return (
      <div>
        <button
          onClick={() => {
            setReady(true);
          }}
        >
          Ready
        </button>
        <h1 className="headLine">
          Welcome...waiting for another hunter to join...
        </h1>
      </div>
    );
  }
}

ReactDOM.render(<OpponentWait />, document.getElementById("root"));
