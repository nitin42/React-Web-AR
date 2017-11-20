import React, { Component } from "react";
import { render } from "react-dom";

import { AFrameRenderer, Marker } from "../src";

/**
 * In this example, we use an image as a source type for analysing the marker.
 */
class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{
          sourceType: "image",
          sourceUrl: "./images/hiro_marker.png"
        }}
        inherent={true}
      >
        <Marker parameters={{ preset: "hiro" }}>
          <a-box color="blue" position="0 0.09 0" scale="0.4 0.8 0.8">
            <a-animation
              attribute="rotation"
              to="360 0 0"
              dur="2000"
              easing="linear"
              repeat="indefinite"
            />
          </a-box>
        </Marker>
      </AFrameRenderer>
    );
  }
}

render(<ReactArApp />, document.getElementById("root"));
