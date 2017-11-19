import { ReactArToolKitContext } from '../../constructors/ReactARGlobals'

// Input parameters for ARToolKitContext
export const setARToolKitContextParameters = (parameters) => {
  const {
    detectionMode,
    debug,
    matrixCodeType,
    maxDetectionRate,
    canvasHeight,
    canvasWidth,
    imageSmoothingEnabled,
  } = parameters
  
  return {
    // Configure the base url afterwards
    cameraParametersUrl: ReactArToolKitContext.baseURL + '../data/data/camera_para.dat',
    detectionMode,
    debug,
    matrixCodeType,
    maxDetectionRate,
    canvasWidth,
    canvasHeight,
    imageSmoothingEnabled,
  }
}
