function initialiseARSource(arContext, props, renderer) {
  const arSource = new window.THREEx.ArToolkitSource(props);

  arSource.init(function onReady() {
    onResize();
    // Do something when source initialises
  });

  // handle resize
  window.addEventListener("resize", function() {
    onResize();
  });

  function onResize() {
    arSource.onResizeElement();
    arSource.copyElementSizeTo(renderer.domElement);
    if (arContext.arController !== null) {
      arSource.copyElementSizeTo(arContext.arController.canvas);
    }
  }

  return arSource;
}

export default initialiseARSource;
