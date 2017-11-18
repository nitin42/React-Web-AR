import { ReactArToolKitContext } from '../../constructors/ReactARGlobals'
import { setARToolKitContextParameters } from './ARContextParameters'

// Initialise the ARToolKitContext with the input parameters
export const initialiseARToolKitContextController = parameters =>
	new ReactArToolKitContext(setARToolKitContextParameters(parameters))

// YET TO CHANGE (in accordance with the lifecycle hooks for React-AR)
export const startARContextWork = (arContext, camera) => {
	// Render the 3D object on the 2D screen by 3D transformation using GL_Transformation matrix (too much math)
	arContext.init(function onCompleted() {
		camera.projectionMatrix.copy(arContext.getProjectionMatrix())
	})
}

export const applyUpdates = (arSource, arContext, scene, camera, accumulator) => {
	accumulator.push(() => {
		if (arSource.ready === false) return

		// Returns true when the frame (from the canvas) has done processing using ARController API
		arContext.update(arSource.domElement)
		// Set the visibility (show the augmented image)
		scene.visible = camera.visible
	})
}
