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

    this.arMarkerControl = initialiseMarker(
      this.arContext,
      camera,
      this.props.marker
    );
  };

  update = () => {
    const { camera, scene } = this.context;

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

    // This just tracks the scene visible status (does not return anything)
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
