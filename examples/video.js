import React, { Component } from "react";
import { render } from "react-dom";

import { AFrameRenderer, ReactArToolKit } from "../src";

const THREE = require("three");

class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{ sourceType: "video", sourceUrl: "./headtracking.mp4" }}
        marker={{ preset: "hiro" }}
        inherent={false}
      >
        <a-box
          color="red"
          position="0 0.3 0"
          rotation="0 45 45"
          scale="0.18 0.18 0.18"
        >
          <a-animation
            attribute="position"
            to="0 0.8 0"
            direction="alternate"
            dur="800"
            repeat="indefinite"
          />
        </a-box>
      </AFrameRenderer>
    );
  }
}

render(<ReactArApp />, document.getElementById("root"));
