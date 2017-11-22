function initialiseARContext(camera, props) {
  const arContext = new window.THREEx.ArToolkitContext(props);

  arContext.init(function onCompleted() {
    // copy projection matrix to camera
    camera.projectionMatrix.copy(arContext.getProjectionMatrix());
  });

  return arContext;
}

export default initialiseARContext;
