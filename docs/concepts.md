# Concepts

## Augmented Reality
[Ar.js](https://github.com/jeromeetienne/AR.js) provides a web-based augmented reality solution to create AR on the web. It relies on -

* [Three.js](https://threejs.org) - For 3D on the web
* [ArToolKit](https://github.com/artoolkit) - Tracking and recognition SDK which enables computers to see and understand more in the environment around them.
* [Emscripten and asm.js](https://github.com/kripken/emscripten) - Compiling ArToolKit C into JavaScript

ArToolKit is based on two main registrations.

* **Geometric registration** - Aligning the position of virtual environment with the actual environment.

* **Photometric registration** - Matching the appearance of objects in the virtual environment to the actual environment

You can find more detailed documention for ArToolKit [here](https://github.com/artoolkit/ar6-wiki).

To use and manage the ArToolKit easily, [Jerome Etienne](https://twitter.com/jerome_etienne) created an extension for Three.js named **threex.artoolkit**.

## threex.artoolkit

### ArToolKitSource

It is the source type which will analyse the position tracking of the marker. It can be a webcam,video or an image.

**Rationale**

* Initialise a source type (webcam, image or a video)
* Appends the source type to the DOM and set ready flag to true
* Can be use to enable debugging of the WebGL canvas
* Resizes the element with browser's resize event
* Copies the attributes to the canvas element for analysing the marker position

### ArToolKitContext

Main engine. It finds the marker position on the image source.

**Rationale**

* It can be used to create a default camera based on the tracking backend input ('artoolkit'/'aruco')
* Initialises the context with a callback 
* Transforms the ArToolKit matrix to match webgl one
* Configures the ARController
* It has `getProjectionMatrix()` method to transform the 3D matrix to the camera because
the monitor (camera) is a 2D surface and to render the 3D surface on a camera, it has to transform the matrix (`GL_PROJECTION matrix` is used for this transformation)

### ArToolKitMarkerControl

Controlling the position of the marker.

**Rationale**

* It adds the marker with `addMarker` (low-level) to the ArToolKit core.
* Removes the marker with `dispose()` method from the ArToolKit core.
* Loads the marker with the pattern url
* Event system -
  *	Top-level event `getMarker` is fired and a callback function `onMarkerFound` is called with an event for marker detection and updating the matrix.
  *	The event `markerFound` is called when the marker is detected. This is useful in some use case where you need to do something when the marker is not visible

[Learn more about threex.artoolkit classification in implementation notes](./implementation.md).

[Continue to demo section](./demo.md)
