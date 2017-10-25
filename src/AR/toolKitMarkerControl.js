import { ReactArToolKitMarkerController } from '../constructors/ar'

let initialiseArToolKitMarkerControlController = (parameters, renderer, arContext, root) => {
  const { type, patternUrl, changeMatrixMode, barcodeValue } = parameters

  // Root will be configured in a different way.
  const toolKitMarkerControl = new ReactArToolKitMarkerController(arContext, root, {
    type,
    patternUrl,
    changeMatrixMode,
    barcodeValue,
  })

  // marker.addEventListener('markerFound', onMarkerFound);

  return toolKitMarkerControl
}

export default initialiseArToolKitMarkerControlController