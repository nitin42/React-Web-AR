// ARToolKit parameters for the arjs component that is registered into AFrame context
export const setARToolKitParameters = parameters => `
  debugUIEnabled: ${parameters.debugUIEnabled || false};
  detectionMode: ${parameters.detectionMode || ''};
  matrixCodeType: ${parameters.matrixCodeType || ''};
  cameraParametersUrl: ${parameters.cameraParametersUrl || ''};
  maxDetectionRate: ${parameters.maxDetectionRate || -1};
  sourceType: ${parameters.sourceType || 'webcam'};
  sourceUrl: ${parameters.sourceUrl || null};
  sourceWidth: ${parameters.sourceWidth || -1};
  sourceHeight: ${parameters.sourceHeight || -1};
  displayHeight: ${parameters.displayHeight || -1};
  displayWidth: ${parameters.displayWidth || -1};
  canvasHeight: ${parameters.canvasHeight || -1};
  canvasWidth: ${parameters.canvasWidth || -1};
`