/**
 * ARToolKitSource
 */

// window is not validated here because we will be using the package window_or_global (works for SSR too)
import { ReactArToolKitSource } from '../../constructors/ReactARGlobals'
import { setARSourceParameters } from './ARSourceParameters'

// Create ARSource instance with parameters
export const initialiseARToolKitSourceController = parameters =>
	new ReactArToolKitSource(setARSourceParameters(parameters))

export const startARSourceWork = (arSource, renderer, arContext, call) => {
	// Initialise the ARSource work
	// Add a lifecycle hook 'arSourceDidInitialise()' here
	arSource.init(function onReady() {
		onResize()
		call()
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
