import React, { Component } from 'react'

import { ReactArToolKitComponentDefaultProps, ReactArToolKitComponentPropTypes } from '../proptypes'
import start from '../engine/three'
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
		byAmt: 1000,
	}

	static propTypes = ReactArToolKitComponentPropTypes()

	static defaultProps = ReactArToolKitComponentDefaultProps()

	componentWillMount = () => {

		// Initialise the ARToolKit (also ARController)
    let { rendererRef, sceneRef, cameraRef } = start(this.renderer, this.scene, this.camera, this.props)

    // Updated refs (initialised)
    this.renderer = rendererRef;
    this.scene = sceneRef;
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

  // 'null' is render when the component mounts for the first time because we manually operate the dom and append the canvas
  // use the next render to enter the threex.artoolkit render loop to render the 3D objects
	render() {
    // Enter the render loop
		return this.outputToFlush
	}
}
