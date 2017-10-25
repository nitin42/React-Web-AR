import React, { Component } from 'react'
import { render } from 'react-dom'

import ReactArToolKit from '../src'

const THREE = require('three')

class ArApp extends Component {
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

render(<App />, document.getElementById('root'))


