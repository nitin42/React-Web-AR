// Initialise a webgl renderer to show the 3D objects
function createGlRenderer(props) {
  return new Three.WebGLRenderer(props);
}

// Apply styles to the renderer
function applyStylesToRenderer(renderer, styles) {
  return Object.assign(renderer.domElement.style, styles);
}

// Initialise a scene with props
function createScene(props) {
  return Object.assign(new Three.Scene(), props || {});
}

// Initialise a camera with props
function createCamera(props) {
  return Object.assign(new Three.Camera(), props || {});
}

// Factory functions

const scene = createScene({ autoUpdate: true, background: "red" });

const renderer = createGlRenderer({ antialias: true, alpha: true });

const camera = createCamera({ ...props });

function initialiseMarker(arContext, camera, props) {
  return new THREEx.ArMarkerControls(arContext, camera, props);
}

function initialiseARContext(camera, props) {
  const arContext = new THREEx.ArToolkitContext(props);

  arContext.init(function onCompleted() {
    // copy projection matrix to camera
    camera.projectionMatrix.copy(arContext.getProjectionMatrix());
  });
}

function initialiseARSource(arContext, props, renderer) {
  const arSource = new THREEx.ArToolkitSource(props);

  arSource.init(function onReady() {
    onResize();
    // Do something when source initialises
  });

  // handle resize
  window.addEventListener("resize", function() {
    onResize();
  });

  function onResize() {
    arSource.onResize();
    arSource.copySizeTo(renderer.domElement);
    if (arContext.arController !== null) {
      arSource.copySizeTo(arContext.arController.canvas);
    }
  }

  return arSource;
}

function updateOnEveryFrame(accumulator, arSource, arContext, scene, camera) {
  accumulator.push(function() {
    if (arSource.ready === false) return;

    arContext.update(arSource.domElement);

    // update scene.visible if the marker is seen (display the virtual object)
    scene.visible = camera.visible;
  });
}

function renderLoop(accumulator, scene, camera, renderer) {
  // Start with invisible scene when matrix mode is changed
  scene.visible = false;

  // Push the function to render the objects in our scene
  accumulator.push(function() {
    renderer.render(scene, camera);
  });

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
    accumulator.forEach(function(renderFn) {
      renderFn(deltaMsec / 1000, nowMsec / 1000);
    });
  });
}

function addObjectsToRender(scene, accumulator, camera) {
  let geometry = new THREE.CubeGeometry(1, 1, 1);

  let material = new THREE.MeshNormalMaterial({
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = geometry.parameters.height / 2;

  scene.add(mesh);

  let geometryTwo = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
  let materialTwo = new THREE.MeshNormalMaterial();
  let meshTwo = new THREE.Mesh(geometryTwo, materialTwo);

  meshTwo.position.y = 0.5;
  scene.add(meshTwo);

  accumulator.push(function(delta) {
    meshTwo.rotation.x += Math.PI * delta;
  });
}

<Initialise>
  <ARRenderer
    source={{}}
    onInitialise={() => {}}
    context={{}}
    marker={{}}
    onMarkerFound={() => {}}
  >
    {(scene, accumulator, camera) => {
      addObjectsToRender(scene, accumulator, camera);
    }}
  </ARRenderer>
</Initialise>;
