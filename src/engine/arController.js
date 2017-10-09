import { toolKitSourceController, startSourceWork } from '../AR/toolKitSource'
import { toolKitContextController, startContextWork, applyUpdates } from '../AR/toolKitContext'
import toolKitMarkerControlController from '../AR/toolKitMarkerControl'
import flush from '../AR/Render'

// Hook for delimiting the animation
const delimiter = (byAmt, amt) => amt = byAmt

// Main engine
const arController = (state, props, byAmt, localVars) => {
  let { toolKitContext, toolKitSource } = localVars
  const { renderer, camera, scene } = state

  // Initialise the ARToolKitContext
  toolKitContext = toolKitContextController(props.toolKitContext)

  // Initialise the ARToolKitSource
  toolKitSource = toolKitSourceController(props.toolKitSource)

  // Start processing the source type and subscribe to the events
  startSourceWork(toolKitSource, renderer, toolKitContext)

  // Initialise the context and perform 3D transformation by converting the 3D projection matrix to 2D to render the 3D objects
  startContextWork(toolKitContext, camera)

  // Update the context with source type and process the gl renderer (canvas)
  applyUpdates(toolKitSource, toolKitContext, scene, camera, state.accumulator)

  // Initialise the ARToolKitMarkerController
  toolKitMarkerControlController(props.toolKitMarkerControl, renderer, toolKitContext, camera)

  // Render everything (we render null right now because we don't create the canvas with React's API)
  flush(scene, camera, renderer, state, props, delimiter, byAmt)
}

export default arController