# API Reference

**API for `ReactArToolKit` component is experimental**

## `ReactArToolKit` component props

### toolKitSource

| Property      | Type           | Default  | Supported values / suggestions |
| ------------- |:-------------:| :-----:| -------------:|
| `sourceType` | `string` | `'webcam'` | `['webcam', 'image', 'video']` |
| `sourceUrl` | `string` | null (for `'webcam'`)| A valid relative url for the source, can be an image or a video |
| `sourceHeight` | `number` | `480` | A valid height |
| `sourceWidth` | `number` | `640` | A valid width |
| `displayHeight` | `number` | `640` | A valid display height |
| `displayWidth` | `number` | `640` | A valid display width |

> Note - `sourceUrl` is null for `sourceType` webcam and source dimensions are in **px**.

### toolKitContext

| Property      | Type           | Default  | Supported values / suggestions|
| ------------- |:-------------:| :-----:| -------------:|
| `trackingBackend` | `string` | `'artoolkit'` | `['artoolkit', 'aruco', 'tango']` |
| `debug` | `boolean` | `false` | - |
| `detectionMode` | `string` | `color_and_matrix` | `['color', 'color_and_matrix', 'mono', 'mono_and_matrix']` |
| `matrixCodeType` | `string` | `3x3` | `[3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]` (valid only if the detection mode ends with 'matrix') |
| `cameraParametersUrl` | `string` | `parameters/camera_pat.data` | - |
| `maxDetectionRate` | `number` | `60` | - |
| `canvasHeight` | `number` | `640` | - |
| `canvasWidth` | `number` | `480` | - |
| `imageSmoothingEnabled` | `boolean` | `true` | - |

Read more about `imageSmoothingEnabled` [here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled).
> Note - Canvas dimensions are in **px**.

### toolKitMarkerControl

| Property      | Type           | Default  | Supported values / suggestions |
| ------------- |:-------------:| -----:| -------------:|
| `size` | `number` | `1` | - |
| `type` | `string` | `'pattern'` | `['pattern', 'barcode', 'unknown' ]` |
| `patternUrl` | `string` | `'patt.hiro'` | A valid pattern name, kanji or hiro |
| `barcodeValue` | `number` | `null` (initialise a bar code value when the type is `barcode`) | - |
| `changeMatrixMode` | `string` | `cameraTransformMatrix` | - |
| `minConfidence` | `number` | `0.6` | - |

### Render prop pattern

You can see that we render the 3D objects using the render prop pattern. In render prop pattern, we have a scene, a camera, an accumulator to store the functions to be rendered and a delimiter function which accepts seconds.

You can create 3D objects using `three.js` and add them to the scene.

You can also add a function to render which accepts an argument (`seconds`) to animate the object.

Finally, you can control the animation using `delimiter` function (frame per second).

## Explaination

The reason we are using the render prop pattern is because the way AR.js is built and controls its lifecycle.

The three main phases of AR.js core are:

* Initialise a scene and camera
* Initialise an accumulator to store the functions to render (also receives an argument)
* Start the render loop and control the animation

Using this pattern, we give total control to the user to create 3D object and update the render loop (add functions to render).

## Using the render prop pattern (Experimental API)

It provides four arguments to manage the creation and rendering of 3D objects, `scene`, an `accumulator`, `camera` and `delimiter`.

You can create an object using `three.js` and then add it to the scene.

```js
let geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16)
let material = new THREE.MeshNormalMaterial()
let mesh = new THREE.Mesh(geometry, material)

mesh.position.y = 0.5

scene.add(mesh)
```

You can also pass a function to animate an object to the accumulator. Like this -

```js
// Rotate the mesh with delta seconds
// Delta seconds is the time when the animation was fired before the next repaint divided by delimit seconds (can be controlled with delimiter function)
// Append function to render
accumulator.push(function(delta) {
  mesh.rotation.x += Math.PI * delta
})
```

`React-AR` then manages the accumulator state internally and starts the rendering loop.

You can also control the delimit seconds with `delimiter` function.

```js
delimiter(600)
```

Try changing and passing the argument to delimiter function and you'll notice the change in animation.

## `AFrameRenderer` component props

### arToolKit

