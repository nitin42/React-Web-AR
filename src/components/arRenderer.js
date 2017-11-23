import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  initialiseARSource,
  initialiseARContext,
  initialiseMarker
} from "../factories";
import updateOnEveryFrame from "../render/update";
import renderLoop from "../render/renderLoop";

export default class ARRenderer extends Component {
  arSource = null;
  arContext = null;
  arMarkerControl = null;
  output = null;

  state = {
    accumulator: []
  };

  static contextTypes = {
    renderer: PropTypes.object,
    scene: PropTypes.object,
    camera: PropTypes.object
  };

  // Change this to .shape
  static propTypes = {
    context: PropTypes.object,
    marker: PropTypes.object,
    source: PropTypes.object
  };

  // Change default props value
  static defaultProps = {
    context: {},
    marker: {},
    source: {}
  };

  componentWillMount = () => {
    window.THREEx.ArToolkitContext.baseURL =
      "https://rawgit.com/jeromeetienne/ar.js/master/three.js/";
  };

  componentDidMount = () => {
    this.initialise();

    this.update();

    this.arMarkerControl = initialiseMarker(
      this.arContext,
      this.context.camera,
      this.props.marker
    );

    this.renderAccumulatorState();
  };

  initialise = () => {
    const { camera, scene, renderer } = this.context;

    this.arContext = initialiseARContext(camera, this.props.context);

    this.arSource = initialiseARSource(
      this.arContext,
      this.props.source,
      renderer
    );
  };

  update = () => {
    const { camera, scene } = this.context;

    // Process the renderer
    updateOnEveryFrame(
      this.state.accumulator,
      this.arSource,
      this.arContext,
      scene,
      camera
    );
  };

  renderAccumulatorState = () => {
    const { camera, scene, renderer } = this.context;

    // This is just to get a reference
    this.output = renderLoop(
      this.state.accumulator,
      scene,
      camera,
      renderer,
      this.props.children
    );
  };

  render() {
    return this.output;
  }
}
