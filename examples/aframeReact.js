import React, { Component } from "react";
import { render } from "react-dom";
import { Entity } from "aframe-react";

import { AFrameRenderer, Marker } from "../src";

class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{
          trackingMethod: "best",
          sourceType: "image",
          sourceUrl: "./images/hiro_marker.png"
        }}
        inherent={true}
      >
        <Marker parameters={{ "hit-testing-enabled": true, preset: "hiro" }}>
          <Entity
            geometry={{ primitive: "box" }}
            material={{ color: "red" }}
            position={{ x: 0, y: 0.03, z: 0 }}
          />
        </Marker>
      </AFrameRenderer>
    );
  }
}

render(<ReactArApp />, document.getElementById("root"));
