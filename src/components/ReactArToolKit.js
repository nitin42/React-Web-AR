import React, { Component } from 'react'
import PropTypes from 'prop-types'
const THREE = require('three')

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

  constructor(props) {
    super(props)
    this.state = {
      renderer: null,
      scene: null,
      camera: null,
      accumulator: [],
      byAmt: 1000,
      info: {},
    }
  }

  static propTypes = {
    toolKitSource: PropTypes.shape({
      sourceType: PropTypes.string,
      sourceUrl: PropTypes.string,
      sourceWidth: PropTypes.number,
      sourceHeight: PropTypes.number,
      displayHeight: PropTypes.number,
      displayWidth: PropTypes.number,
    }),
    toolKitContext: PropTypes.shape({
      trackingBackend: PropTypes.string,
      debug: PropTypes.bool,
      detectionMode: PropTypes.string,
      matrixCodeType: PropTypes.string,
      cameraParametersUrl: PropTypes.string,
      maxDetectionRate: PropTypes.number,
      canvasHeight: PropTypes.number,
      canvasWidth: PropTypes.number,
      imageSmoothingEnabled: PropTypes.bool,
    }),
    toolKitMarkerControl: PropTypes.shape({
      size: PropTypes.number,
      type: PropTypes.string,
      patternUrl: PropTypes.string,
      barcodeValue: PropTypes.number,
      changeMatrixMode: PropTypes.string,
      minConfidence: PropTypes.string
    }),
  }

  static defaultProps = {
    toolKitSource: {
      sourceType: 'webcam', // source type ['webcam', 'image', 'video']
      sourceUrl: null, // source url for image or a video, valid if sourceType = image | video
      // resolution at which the source image will be initialised
      sourceWidth: 640,
      sourceHeight: 480,
      displayWidth: 640,
      displayHeight: 640,
    },
    toolKitContext: {
      trackingBackend: 'artoolkit', // ['artoolkit', 'aruco', 'tango']
      debug: false, // Enable debug for canvas in developing
      detectionMode: 'color_and_matrix', // Detection mode ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
      matrixCodeType: '3x3', // Matrix size, valid if detectionMode end with 'matrix' - [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
      cameraParametersUrl: 'parameters/camera_para.dat', // For source type camera
      maxDetectionRate: 60, // Tunning for maximum rate of pose detection in the source image
      canvasWidth: 640, // Canvas width
      canvasHeight: 480, // Canvas height
      imageSmoothingEnabled: true, // Smoothen an image when scaling the canvas (default)
    },
    toolKitMarkerControl: {
      size: 1, // Size of the marker (m)
      type: 'pattern', // Type of marker ['pattern', 'barcode', 'unknown' ]
      patternUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro', // Url for pattern (type should be pattern)
      barcodeValue: null, // Value for the barcode (if type is barcode)
      changeMatrixMode: 'cameraTransformMatrix', // change the matrix mode
      minConfidence: '1', // minimal confidence in the marke recognition - between [0, 1]
    },
    glRendererProps: {
      antialias: true,
      alpha: true,
    },
  }

  initialiseGlRenderer = () => {
    const renderer = new THREE.WebGLRenderer({ ...this.props.glRendererProps })

    return renderer
  }

  // These should be replaced with components (<Scene> and <Camera />)

  initialiseScene = () => {
    const scene = new THREE.Scene()

    return scene
  }

  initialiseCamera = () => {
    // Or use ARToolKitContext.createDefaultCamera('artoolkit')
    // Or use createDefaultCamera('aruco'), creates PerspectiveCamera
    const camera = new THREE.Camera()

    return camera
  }

  applyRendererProps = renderer => {
    renderer.setClearColor(new THREE.Color('brown'), 0)
    renderer.setSize(400, 400)
  }

  applyRendererStyles = (renderer, styles) => {
    Object.assign(renderer.domElement.style, styles)
  }

  // Temporary
  appendTheCanvas = domElement => {
    document.body.appendChild(domElement)
  }

  storeTheInstances = (renderer, scene, camera) => {
    this.setState({
      renderer,
      scene,
      camera,
    })
  }

  startWork = () => {
    // Create a gl renderer canvas
    this.renderer = this.initialiseGlRenderer()

    // Apply the gl renderer props
    this.applyRendererProps(this.renderer)

    // Apply styles to gl renderer canvas
    this.applyRendererStyles(this.renderer, this.props.style)

    // Append the canvas to the DOM
    // (ARToolKit does this implicitly and currently it is out of the React context because it is not rendered inside the 'root')
    // (Suggestion to improve after beta - customise the build for three.js and add support for a root element to render to instead of relying on its implicit nature)
    this.appendTheCanvas(this.renderer.domElement)

    // Initialise a scene (will switch to component based API)
    this.scene = this.initialiseScene()

    // Initiliase a camera (will switch to component based API). Take help from ARToolKitContext.createDefaultCamera()
    this.camera = this.initialiseCamera()

    // Add the camera to the scene
    this.scene.add(this.camera)

    // Updates the state (required for arController because local variables can still point to null)
    this.storeTheInstances(this.renderer, this.scene, this.camera)
  }

  arController = () => {
    const { renderer, camera, scene } = this.state

    // Initialise the ARToolKitContext
    this.toolKitContext = this.toolKitContextController()

    // Initialise the ARToolKitSource
    this.toolKitSource = this.toolKitSourceController()

    // Start processing the source type and subscribe to the events
    this.startSourceWork(this.toolKitSource, renderer, this.toolKitContext)

    // Initialise the context and perform 3D transformation by converting the 3D projection matrix to 2D to render the 3D objects
    this.startContextWork(this.toolKitContext, camera)

    // Update the context with source type and process the gl renderer (canvas)
    this.applyUpdates(this.toolKitSource, this.toolKitContext, scene, camera)

    // Initialise the ARToolKitMarkerController
    this.toolKitMarkerControlController(renderer, this.toolKitContext, camera)

    // Render everything (we render null right now because we don't create the canvas with React's API)
    this.flush(scene, camera, renderer)
  }

  toolKitSourceController = () => {
    const { sourceType, sourceUrl, sourceWidth, sourceHeight, displayHeight, displayWidth } = this.props.toolKitSource

    const toolKitSource = new window.THREEx.ArToolkitSource({
      sourceType,
      sourceUrl,
      sourceWidth,
      sourceHeight,
      displayWidth,
      displayHeight,
    })

    return toolKitSource
  }

  startSourceWork = (arSource, renderer, arContext) => {
    // Initialise the ARToolKitSource
    arSource.init(function onReady() {
      onResize()
    })

    // Listen to the browser resize event and copy the changed attributes of the canvas
    window.addEventListener('resize', () => {
      onResize()
    })

    // Copy the new size of the ARToolKitSource to the canvas when the window size changes
    // Also copy the size to the marker (using ARController API) because marker position also resizes
    function onResize() {
      arSource.onResizeElement()
      // Source type is currently appended outside of the React context
      arSource.copyElementSizeTo(renderer.domElement)
      if (arContext.arController !== null) {
        arSource.copyElementSizeTo(arContext.arController.canvas)
      }
    }
  }

  toolKitContextController = () => {
    const {
      detectionMode,
      debug,
      matrixCodeType,
      maxDetectionRate,
      canvasHeight,
      canvasWidth,
      imageSmoothingEnabled,
    } = this.props.toolKitContext

    const toolKitContext = new window.THREEx.ArToolkitContext({
      cameraParametersUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
      detectionMode,
      debug,
      matrixCodeType,
      maxDetectionRate,
      canvasWidth,
      canvasHeight,
      imageSmoothingEnabled,
    })

    return toolKitContext
  }

  startContextWork = (arContext, camera) => {
    // Render the 3D object on the 2D screen by 3D transformation using GL_Transformation matrix (too much math)
    arContext.init(function onCompleted() {
      camera.projectionMatrix.copy(arContext.getProjectionMatrix())
    })
  }

  applyUpdates = (arSource, arContext, scene, camera) => {
    const { accumulator } = this.state

    accumulator.push(() => {
      if (arSource.ready === false) return

      // Returns true when the frame (from the canvas) has done processing using ARController API
      arContext.update(arSource.domElement)

      // Set the visibility
      scene.visible = camera.visible
    })
  }

  toolKitMarkerControlController = (renderer, arContext, root) => {
    const { type, patternUrl, changeMatrixMode, barcodeValue } = this.props.toolKitMarkerControl

    // Root will be configured in a different way.
    const toolKitMarkerControl = new window.THREEx.ArMarkerControls(arContext, root, {
      type,
      patternUrl,
      changeMatrixMode,
      barcodeValue,
    })

    // marker.addEventListener('markerFound', onMarkerFound);

    return toolKitMarkerControl
  }

  delimiter = byAmt => {
    this.byAmt = byAmt
  }

  flush = (scene, camera, renderer) => {
    const { accumulator } = this.state
    const { children } = this.props

    // As we perform 3D Transformation so we start with an invisible scene (too much math)
    scene.visible = false

    accumulator.push(() => {
      // render the scene
      renderer.render(scene, camera)
    })

    // Render the 3D objects
    children(scene, accumulator, camera, this.delimiter)

    let lastTimeMsec = null

    let amt = this.byAmt

    // Currently dispatching the animation via delimiter render prop
    requestAnimationFrame(function animate(nowMsec) {
      requestAnimationFrame(animate)
      lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec = nowMsec
      accumulator.forEach(onRenderFct => {
        onRenderFct(deltaMsec / amt, nowMsec / amt)
      })
    })
  }

  componentWillMount = () => {
    // Initialise the ARToolKit (also ARController). State is not updated yet
    this.startWork()
  }

  componentDidMount = () => {
    // Main engine
    // State is updated and scene has been rendered to the screen
    this.arController()
  }

  render() {
    return null
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
