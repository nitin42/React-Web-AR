import React, { Component } from "react";
import { render } from "react-dom";

import { AFrameRenderer, Marker } from "../src";

class MultiMarker extends Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{
          sourceType: "image",
          sourceUrl: "./images/Multimarker.png"
        }}
        getSceneRef={ref => (this.scene = ref)}
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
        <Marker parameters={{ preset: "kanji" }}>
          <a-box color="red" position="0 0.09 0" scale="0.4 0.8 0.8">
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
