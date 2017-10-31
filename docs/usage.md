# Usage

You can use `React-AR` with [three.js](https://threejs.org) or also with [aframe.io](aframe.io) primitives.

## Three.js

Below is an example which shows the `React-AR` usage with `three.js`

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'

import { ReactArToolKit } from 'react-web-ar'

const THREE = require('three')

class ReactArApp extends Component {
  render3D(scene, accumulator, delimiter) {
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
  }

  render() {
    return (
      <ReactArToolKit toolKitSource={{ sourceType: 'webcam' }}>
        {(scene, accumulator, camera, delimiter) => {
          this.render3D(scene, accumulator, delimiter)
        }}
      </ReactArToolKit>
    )
  }
}

render(<ReactArApp />, document.getElementById('root'))
```

[Complete API reference for usage with three.js]()

## aframe.io

Below is an example which shows the `React-AR` usage with [aframe.io](aframe.io) primitives.

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'

import { AFrameRenderer } from 'react-web-ar'

const THREE = require('three')

class ReactArApp extends Component {
  render() {
    return (
      // Render your aframe primitives inside this top level component
      <AFrameRenderer
        arToolKit={{ sourceType: 'webcam' }}
        marker={{ preset: 'hiro' }}
      >
        <a-box
          color="red"
          position="0 0.3 0"
          rotation="0 45 45"
          scale="0.18 0.18 0.18"
        >
          <a-animation
            attribute="position"
            to="0 0.8 0"
            direction="alternate"
            dur="800"
            repeat="indefinite"
          />
        </a-box>
      </AFrameRenderer>
    )
  }
}

render(<ReactArApp />, document.getElementById('root'))

```

[Complete API reference for usage with aframe.io]()

Now move the `hiro` pattern marker on the webcam, or if you have an image of `hiro` marker or a video. For samples, you can download the assets from [public]() folder in this repo.

Try changing the prop `sourceType` and `sourceUrl` and notice the behavior when it renders the object.

> Note - Don't try to import the image when the source type is an image because `sourceUrl` prop expects a relative url for an image. For example - { sourceType: 'image', sourceUrl: './some_relative_path_.png'}. Also, make sure that the image is in the folder that you're serving via a dev server.

## Creating a custom marker

You can also create and use your own marker along with `hiro` and `kanji`.

Follow the below steps to create your own marker:

* Go to [this](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) link. Its a simple web app to create and download the custom marker pattern.

* Upload an image

* Download the pattern file

* Save that image

Now after you've the image and its corresponding pattern file, simply provide a path to the `pattern`.

> If your marker doesn't work, you can read to [this thread](https://github.com/jeromeetienne/AR.js/issues/164#issuecomment-332065686) about editing the image and regenerating the pattern file.

## More examples

You can all the different examples [here](../examples).

[Continue to API section](./api.md)
