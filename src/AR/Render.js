let flush = (scene, camera, renderer, state, props, byAmt) => {
  const { accumulator } = state
  const { children } = props

  // As we perform 3D Transformation so we start with an invisible scene (too much math)
  scene.visible = false

  accumulator.push(() => {
    // render the scene
    renderer.render(scene, camera)
  })

  let newAm = 100

  const frameSec = (amt) =>  newAm = amt

  // Render the 3D objects
  children(scene, accumulator, camera, frameSec)

  let lastTimeMsec = null

  // Currently dispatching the animation via delimiter render prop
  requestAnimationFrame(function animate(nowMsec) {
    requestAnimationFrame(animate)
    lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec = nowMsec
    accumulator.forEach(onRenderFct => {
      onRenderFct(deltaMsec / newAm, nowMsec / newAm)
    })
  })
}

export default flush