import { ReactArToolKitMarkerController } from '../../constructors/ReactARGlobals'
import { setARToolKitMarkerControlParameters } from './ARMarkerControlParameters'

// Event fired when the marker is found on the screen! Can be used in some business logic
// toolKitMarkerControl.addEventListener('markerFound', () => console.log("Hello World! I found the marker"));
// Remove the 'renderer' argument
export const initialiseARToolKitMarkerControlController = (parameters, renderer, arContext, root) =>
	new ReactArToolKitMarkerController(arContext, root, setARToolKitMarkerControlParameters(parameters))