| Property      | Type           | Default  | Supported values |
| ------------- |:-------------:| :-----:| -------------:|
| `sourceType` | `string` | `'webcam'` | `['webcam', 'image', 'video']` |
| `sourceUrl` | `string` | null (for `'webcam'`)| ''|
| `sourceHeight` | `number` | `-1` | - |
| `sourceWidth` | `number` | `-1` | - |
| `displayHeight` | `number` | `-1` | - |
| `displayWidth` | `number` | `-1` | - |
| `debugUIEnabled` | `boolean` | `false` | - |
| `detectionMode` | `string` | '' | `['color', 'color_and_matrix', 'mono', 'mono_and_matrix']` |
| `matrixCodeType` | `string` | '' | `[3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]` |
| `cameraParametersUrl` | `string` | '' | `window.THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat'` |
| `maxDetectionRate` | `number` | `-1` | - |
| `canvasHeight` | `number` | `-1` | - |
| `canvasWidth` | `number` | `-1` | - |

### getSceneRef

`getSceneRef` accepts a function with an argument and returns a reference to `<a-scene>` primitive. This reference can be used to switch the mode to either `stereo` or `mono` or in other words `enterVR()` and `exitVR()`. It can also be used with the events associated with `<a-scene>`.

For example -

```js
class ArApp extends React.Component {
  componentWillUnmount() {
    this.scene.exitVR()
  }

  render() {
    return (
      <AFrameRenderer getSceneRef={(ref) => this.scene = ref}
        {this.props.children}
      </AFrameRenderer>
    )
  }  
}

```

Learn more about the events and methods supported by `<a-scene>` [here](https://aframe.io/docs/0.7.0/core/scene.html#methods).

## inherent

**`type`** - `boolean`\
**`default`** - `true`

**What is the use of inherent prop?**

Uses a basic marker component (\<a-marker /\>) and a camera component which is static at (0, 0, 0) and uses **`modelViewMatrix`** ([matrix transformation]()). 
**`modelViewMatrix`** determines what user sees on the camera. 

I recommend reading a little more about `modelViewMatrix`. You can find an easy and detailed description about it(not too much math) [here]().

### Supported properties for `<a-scene>`

You can add the same properties to `AFrameRenderer` that you used to add to `<a-scene>` primitive in aframe.io. Also, it means that you can register a custom component using `AFRAME` global and then pass it to `AFrameRenderer` component.

For example -

You register a component in aframe.io in this manner,

```js

AFRAME.registerComponent('hello-world', {
  init: function () {
    console.log('Hello, World!');
  }
});

<a-scene hello-world></a-scene>
```

Same is applicable for `AFrameRenderer` component. Register the component in similar way and then pass it as a prop.

```js
<AFrameRenderer hello-world />
```

Below is an example that shows how you can use everything (every prop) in `AFrameRenderer` component.

```js
import React, { Component } from 'react'
import { render } from 'react-dom'

import { AFrameRenderer, Marker } from 'react-web-ar'

const THREE = require('three')

class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{ sourceType: 'image', sourceUrl: './images/hiro_marker.png'}}
        stats
        getSceneRef={ref => (this.scene = ref)} // 
        inherent={true}
      >
        <Marker parameters={{ preset: 'hiro' }}>
          <a-box color='pink' material='opacity: 1;' position="0 0.003 0" scale='0.4 0.4 0.4'>
            <a-animation attribute="rotation" to="360 0 0" dur="5000" easing="linear" repeat="indefinite" />
          </a-box>
        </Marker>
      </AFrameRenderer>
    )
  }
}

render(<ReactArApp />, document.getElementById('root'))
```

### marker

| Property      | Type           | Default  | Supported values |
| ------------- |:-------------:| -----:| -------------:|
| `size` | `number` | `1` | - |
| `type` | `string` | `'pattern'` | `['pattern', 'barcode', 'unknown' ]` |
| `patternUrl` | `string` | `'patt.hiro'` | - |
| `barcodeValue` | `number` | `null` (initialise a bar code value when the type is `barcode`) | - |
| `minConfidence` | `number` | `0.6` | - |
| `preset` | `string` | `'hiro'` | ['hiro', 'kanji', 'custom']


[Continue to implementation notes section](./implementation.md)
