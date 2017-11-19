import { initialiseARToolKitSourceController, startARSourceWork } from '../../core/react-ar-source/ARToolKitSource'
import { initialiseARToolKitContextController, startARContextWork, applyUpdates } from '../../core/react-ar-context/ARToolKitContext'
import { initialiseARToolKitMarkerControlController } from '../../core/react-ar-marker/ARToolKitMarkerControls'
import { flush } from '../../core/renderer'

// Hook for delimiting the animation
// const delimiter = (byAmt, amt) => amt = byAmt

// Main engine
export const arController = (state, props, byAmt) => {
  let { toolKitContext, toolKitSource, renderer, camera, scene, accumulator, call } = state

  // Initialise the ARToolKitContext
  toolKitContext = initialiseARToolKitContextController(props.toolKitContext)

  // Initialise the ARToolKitSource
  toolKitSource = initialiseARToolKitSourceController(props.toolKitSource)

  // Start processing the source type and subscribe to the events
  startARSourceWork(toolKitSource, renderer, toolKitContext, call)

  // Initialise the context and perform 3D transformation by converting the 3D projection matrix to 2D to render the 3D objects
  startARContextWork(toolKitContext, camera)

  // Update the context with source type and process the gl renderer (canvas)
  applyUpdates(toolKitSource, toolKitContext, scene, camera, accumulator)

  // Initialise the ARToolKitMarkerController
  initialiseARToolKitMarkerControlController(props.toolKitMarkerControl, renderer, toolKitContext, camera)

  // Render everything (we render null right now because we don't create the canvas with React's API)
  return flush(scene, camera, renderer, state, props, byAmt)
}
