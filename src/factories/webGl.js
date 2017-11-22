const Three = require("three");

function createGlRenderer(props) {
  return new Three.WebGLRenderer(props || {});
}

// Apply styles to the renderer
function applyStylesToRenderer(renderer, styles) {
  renderer.setClearColor(new THREE.Color("lightgrey"), 0);
  // renderer.setSize( 640, 480 );

  return Object.assign(renderer.domElement.style, styles || {});
}

// Add the renderer dom element
function appendElement(el) {
  document.body.appendChild(el);
}

function initGlRenderer(props) {
  const renderer = createGlRenderer(props.glProps);

  applyStylesToRenderer(renderer, props.style);

  appendElement(renderer.domElement);

  return renderer;
}

export default initGlRenderer;
