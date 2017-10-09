import { initialiseGlRenderer, applyRendererProps, applyRendererStyles } from '../AR/webGlRenderer'
import { initialiseCamera, initialiseScene } from '../AR/ThreeContext'

// [CURRENT_STATUS] - appended out of React context
const appendTheCanvas = (domElement) => {
  document.body.appendChild(domElement)
}

// Start the initialisation process (glRenderer, Scene, Camera)
const start = (rendererRef, sceneRef, cameraRef, store, props) => {
  // Create a gl renderer canvas
  rendererRef = initialiseGlRenderer(props)

  // Apply the gl renderer props
  applyRendererProps(rendererRef)

  // Apply styles to gl renderer canvas
  applyRendererStyles(rendererRef, props.style)

  // Append the canvas to the DOM
  // (ARToolKit does this implicitly and currently it is out of the React context because it is not rendered inside the 'root')
  // (Suggestion to improve after beta - customise the build for three.js and add support for a root element to render to instead of relying on its implicit nature)
  appendTheCanvas(rendererRef.domElement)

  // Initialise a scene (will switch to component based API)
  sceneRef = initialiseScene()

  // Initiliase a camera (will switch to component based API). Take help from ARToolKitContext.createDefaultCamera()
  cameraRef = initialiseCamera()

  // Add the camera to the scene
  sceneRef.add(cameraRef)

  // Updates the state (required for arController because local variables can still point to null)
  store(rendererRef, sceneRef, cameraRef)
}

export default start