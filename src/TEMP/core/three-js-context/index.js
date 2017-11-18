import { Scene, Camera } from '../../constructors/ThreeJSConstructors'

// These should be replaced with components (<Scene> and <Camera />)
export const initialiseScene = () => new Scene()

// Or use ARToolKitContext.createDefaultCamera('artoolkit')
// Or use createDefaultCamera('aruco'), creates PerspectiveCamera
export const initialiseCamera = () => new Camera()