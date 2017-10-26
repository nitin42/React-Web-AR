# Usage

**Basic example**

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'

import ReactArToolKit from 'react-web-ar'

const THREE = require('three')

class ReactArApp extends Component {
  render() {
    return (
      <ReactArToolKit>
        {(scene, accumulator, camera, delimiter) => {
          // Create 3D object
          let geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16)
          let material = new THREE.MeshNormalMaterial()
          let mesh = new THREE.Mesh(geometry, material)
          
          mesh.position.y = 0.5

          // Add it to scene
          scene.add(mesh)

          // Append function to render
          accumulator.push(function(delta) {
            mesh.rotation.x += Math.PI * delta
          })

          // Frame per sec (used in controlling animation rate) 
          delimiter(500)
        }}
      </ReactArToolKit>
    )
  }
}

render(<ReactArApp />, document.getElementById('root'))
```

Now move the `hiro` pattern marker on the webcam and enjoy!

## More examples

* [Source type webcam](../examples/webcam.js)

* [Source type image](../examples/image.js)

> Note - Don't try to import the image when the source type is an image because `sourceUrl` prop expects a relative url for an image

* [Source type video](../examples/video.js)

[Continue to API section](./api.md)
