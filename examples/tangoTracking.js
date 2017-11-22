import React, { Component } from "react";
import { render } from "react-dom";

import { AFrameRenderer, Marker } from "../src";

/**
 * This is an example for tango tracking module. Tango tracking means markerless tracking
 * This will only work for tango devices.
 * Remember, this won't work if you set inherent prop to false because it uses model view matrix.
 * Although tango tracking means marker less but here the <Marker> component is used to attach augmented reality (virtual object)
 * You can see that Marker component is not provided a preset or a pattern url. Instead you can directly add virtual objects in real world position
 * You can say that, Marker component act as a proxy here.
 */
class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer arToolKit={{ trackingMethod: "tango" }} inherent={true}>
        <Marker parameters={{ "hit-testing-enabled": true }}>
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
