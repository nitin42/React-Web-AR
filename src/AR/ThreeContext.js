import { Scene, Camera } from '../constructors/three'

// These should be replaced with components (<Scene> and <Camera />)
let initialiseScene = () => {
	const scene = new Scene()

	return scene
}

let initialiseCamera = () => {
	// Or use ARToolKitContext.createDefaultCamera('artoolkit')
	// Or use createDefaultCamera('aruco'), creates PerspectiveCamera
	const camera = new Camera()

	return camera
}

export { initialiseScene, initialiseCamera }