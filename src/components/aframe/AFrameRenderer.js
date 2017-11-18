import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const PARAMETERS = [
  "debugUIEnabled",
  "detectionMode",
  "matrixCodeType",
  "cameraParametersUrl",
  "maxDetectionRate",
  "sourceType",
  "sourceUrl",
  "sourceWidth",
  "sourceHeight",
  "displayHeight",
  "displayWidth",
  "canvasWidth",
  "canvasHeight"
];

/**
 * AFrameRenderer
 * 
 * Render aframe.io primitives using a single marker
 * 
 * Use multiple markers (independent) and render different objects
 * 
 * Use camera as an entity or use cameraTransformMatrix (camera movement)
 *  
 * Bugs/Errors to patch:
 * 
 * AR.js gives this error 'THREEx.ArMarkerControls: 'markersAreaEnabled' is not a property of this material.'
 * 
 */
export default class AFrameRenderer extends Component {
  container = document.body;
  renderer = null;

  static propTypes = {
    arToolKit: PropTypes.shape({
      sourceType: PropTypes.string,
      sourceUrl: PropTypes.string,
      debugUIEnabled: PropTypes.bool,
      detectionMode: PropTypes.string,
      matrixCodeType: PropTypes.string,
      cameraParametersUrl: PropTypes.string,
      maxDetectionRate: PropTypes.number,
      sourceWidth: PropTypes.number,
      sourceHeight: PropTypes.number,
      displayWidth: PropTypes.number,
      displayHeight: PropTypes.number,
      canvasWidth: PropTypes.number,
      canvasHeight: PropTypes.number
    }),
    getSceneRef: PropTypes.func,
    inherent: PropTypes.bool
  };

  static defaultProps = {
    arToolKit: {},
    getSceneRef: () => {}, // No ref
    inherent: true // use modelViewMatrix
  };

  static childContextTypes = {
    inherent: PropTypes.bool
  };

  // This prop is used by the <Marker /> component to decide whether to use modelViewMatrix or cameraTransformMatrix
  getChildContext() {
    return {
      inherent: this.props.inherent
    };
  }

  // Clear the rendering context
  // Fallback if <a-scene /> primitive fails to dispose the renderer
  componentWillUnmount = () => {
    this.renderer && this.renderer.dispose();
  };

  // Pass <a-scene /> reference as a prop. Useful for usage with aframe.io APIs
  passSceneRef = (getSceneRef, ref) => getSceneRef(ref) || ref;

  // We need to render the <a-scene> outside the parent container
  // because arjs adds the image (sourceType) outside the parent container
  // and the tracking module cannot track the position of the marker lying outside its context

  // Alternate will be to change this behavior in arjs's aframe fork but
  // its not convenient at all because it may break their internals (AR.js, aframe fork and threex.artoolkit)
  renderVirtualComponent = component =>
    ReactDOM.createPortal(component, this.container);

  // Use a basic marker component and a camera entity (modelViewMatrix)
  // Determines what user sees. There are no mappings for props on this component i.e userheight: 0
  // The camera is static and its present in negative z-axis
  // static at (0, 0, 0)
  inherentMode = value => (value ? <a-camera-static /> : null);

  // arjs toolkit parameters (these mappings are already validated in arjs)
  prepareToolKitParams = parameters => {
    let toolKitParams = "";

    Object.keys(parameters).forEach(param => {
      if (PARAMETERS.includes(param)) {
        toolKitParams += `${param}: ${parameters[param]};`;
      }
    });

    return toolKitParams;
  };

  // Flush the output
  flush = props => {
    const { arToolKit, children, getSceneRef, inherent, ...rest } = props;

    return this.renderVirtualComponent(
      <a-scene
        // Forward the scene reference as it is useful in VR enter and exit events
        // where this ref node can be use to add or remove content
        ref={sceneRef =>
          this.passSceneRef(getSceneRef, sceneRef) &&
          (this.renderer = sceneRef)}
        // Remove full screen props from the canvas
        embedded
        // Custom component registered by arjs
        arjs={this.prepareToolKitParams(arToolKit)}
        // Inject the rest of the component props
        {...rest}
      >
        {children}
        {this.inherentMode(inherent)}
      </a-scene>
    );
  };

  render() {
    // Renderless! (we currently use portals to render in body and not in parent container)
    return this.flush(this.props);
  }
}
