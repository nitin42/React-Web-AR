import React, { Component } from 'react'
// import PropTypes from 'prop-types'
const THREE = require('three')

export default class Renderer extends Component {
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
      byAmt: 1000
    }

    this.storeTheInstances = this.storeTheInstances.bind(this);
    this.startWork = this.startWork.bind(this);
    this.initialiseCamera = this.initialiseCamera.bind(this);
    this.initialiseGlRenderer = this.initialiseGlRenderer.bind(this);
    this.initialiseScene = this.initialiseScene.bind(this);
    this.applyRendererProps = this.applyRendererProps.bind(this);
    this.applyRendererStyles = this.applyRendererStyles.bind(this);
    this.appendTheCanvas = this.appendTheCanvas.bind(this);
    this.arController = this.arController.bind(this);
    this.toolKitContextController = this.toolKitContextController.bind(this);
    this.toolKitMarkerControlController = this.toolKitMarkerControlController.bind(this);
    this.toolKitSourceController = this.toolKitSourceController.bind(this);
    this.applyUpdates = this.applyUpdates.bind(this);
    this.flush = this.flush.bind(this);
    this.delimiter = this.delimiter.bind(this);
  }
  
  initialiseGlRenderer() {
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
    })
    
    return renderer
	}

	initialiseScene() {
    const scene = new THREE.Scene()
    
    return scene
	}

	initialiseCamera() {
    const camera = new THREE.Camera()
    
    return camera
	}

	applyRendererProps(renderer) {
		renderer.setClearColor(new THREE.Color('brown'), 0)
		renderer.setSize(400, 400)
	}

	applyRendererStyles(renderer, styles) {
		renderer.domElement.style = this.props.styles
	}

	// Temporary
	appendTheCanvas(domElement) {
		document.body.appendChild(domElement)
	}

	storeTheInstances(renderer, scene, camera) {
		this.setState({
			renderer,
			scene,
			camera,
		})
	}

	startWork() {
		this.renderer = this.initialiseGlRenderer()

		this.applyRendererProps(this.renderer)

		this.applyRendererStyles(this.renderer, { position: 'relative', top: '0', left: '0' })

		this.appendTheCanvas(this.renderer.domElement)

		this.scene = this.initialiseScene()

		this.camera = this.initialiseCamera()

		this.scene.add(this.camera)

		// Updates the state (required for arController because local variables can still point to null)
		this.storeTheInstances(this.renderer, this.scene, this.camera)
	}

	arController() {
		const { renderer, camera, scene } = this.state

		this.toolKitContext = this.toolKitContextController()

    this.toolKitSource = this.toolKitSourceController()
    
    this.startSourceWork(this.toolKitSource, renderer, this.toolKitContext);

    this.startContextWork(this.toolKitContext, camera);

		this.applyUpdates(this.toolKitSource, this.toolKitContext, scene, camera)

		this.toolKitMarkerControlController(renderer, this.toolKitContext, camera)

		this.flush(scene, camera, renderer)
	}

	toolKitSourceController() {
		const toolKitSource = new window.THREEx.ArToolkitSource({
			sourceType: 'webcam',
    })
    
    return toolKitSource
  }
  
  startSourceWork(arSource, renderer, arContext) {
		arSource.init(function onReady() {
			onResize()
		})

		window.addEventListener('resize', function() {
			onResize()
		})

		function onResize() {
			arSource.onResize()
			arSource.copySizeTo(renderer.domElement)
			if (arContext.arController !== null) {
				arSource.copySizeTo(arContext.arController.canvas)
			}
		}
  }

	toolKitContextController() {
		const toolKitContext = new window.THREEx.ArToolkitContext({
			cameraParametersUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
			detectionMode: 'mono',
		})

    return toolKitContext
  }
  
  startContextWork(arContext, camera) {
		arContext.init(function onCompleted() {
			camera.projectionMatrix.copy(arContext.getProjectionMatrix())
		})
  }

	applyUpdates(arSource, arContext, scene, camera) {
		const { accumulator } = this.state

		accumulator.push(function() {
			if (arSource.ready === false) return

			arContext.update(arSource.domElement)

			scene.visible = camera.visible
		})
	}

	toolKitMarkerControlController(renderer, arContext, root) {
		const toolKitMarkerControl = new window.THREEx.ArMarkerControls(arContext, root, {
			type: 'pattern',
			patternUrl: window.THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
			changeMatrixMode: 'cameraTransformMatrix',
    })
    
    return toolKitMarkerControl
  }
  
  delimiter(byAmt) {
    this.byAmt = byAmt;
  }

	flush(scene, camera, renderer) {
		const { accumulator } = this.state
		const { children } = this.props

		scene.visible = false

		accumulator.push(function() {
			renderer.render(scene, camera)
		})

    children(scene, accumulator, camera, this.delimiter)

    let lastTimeMsec = null
    
    let amt = this.byAmt;

		requestAnimationFrame(function animate(nowMsec) {

			requestAnimationFrame(animate)
			lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
			var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
			lastTimeMsec = nowMsec
			accumulator.forEach(function(onRenderFct) {
				onRenderFct(deltaMsec / amt, nowMsec / amt)
			})
		})
	}

	componentWillMount() {
		this.startWork()
	}

	componentDidMount() {
		// Main engine
		this.arController()
  }

	render() {
		return null
	}
}
