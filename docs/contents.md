# Table of contents

* [Introduction](#introduction)
* [Concepts](#concepts)
* [Demo](https://github.com/nitin42/React-AR#more-information)
* [Classification](#classification)
* [Install](#install)
* [Configuration](#configuration)
* [Usage](#usage)
* [API Reference](api)
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

* Geometric registration - Aligning the position of virtual environment with the actual environment.

* Photometric registration - Matching the appearance of objects in the virtual environment to the actual environment

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

## Classification

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

