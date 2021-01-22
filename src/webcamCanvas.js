import React, { useEffect, useRef } from "react";
import { render } from "react-dom";

class WebcamCanvas extends React.Component {
  constructor() {
    super();
    this.state = { videoSource: null };
    this.getMedia = this.getMedia.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.constraints = { audio: false, video: { width: 1280, height: 720 } };
    this.refVideo = React.createRef(<HTMLVideoElement></HTMLVideoElement>);
  }

  async getMedia(constraints) {
    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.setState({ videoSource: stream });
    } catch (err) {
      console.log(err);
    }
  }
  playVideo() {
    this.refs.stream.play();
  }

  render() {
    console.log(this.state.videoSource);
    return (
      <div>
        <button
          onClick={() => {
            this.getMedia(this.constraints);
          }}
        >
          Start Vid
        </button>
        <button onClick={this.playVideo}>Play Vid</button>
        {this.state.videoSource && (
          <div>
            <p>trying.</p>
            <video
              ref={(video) => {
                video.srcObject = this.state.videoSource;
              }}
              height={300}
              width={300}
              autoPlay={true}
            ></video>
          </div>
        )}
      </div>
    );
  }
}

export { WebcamCanvas };
