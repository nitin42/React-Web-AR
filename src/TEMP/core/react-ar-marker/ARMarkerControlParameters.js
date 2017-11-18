import { ReactArToolKitContext } from '../../constructors/ReactARGlobals'

// Input parameters for ARToolKitMarkerControl
export const setARToolKitMarkerControlParameters = (parameters) => {
	let { type, patternUrl, changeMatrixMode, barcodeValue, size, minConfidence } = parameters

	// Set the pattern url
	if (['kanji', 'hiro'].includes(patternUrl)) {
		patternUrl = ReactArToolKitContext.baseURL + `../data/data/patt.${patternUrl}`
	}

	return {
		size: size || 1,
		type: type || 'pattern',
		patternUrl,
		changeMatrixMode: changeMatrixMode || 'cameraTransformMatrix',
		barcodeValue: barcodeValue || null,
		minConfidence: minConfidence || 0.6,
	}
}
