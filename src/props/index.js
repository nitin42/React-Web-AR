import PropTypes from 'prop-types'

const toolKitSourceTypes = () =>
  PropTypes.shape({
    sourceType: PropTypes.string,
    sourceUrl: PropTypes.string,
    sourceWidth: PropTypes.number,
    sourceHeight: PropTypes.number,
    displayHeight: PropTypes.number,
    displayWidth: PropTypes.number
  })

const toolKitContextTypes = () =>
  PropTypes.shape({
    trackingBackend: PropTypes.string,
    debug: PropTypes.bool,
    detectionMode: PropTypes.string,
    matrixCodeType: PropTypes.string,
    cameraParametersUrl: PropTypes.string,
    maxDetectionRate: PropTypes.number,
    canvasHeight: PropTypes.number,
    canvasWidth: PropTypes.number,
    imageSmoothingEnabled: PropTypes.bool
  })

const toolKitMarkerControlTypes = () =>
  PropTypes.shape({
    size: PropTypes.number,
    type: PropTypes.string,
    patternUrl: PropTypes.string,
    barcodeValue: PropTypes.number,
    changeMatrixMode: PropTypes.string,
    minConfidence: PropTypes.number
  })

// AR.js resets the input parameters when the source type changes (to undefined)

const toolKitSourceProps = () => {
  return {
    sourceType: 'webcam', // source type ['webcam', 'image', 'video']
    sourceUrl: null, // source url for image or a video, valid if sourceType = image | video
    // resolution at which the source image will be initialised
    sourceWidth: 640,
    sourceHeight: 480,
    displayWidth: 640,
    displayHeight: 640
  }
}

const toolKitContextProps = () => {
  return {
    trackingBackend: 'artoolkit', // ['artoolkit', 'aruco', 'tango']
    debug: false, // Enable debug for canvas in developing
    detectionMode: 'color_and_matrix', // Detection mode ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
    matrixCodeType: '3x3', // Matrix size, valid if detectionMode end with 'matrix' - [3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]
    cameraParametersUrl:
      window.THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat', // For source type camera
    maxDetectionRate: 60, // Tunning for maximum rate of pose detection in the source image
    canvasWidth: 640, // Canvas width
    canvasHeight: 480, // Canvas height
    imageSmoothingEnabled: true // Smoothen an image when scaling the canvas (default)
  }
}

const toolKitMarkerControlProps = () => {
  return {
    size: 1, // Size of the marker (m)
    type: 'pattern', // Type of marker ['pattern', 'barcode', 'unknown' ]
    patternUrl:
      window.THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro', // Url for pattern (type should be pattern)
    barcodeValue: null, // Value for the barcode (if type is barcode)
    changeMatrixMode: 'cameraTransformMatrix', // change the matrix mode
    minConfidence: 0.6 // minimal confidence in the marke recognition - between [0, 1]
  }
}

// export const markerPropTypes = () => {
//   return {
//     parameters: PropTypes.shape({
//       type: PropTypes.string,
//       size: PropTypes.number,
//       patternUrl: PropTypes.string,
//       url: PropTypes.string,
//       barcodeValue: PropTypes.number,
//       changeMatrixMode: PropTypes.string,
//       minConfidence: PropTypes.number,
//       preset: PropTypes.string,
//       markerhelpers: PropTypes.bool
//     })
//   }
// }

export const ReactArToolKitComponentDefaultProps = () => {
  return {
    toolKitSource: toolKitSourceProps(),
    toolKitContext: toolKitContextProps(),
    toolKitMarkerControl: toolKitMarkerControlProps(),
    glRendererProps: {
      antialias: true,
      alpha: true
    }
  }
}

export const ReactArToolKitComponentPropTypes = () => {
  return {
    toolKitSource: toolKitSourceTypes(),
    toolKitContext: toolKitContextTypes(),
    toolKitMarkerControl: toolKitMarkerControlTypes()
  }
}
