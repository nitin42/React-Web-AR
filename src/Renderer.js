import React from 'react'
// import PropTypes from 'prop-types'
const THREE = require('three')

export default class Renderer extends React.Component {
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
		}
	}

	static defaultProps = {
		toolKitSource: {
			sourceType: 'webcam', // source type
			sourceUrl: null, // source url for image or a video
			sourceWidth: 640,
			sourceHeight: 480,
			displayWidth: 640,
			displayHeight: 640,
		},
		toolKitContext: {
			debug: false, // Enable debug for canvas in developing
			detectionMode: 'color_and_matrix', // Detection mode
			matrixCodeType: '3x3', // Matrix size
			cameraParametersUrl: 'parameters/camera_para.dat', // For source type camera
			maxDetectionRate: 60, // Tunning for maximum rate of pose detection in the source image
			canvasWidth: 640, // Canvas width
			canvasHeight: 480, // Canvas height
			imageSmoothinEnabled: true, // Smoothen an image when scaling the canvas
		},
		toolKitMarkerControl: {
			size: 1, // Size of the marker (m)
			type: 'pattern', // Type of marker
			patternUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro', // Url for pattern
			barcodeValue: null, // Value for the barcode
			changeMatrixMode: 'cameraTransformMatrix', // change the matrix mode
		},
		glRendererProps: {},
	}

	initialiseGlRenderer = () => {
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			...this.props.glRendererProps,
		})

		return renderer
	}

	initialiseScene = () => {
		const scene = new THREE.Scene()

		return scene
	}

	initialiseCamera = () => {
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
		this.renderer = this.initialiseGlRenderer()

		this.applyRendererProps(this.renderer)

		this.applyRendererStyles(this.renderer, this.props.style)

		this.appendTheCanvas(this.renderer.domElement)

		this.scene = this.initialiseScene()

		this.camera = this.initialiseCamera()

		this.scene.add(this.camera)

		// Updates the state (required for arController because local variables can still point to null)
		this.storeTheInstances(this.renderer, this.scene, this.camera)
	}

	arController = () => {
		const { renderer, camera, scene } = this.state

		this.toolKitContext = this.toolKitContextController()

		this.toolKitSource = this.toolKitSourceController()

		this.startSourceWork(this.toolKitSource, renderer, this.toolKitContext)

		this.startContextWork(this.toolKitContext, camera)

		this.applyUpdates(this.toolKitSource, this.toolKitContext, scene, camera)

		this.toolKitMarkerControlController(renderer, this.toolKitContext, camera)

		this.flush(scene, camera, renderer)
	}

	toolKitSourceController = () => {
		const { 
			sourceType,
			sourceUrl,
			sourceWidth,
			sourceHeight,
			displayHeight,
			displayWidth
		} = this.props.toolKitSource

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
		arSource.init(function onReady() {
			onResize()
		})

		window.addEventListener('resize', () => {
			onResize()
		})

		function onResize() {
			arSource.onResize()
			// Source type is currently appended outside of the React context
			arSource.copySizeTo(renderer.domElement)
			if (arContext.arController !== null) {
				arSource.copySizeTo(arContext.arController.canvas)
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
			imageSmoothinEnabled,
		} = this.props.toolKitContext

		const toolKitContext = new window.THREEx.ArToolkitContext({
			cameraParametersUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
			detectionMode,
			debug,
			matrixCodeType,
			maxDetectionRate,
			canvasWidth,
			canvasHeight,
			imageSmoothinEnabled,
		})

		return toolKitContext
	}

	startContextWork = (arContext, camera) => {
		arContext.init(function onCompleted() {
			camera.projectionMatrix.copy(arContext.getProjectionMatrix())
		})
	}

	applyUpdates = (arSource, arContext, scene, camera) => {
		const { accumulator } = this.state

		accumulator.push(() => {
			if (arSource.ready === false) return

			arContext.update(arSource.domElement)

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

		return toolKitMarkerControl
	}

	delimiter = byAmt => {
		this.byAmt = byAmt
	}

	flush = (scene, camera, renderer) => {
		const { accumulator } = this.state
		const { children } = this.props

		scene.visible = false

		accumulator.push(() => {
			renderer.render(scene, camera)
		})

		children(scene, accumulator, camera, this.delimiter)

		let lastTimeMsec = null

		let amt = this.byAmt

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
		this.startWork()
	}

	componentDidMount = () => {
		// Main engine
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
 * Intergrate the ARToolKit props with the component
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
 * 
 * 
 * 
 * 
 * 
 */
