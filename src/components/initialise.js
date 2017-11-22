import React, { Component } from "react";
import PropTypes from "prop-types";

import { initGlRenderer, createScene, createCamera } from "../factories/";

/**
 * This component initialises a gl renderer, scene and camera.
 */
export default class Initialise extends Component {
  renderer = null;
  scene = null;
  camera = null;

  static propTypes = {
    glProps: PropTypes.object,
    sceneProps: PropTypes.object,
    cameraProps: PropTypes.object
  };

  static defaultProps = {
    glProps: {},
    sceneProps: {},
    cameraProps: {}
  };

  static childContextTypes = {
    renderer: PropTypes.object,
    scene: PropTypes.object,
    camera: PropTypes.object
  };

  getChildContext() {
    return {
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera
    };
  }

  initialise() {
    this.renderer = initGlRenderer(this.props);
    this.scene = createScene(this.props);
    this.camera = createCamera(this.props);
  }

  componentWillMount = () => {
    this.initialise();
  };

  componentWillUnmount = () => {
    this.renderer && this.renderer.dispose();
  };

  render() {
    return this.props.children;
  }
}
