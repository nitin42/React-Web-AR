function updateOnEveryFrame(accumulator, arSource, arContext, scene, camera) {
  accumulator.push(function() {
    if (arSource.ready === false) return;

    arContext.update(arSource.domElement);

    // update scene.visible if the marker is seen (display the virtual object)
    scene.visible = camera.visible;
  });
}

export default updateOnEveryFrame;
