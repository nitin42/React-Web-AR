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
	toolKitMarkerControl = null
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
		// Initialise the ARToolKit (also ARController). State is not updated yet
    // Do not update the state here. Instead return references from start and update the class local refs
    let { rendererRef, sceneRef, cameraRef } = start(this.renderer, this.scene, this.camera, this.props)

    this.renderer = rendererRef;
    this.scene = sceneRef;
    this.camera = cameraRef;
  }

	componentDidMount = () => {
		const arToolKitUtils = {
			context: this.toolKitContext,
      source: this.toolKitSource,
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
      accumulator: this.state.accumulator
    }
  
		// Main engine
		// State is updated and scene has been rendered to the screen
		this.outputToFlush = arController(arToolKitUtils, this.props, this.byAmt)
	}

	render() {
		return this.outputToFlush
	}
}

/**
 * Possibilities/Ideas/+
 * 
 * 
 * Create a internal lifecycle of the ARToolKit component
 * Refactor the render prop pattern
 * Work on performance
 * Check the API pattern against different examples
 * Redesign the main engines
 * Refer to the three.js core engine for more functionality and methods
 * Sunil Pai's idea for <Surface render={plane => <Box />} /> component
 * Render without using React-DOM?
 * Integrate it well with aframe.io and three.js bindings for React.
 * Don't reengineer the three.js component bindings
 * Use web workers for perf (three.js)
 * Add extra events
 * 
 * 
 * 
 */

/**
  * ARToolKitSource - The source which will analyse the position tracking of the marker. Can be a webcam, video or an image.
  *
  * Initialise the source type (webcam, image or a video). Takes two callback, one is fired when the the source type is
  * successfully appended to the DOM and ready flag is set to true else other callback is fired (error) when there is some error
  * when appending the source type to DOM. (Ready flag can be used in debugging)
  * 
  * Listens to the browser's resize event and copies the relevant (changed) size to the canvas element (created with gl renderer) +
  * it also copies the size to the main engine for analysing the marker position (marker position also changes when the window size changes)
  *
  *	(Optional and will be implemented in later release) 
  *	The onResize also takes 3 arguments, context, renderer and camera. Based on the tracking backend, it resizes the window!
  */

/**
 * ARToolKitContext - Main engine. It finds the marker position in the image source
 * 
 * Can be used to create a default camera based on the tracking backend input ('artoolkit'/'aruco')
 * Initialises the context with a callback 
 * Transforms the artoolkit matrix to match webgl one
 * Configures the ARController and fires the callback (onCompleted())
 * 
 * It has getProjectionMatrix() method which is called to transform the 3D matrix to the camera because
 * the monitor (camera) is a 2D surface and to render the 3D surface on a camera, it has to transform the matrix.
 * (GL_PROJECTION matrix is used for this transformation)
 * 
 * Internally (low-level) - 
 * 
 * setup(width, height) - initalize a buffer size for a canvas of width & height
 * process(canvas) - extracts a frame from a canvas and process it
 * debugSetup() - enables debugging, adds a threshold image to the dom (can be enabled using the prop, debug)
 * getDetectedMarkers() - returns an array of detected markers from last detection process
 * getCameraMatrix() - returns the projection matrix computed from camera parameters
 * getTransformationMatrix() - returns the 16-element WebGL transformation matrix (after transforming the 3D matrix to render the object with GL_Transformation matrix)
 */

/**
  * ARToolKitMarkerControl - Controls the position of the marker
  *
  * It adds the marker with addMarker (low-level) to the artoolkitsystem.
  * Removes the marker (componentUnmount) with dispose() method from the artoolkitsystem.
  * Loads the marker with the pattern url
  * Event system -
  *		Top-level event 'getMarker' is fired and a callback function onMarkerFound is called with a sub-event for marker detection and updating the matrix 
  *		The event 'markerFound' is called when the marker is detected. This is useful in some use case where you need to do something when the marker is not visible
  */

/**
   * 
   * ToolKitSource -
   * 
   * getParameters()
   * 
   * setParameters(params)
   * 
   * Initialize(callback)
   *   sourceType = 'image'
   * 	   create an image element and append style attributes.
   * 		 Waits until the video stream is available and then return the domElement
   * 	 
   * 	 sourceType = 'video'
   * 		 creates a video element and add default props
   * 		 Waits until the video stream is available and then return the domElement
   *   
   * 	 sourceType = 'webcam'
   * 		 Sames as video but the props are different
   * 	 
   * 	 attach the domElement to th document and set the ready flag to be true
   *   ready === true ? callback() : null
   * 
   * Local methods -
   * 
   * 		copyElementSizeTo(otherElement)
   * 			Copies the source domElement styles to the otherElement argument (useful when the window size changes or something else)
   *     
   *		onResize(context, renderer, camera)
   * 			Computes the new height, width and margin for the source domElement (when arg.length === 0)
   */
