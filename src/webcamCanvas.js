import React, { useEffect, useRef } from "react";
import { render } from "react-dom";

class WebcamCanvas extends React.Component {
  constructor() {
    super();
    this.state = { videoSource: null };
    this.getMedia = this.getMedia.bind(this);
    this.stopVid = this.stopVid.bind(this);
    this.constraints = { audio: false, video: { width: 500, height: 500 } };
    this.videoRef = React.createRef();
  }

  //VIDEO NODE = THIS.VIDEOREF.CURRENT
  componentDidMount() {
    this.getMedia(this.constraints);
  }
  async getMedia(constraints) {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.setState({ videoSource: stream });
      this.videoRef.current.srcObject = stream;
    } catch (err) {
      console.log(err);
    }
  }

  stopVid() {}

  render() {
    console.log(this.state.videoSource);
    return (
      <div>
        {this.state.videoSource && (
          <div>
            <p>trying.</p>
            <video ref={this.videoRef} autoPlay={true}></video>
            <button onClick={this.stopVid}>Stop Vid</button>
          </div>
        )}
      </div>
    );
  }
}

export { WebcamCanvas };
