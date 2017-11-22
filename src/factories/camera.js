const Three = require("three");

// Initialise a camera with props
function createCamera(props) {
  return Object.assign(new Three.Camera(), props.cameraProps || {});
}

export default createCamera;
