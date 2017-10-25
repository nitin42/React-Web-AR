import { initialiseArToolKitSourceController, startArSourceWork } from '../AR/toolKitSource'
import { initialiseArToolKitContextController, startArContextWork, applyUpdates } from '../AR/toolKitContext'
import initialiseArToolKitMarkerControlController from '../AR/toolKitMarkerControl'
import flush from '../AR/Render'

// Hook for delimiting the animation
// const delimiter = (byAmt, amt) => amt = byAmt

// Main engine
const arController = (state, props, byAmt) => {
  let { toolKitContext, toolKitSource, renderer, camera, scene, accumulator } = state

  // Initialise the ARToolKitContext
  toolKitContext = initialiseArToolKitContextController(props.toolKitContext)

  // Initialise the ARToolKitSource
  toolKitSource = initialiseArToolKitSourceController(props.toolKitSource)

  // Start processing the source type and subscribe to the events
  startArSourceWork(toolKitSource, renderer, toolKitContext)

  // Initialise the context and perform 3D transformation by converting the 3D projection matrix to 2D to render the 3D objects
  startArContextWork(toolKitContext, camera)

  // Update the context with source type and process the gl renderer (canvas)
  applyUpdates(toolKitSource, toolKitContext, scene, camera, accumulator)

  // Initialise the ARToolKitMarkerController
  initialiseArToolKitMarkerControlController(props.toolKitMarkerControl, renderer, toolKitContext, camera)

  // Render everything (we render null right now because we don't create the canvas with React's API)
  return flush(scene, camera, renderer, state, props, byAmt)
}

export default arController