function renderLoop(accumulator, scene, camera, renderer, renderFn) {
  // Start with invisible scene when matrix mode is changed
  scene.visible = false;

  // Push the function to render the objects in our scene
  accumulator.push(function() {
    renderer.render(scene, camera);
  });

  renderFn(scene, camera, accumulator);

  // run the rendering loop
  let lastTimeMsec = null;

  requestAnimationFrame(function animate(nowMsec) {
    // keep looping
    requestAnimationFrame(animate);
    // measure time
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
    let deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
    lastTimeMsec = nowMsec;
    // call each update function
    accumulator.forEach(function(fn) {
      fn(deltaMsec / 1000, nowMsec / 1000);
    });
  });
}

export default renderLoop;
