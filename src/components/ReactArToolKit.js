import React, { Component } from 'react'

import { ReactArToolKitComponentDefaultProps, ReactArToolKitComponentPropTypes } from '../proptypes'
import initArToolKit from '../engine/three'
import arController from '../engine/arController'

/**
 * ARToolKit is based on two main registrations, geometric and photometric.
 * 
 * Geometric registration - Aligning the position of virtual environment with the actual environment
 * Photometric registration - Matching the appearance of objects in the virtual environment to the actual environment
 * 
 */
export default class ReactArToolKit extends Component {
	toolKitSource = null
	toolKitContext = null
	renderer = null
	scene = null
	camera = null
  byAmt = 1000
  outputToFlush = null

	state = {
		accumulator: [],
		byAmt: 500,
	}

	static propTypes = ReactArToolKitComponentPropTypes()

	static defaultProps = ReactArToolKitComponentDefaultProps()

	componentWillMount = () => {

		// Initialise the ARToolKit (also ARController)
    let { rendererRef, sceneRef, cameraRef } = initArToolKit(this.renderer, this.scene, this.camera, this.props)

    // WebGL renderer intialised
    this.renderer = rendererRef;

    // Scene initialised
    this.scene = sceneRef;

    // Camera initialised
    this.camera = cameraRef;
  }

	componentDidMount = () => {
    
    // AR toolkit utils required to configure the main engine and start the rendering loop (returns the output to be flush)
		const arToolKitUtils = {
			context: this.toolKitContext,
      source: this.toolKitSource,
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      accumulator: this.state.accumulator
    }
  
		// Main engine
    this.outputToFlush = arController(arToolKitUtils, this.props, this.byAmt)
	}

  // For the first render, 'null' is render because we manually control the dom for rendering the canvas (will change this behaviour)
  // use the next render to enter the threex.artoolkit render loop to render the 3D objects
	render() {
    // Enter the render loop
		return this.outputToFlush
	}
}
