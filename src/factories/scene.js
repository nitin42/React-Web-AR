const Three = require("three");

// Initialise a scene with props
function createScene(props) {
  return Object.assign(new Three.Scene(), props.sceneProps || {});
}

export default createScene;
