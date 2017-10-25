import { ReactArToolKitContext } from '../constructors/ar'

let initialiseArToolKitContextController = (parameters) => {
  const {
    detectionMode,
    debug,
    matrixCodeType,
    maxDetectionRate,
    canvasHeight,
    canvasWidth,
    imageSmoothingEnabled,
  } = parameters

  const toolKitContext = new ReactArToolKitContext({
    // Configure the base url afterwards
    cameraParametersUrl: ReactArToolKitContext.baseURL + '../data/data/camera_para.dat',
    detectionMode,
    debug,
    matrixCodeType,
    maxDetectionRate,
    canvasWidth,
    canvasHeight,
    imageSmoothingEnabled,
  })

  return toolKitContext
}

let startArContextWork = (arContext, camera) => {
  // Render the 3D object on the 2D screen by 3D transformation using GL_Transformation matrix (too much math)
  arContext.init(function onCompleted() {
    camera.projectionMatrix.copy(arContext.getProjectionMatrix())
  })
}

let applyUpdates = (arSource, arContext, scene, camera, accumulator) => {
  accumulator.push(() => {
    if (arSource.ready === false) return

    // Returns true when the frame (from the canvas) has done processing using ARController API
    arContext.update(arSource.domElement)

    // Set the visibility
    scene.visible = camera.visible
  })
}

export {
  initialiseArToolKitContextController,
  startArContextWork,
  applyUpdates
}