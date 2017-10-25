# Table of contents
[WIP]

* [Introduction](#introduction)
* [Concepts](#concepts)
* [Demo](#demo)
* [Classification](#classification)
* [Install](#install)
* [Configuration](#configuration)
* [Usage](#usage)
* [API Reference](#api-reference)
* [Resources](#resources)
* [Performance](#performance)
* [Contributing](#contributing)
* [License](#license)

## Introduction

**Augmented Reality** is projection of virtual world but fused with reality which makes it different from **Virtual Reality** where the actual environment is hidden and it simulates a physical presence in virtual environment.

This project aims to bridge AR with React to create AR on the web with ease. It uses AR.js behind the scenes to describe the **AR context** and configure the **AR controller** which we will cover in more detail in [concepts](#concepts) section.

### Why React?

* Components 🔥
* Ability to sync AR lifecyle with React lifecyle hooks
* Clean and minimal API
* Declaratively controlling the render loop (AR controller core)
* Easy to create AR content that can be used and integrated anywhere

## Concepts

### Augmented Reality
[Ar.js](https://github.com/jeromeetienne/AR.js) provides a web-based augmented reality solution to create AR on the web. It relies on -

* [Three.js](https://threejs.org) - For 3D on the web
* [ArToolKit](https://github.com/artoolkit) - Tracking and recognition SDK which enables computers to see and understand more in the environment around them.
* [Emscripten and asm.js](https://github.com/kripken/emscripten) - Compiling ArToolKit C into JavaScript

ArToolKit is based on two main registrations.

* **Geometric registration** - Aligning the position of virtual environment with the actual environment.

* **Photometric registration** - Matching the appearance of objects in the virtual environment to the actual environment

You can find more detailed documention for ArToolKit [here](https://github.com/artoolkit/ar6-wiki).

To use and manage the ArToolKit easily, [Jerome Etienne](https://twitter.com/jerome_etienne) created an extension for Three.js named **threex.artoolkit**.

### threex.artoolkit Classification

**ArToolKitSource**

It is the source type which will analyse the position tracking of the marker. It can be a webcam,video or an image.

#### Functionalities

* Initialise a source type (webcam, image or a video)
* Appends the source type to the DOM and set ready flag to true
* Can be use to enable debugging of the WebGL canvas
* Resizes the element with browser's resize event
* Copies the attributes to the canvas element for analysing the marker position

#### Parameters

ArToolKitSource supports following parameters - 

* **sourceType** - `['webcam', 'image', 'video']`
* **sourceUrl** - source url when the source type is video or an image
* **sourceWidth** - resolution at which the source image will be initialised
* **sourceHeight**
* **displayWidth**
* **displayHeight**

**ArToolKitContext**

Main engine. It finds the marker position on the image source.

#### Functionalities

* It can be used to create a default camera based on the tracking backend input ('artoolkit'/'aruco')
* Initialises the context with a callback 
* Transforms the ArToolKit matrix to match webgl one
* Configures the ARController
* It has getProjectionMatrix() method to transform the 3D matrix to the camera because
the monitor (camera) is a 2D surface and to render the 3D surface on a camera, it has to transform the matrix (GL_PROJECTION matrix is used for this transformation)

#### Parameters

* **trackingBackend** - `['artoolkit', 'aruco', 'tango']`
* **debug** - Enable debug for canvas in developing
* **detectionMode** - `['color', 'color_and_matrix', 'mono', 'mono_and_matrix']`
* **matrixCodeType** - Matrix size, valid if detectionMode end with 'matrix' - `[3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]`
* **cameraParametersUrl** - For source type camera
* **maxDetectionRate** - Tunning for maximum rate of pose detection in the source image
* **canvasWidth** - Canvas width
* **canvasHeight** - Canvas height
* **imageSmoothingEnabled** - Smoothen an image when scaling the canvas (default)

**ArToolKitMarkerControl**

Controlling the position of the marker.

#### Functionalities

* It adds the marker with addMarker (low-level) to the ArToolKit core.
* Removes the marker with dispose() method from the ArToolKit core.
* Loads the marker with the pattern url
* Event system -
  *	Top-level event `getMarker` is fired and a callback function `onMarkerFound` is called with an event for marker detection and updating the matrix.
  *	The event `markerFound` is called when the marker is detected. This is useful in some use case where you need to do something when the marker is not visible

#### Parameters

* **size** - Size of the marker
* **type** - Type of marker `['pattern', 'barcode', 'unknown' ]`
* **patternUrl** - Url for pattern (type should be pattern)
* **barcodeValue** - Value for the barcode (if type is barcode)
* **changeMatrixMode** - change the matrix mode
* **minConfidence** - minimal confidence in the marke recognition - between `[0, 1]`

## Demo

[Demo](https://twitter.com/NTulswani/status/911284951181438976)

[Delimiting rotation demo](https://twitter.com/NTulswani/status/915218481649377280)


## Install

First, place these two files in your index.html (AR.js is packaged in an old manner so...).

```html
<script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
<script src="https://rawgit.com/jeromeetienne/ar.js/master/aframe/build/aframe-ar.js"></script>
```

Second, install `react-ar`

via npm

```
npm install react-ar
```

or if you use yarn

```
yarn add react-ar
```

Lastly, install `three.js` to create and render 3D objects. Also, `ReactArToolKit` component relies on `three` internally so make sure you've installed it.

```
npm install three
```

## Usage

[With webcam](../examples/webcam.js)

[With image](../examples/image.js)

Assuming you've downloaded [this](../public/hiro_marker.png) image, place it in the folder you're serving via the local development server.

> Note - Don't try to import the image because `sourceUrl` prop expects a relative url for an image

[With video](../examples/video.js)

**Basic example**

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'

import ReactArToolKit from 'react-ar'

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
```

## API Reference

### Props

**`toolKitSource`**

| Property      | Type           | Default  | Values |
| ------------- |:-------------:| :-----:| -------------:|
| `sourceType` | `string` | webcam | `['webcam', 'image', 'video']` |
| `sourceUrl` | `string` | null (for webcam)| - |
| `sourceHeight` | `number` | 480 | - |
| `sourceWidth` | `number` | 640 | - |
| `displayHeight` | `number` | 640 | - |
| `displayWidth` | `number` | 640 | - |


 
> Note - `sourceUrl` is null for `sourceType` webcam.

**`toolKitContext`**

| Property      | Type           | Default  | Values |
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

**`toolKitMarkerControl`**

| Property      | Type           | Default  | Values |
| ------------- |:-------------:| -----:| -------------:|
| `size` | `number` | `1` | - |
| `type` | `string` | `'pattern'` | `['pattern', 'barcode', 'unknown' ]` |
| `patternUrl` | `string` | `'patt.hiro'` | - |
| `barcodeValue` | `number` | `null` (initialise a bar code value when the type is barcode) |
| `changeMatrixMode` | `string` | `cameraTransformMatrix` | - |
| `minConfidence` | `number` | `1` | - |

**Render prop pattern**

You can see that we render the 3D objects using the render prop pattern. In render prop pattern, we have a scene, a camera, an accumulator to store the functions to be rendered and a delimiter function which accepts seconds.

You can create 3D objects using `three.js` and add them to the scene (using `scene.add(object)`).

You can also add a function to render which accepts an argument (`seconds`) to animate the object.

Finally, you can control the animation using `delimiter` function (frame per second).

## Classification (Implementation notes)

### ArToolKitSource

`getParameters()`

Get the [input parameters](#parameters)

`setParameters()`

Set the [input parameters](#parameters)

`initialize(callback)`

Initialise a source type (webcam, video or an image)

sourceType = `'image'`

* create an image element and append style attributes.
* Waits until the video stream is available and then return the domElement

sourceType = `'video'`

* creates a video element and add default props
* Waits until the video stream is available and then return the domElement

sourceType = `'webcam'`

* Sames as video but the props are different

attach the domElement to th document and set the ready flag to be true

`ready === true ? callback() : null`

`copyElementSizeTo(otherElement)`

Copies the source domElement styles to the otherElement argument (useful when the window size changes or something)

`onResize(context, renderer, camera)`

Computes the new height, width and margin for the source domElement (when arg.length === 0)

### ArToolKitContext

`setup(width, height)`

initalize a buffer size for a canvas of width & height

`process(canvas)`

extracts a frame from a canvas and process it

`debugSetup()`

enables debugging, adds a threshold image to the dom (can be enabled using the prop, debug)

`getDetectedMarkers()`

returns an array of detected markers from last detection process

`getCameraMatrix()`

returns the projection matrix computed from camera parameters

`getTransformationMatrix()`

returns the 16-element WebGL transformation matrix (after transforming the 3D matrix to render the object with GL_Transformation matrix)

### ArToolKitMarkerControl

Implements the same getter and setter method for parameters as `ArToolKitSource`.

Uses `ArController` (artoolkit core compiled from C) to add marker (hiro, kanji) and create the transform matrix

