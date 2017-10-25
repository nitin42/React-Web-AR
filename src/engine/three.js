import { initialiseGlRenderer, applyRendererProps, applyRendererStyles } from '../AR/webGlRenderer'
import { initialiseCamera, initialiseScene } from '../AR/ThreeContext'

// Not giving control to React (will change this behavior)
const appendTheCanvas = (domElement) => {
  document.body.appendChild(domElement)
}

// Start the initialisation process (glRenderer, Scene, Camera)
const initArToolKit = (rendererRef, sceneRef, cameraRef, props) => {
  // Create a gl renderer canvas
  rendererRef = initialiseGlRenderer(props)

  // Apply the gl renderer props
  applyRendererProps(rendererRef)

  // Apply styles to gl renderer canvas
  applyRendererStyles(rendererRef, props.style)

  // Append the canvas to the DOM
  // (ARToolKit does this implicitly)
  // TODO - Remove this and use custom threex.artoolkit build for the initial render
  appendTheCanvas(rendererRef.domElement)

  // Initialise a scene (will switch to component based API)
  sceneRef = initialiseScene()

  // Initiliase a camera (will switch to component based API).
  // TODO - Take help from ARToolKitContext.createDefaultCamera()
  cameraRef = initialiseCamera()

  // Add the camera to the scene
  sceneRef.add(cameraRef)

  // Return the updated refs
  return {
    rendererRef,
    sceneRef,
    cameraRef,
  }
}

export default initArToolKit