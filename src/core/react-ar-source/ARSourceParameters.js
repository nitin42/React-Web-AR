// Input parameters for ARToolKitSource
export const setARSourceParameters = (parameters) => {
  const { sourceType, sourceUrl, sourceWidth, sourceHeight, displayHeight, displayWidth } = parameters

  return {
    sourceType,
    sourceUrl,
    sourceWidth: sourceWidth || 640,
    sourceHeight: sourceHeight || 480,
    displayHeight: displayHeight || 640,
    displayWidth: displayWidth || 640
  }
}
