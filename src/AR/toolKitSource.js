/**
 * ARToolKitSource
 */

// window is not validated here because we will be using the package window_or_global (works for SSR too)
import { ReactArToolKitSource } from '../constructors/ar'

// Create ARSource instance with parameters
let initialiseArToolKitSourceController = parameters => {
  const { sourceType, sourceUrl, sourceWidth, sourceHeight, displayHeight, displayWidth } = parameters

  const toolKitSource = new ReactArToolKitSource({
    sourceType,
    sourceUrl,
    sourceWidth,
    sourceHeight,
    displayWidth,
    displayHeight,
  })

  return toolKitSource
}

let startArSourceWork = (arSource, renderer, arContext) => {
  // Initialise the ARSource work
  arSource.init(function onReady() {
    onResize();
  })

  // Copy the new size of the ARToolKitSource to the canvas when the window size changes
  // Also copy the size to the marker (using ARController API) because marker position also resizes
  function onResize() {
    arSource.onResizeElement()
    // Source type is currently appended outside of the React context
    arSource.copyElementSizeTo(renderer.domElement)
    // If the frame has done processing the marker, then resize its dimensions too
    if (arContext.arController !== null) {
      arSource.copyElementSizeTo(arContext.arController.canvas)
    }
  }

  // Resize the canvas on browser resize
  window.addEventListener('resize', () => {
    onResize()
  })
}

export {
  initialiseArToolKitSourceController,
  startArSourceWork,
}
