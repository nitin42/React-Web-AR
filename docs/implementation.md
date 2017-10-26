# Implementation notes

## threex.artoolkit

### Input parameters for ArToolKitSource

ArToolKitSource takes the following parameters as input - 

* **`sourceType`** - `['webcam', 'image', 'video']`
* **`sourceUrl`** - source url when the source type is video or an image
* **`sourceWidth`** - resolution at which the source image will be initialised
* **`sourceHeight`**
* **`displayWidth`**
* **`displayHeight`**

### Input parameters for ArToolKitContext

* **`trackingBackend`** - `['artoolkit', 'aruco', 'tango']`
* **`debug`** - Enable debug for canvas in developing
* **`detectionMode`** - `['color', 'color_and_matrix', 'mono', 'mono_and_matrix']`
* **`matrixCodeType`** - Matrix size, valid if detectionMode end with 'matrix' - `[3x3, 3x3_HAMMING63, 3x3_PARITY65, 4x4, 4x4_BCH_13_9_3, 4x4_BCH_13_5_5]`
* **`cameraParametersUrl`** - For source type camera
* **`maxDetectionRate`** - Tunning for maximum rate of pose detection in the source image
* **`canvasWidth`** - Canvas width
* **`canvasHeight`** - Canvas height
* **`imageSmoothingEnabled`** - Smoothen an image when scaling the canvas (default)

### Input parameters for ArToolKitMarkerControl

* **`size`** - Size of the marker
* **`type`** - Type of marker `['pattern', 'barcode', 'unknown' ]`
* **`patternUrl`** - Url for pattern (type should be pattern)
* **`barcodeValue`** - Value for the barcode (if type is barcode)
* **`changeMatrixMode`** - change the matrix mode
* **`minConfidence`** - minimal confidence in the marke recognition - between `[0, 1]`

## Classification

### ArToolKitSource

`getParameters()`

Get the input parameters

`setParameters()`

Set the input parameters

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
