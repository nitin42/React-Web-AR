import {
  initialiseGlRenderer,
  applyRendererProps,
  applyRendererStyles
} from "../../core/webgl-renderer";
import { initialiseCamera, initialiseScene } from "../../core/three-js-context";

// Append the canvas
const appendTheCanvas = domElement => {
  document.getElementById("root").appendChild(domElement);
};

// Initialises a webgl renderer, a scene and a camera
// Returns the three.js instances
export const initArToolKit = (rendererRef, sceneRef, cameraRef, props) => {
  // Create a gl renderer canvas
  rendererRef = initialiseGlRenderer(props);

  // Apply the gl renderer props
  applyRendererProps(rendererRef);

  // Apply styles to gl renderer canvas
  applyRendererStyles(rendererRef, props.style);

  // Append the canvas to the DOM
  // (ARToolKit does this implicitly)
  // TODO - Remove this and use custom threex.artoolkit build for the initial render
  appendTheCanvas(rendererRef.domElement);

  // Initialise a scene (will switch to component based API)
  sceneRef = initialiseScene();

  // Initiliase a camera (will switch to component based API).
  // TODO - Take help from ARToolKitContext.createDefaultCamera()
  cameraRef = initialiseCamera();

  // Add the camera to the scene
  sceneRef.add(cameraRef);

  // Return the updated refs
  return {
    rendererRef,
    sceneRef,
    cameraRef
  };
};