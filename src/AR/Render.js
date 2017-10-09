let flush = (scene, camera, renderer, state, props, delimiter, byAmt) => {
  const { accumulator } = state
  const { children } = props

  // As we perform 3D Transformation so we start with an invisible scene (too much math)
  scene.visible = false

  accumulator.push(() => {
    // render the scene
    renderer.render(scene, camera)
  })

  // Render the 3D objects
  children(scene, accumulator, camera, delimiter)

  let lastTimeMsec = null

  let amt = byAmt

  // Currently dispatching the animation via delimiter render prop
  requestAnimationFrame(function animate(nowMsec) {
    requestAnimationFrame(animate)
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
    accumulator.forEach(onRenderFct => {
      onRenderFct(deltaMsec / amt, nowMsec / amt)
    })
  })
}

export default flush