# API Reference

## Props

### toolKitSource

| Property      | Type           | Default  | Values |
| ------------- |:-------------:| :-----:| -------------:|
| `sourceType` | `string` | 'webcam' | `['webcam', 'image', 'video']` |
| `sourceUrl` | `string` | null (for webcam)| - |
| `sourceHeight` | `number` | 480 | - |
| `sourceWidth` | `number` | 640 | - |
| `displayHeight` | `number` | 640 | - |
| `displayWidth` | `number` | 640 | - |d

> Note - `sourceUrl` is null for `sourceType` webcam and source dimensions are in **px**.

### toolKitContext

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

> Note - Canvas dimensions are in **px**.

### toolKitMarkerControl

| Property      | Type           | Default  | Values |
| ------------- |:-------------:| -----:| -------------:|
| `size` | `number` | `1` | - |
| `type` | `string` | `'pattern'` | `['pattern', 'barcode', 'unknown' ]` |
| `patternUrl` | `string` | `'patt.hiro'` | - |
| `barcodeValue` | `number` | `null` (initialise a bar code value when the type is barcode) |
| `changeMatrixMode` | `string` | `cameraTransformMatrix` | - |
| `minConfidence` | `number` | `1` | - |

### Render prop pattern

You can see that we render the 3D objects using the render prop pattern. In render prop pattern, we have a scene, a camera, an accumulator to store the functions to be rendered and a delimiter function which accepts seconds.

You can create 3D objects using `three.js` and add them to the scene (using `scene.add(object)`).

You can also add a function to render which accepts an argument (`seconds`) to animate the object.

Finally, you can control the animation using `delimiter` function (frame per second).

## Explaination

The reason we are using the render prop pattern is because the way AR.js is built and controls its lifecycle.

The three main phases of AR.js core are:

* Initialise a scene and camera
* Initialise an accumulator to store the functions to render (also receives an argument)
* Start the render loop and control the animation

Using this pattern, we give total control to the user to create 3D object and update the render loop (add functions to render).

Its not that I like this pattern or think its more convenient, I feel its judicious way to use AR on the web.

Although everything can be wrapped inside an another component or using `three.js` bindings but it would increase the complexity to track the accumulator state and it will also distort the way we control the render loop in AR.js. Plus, its difficult to bridge the `three.js` bindings for React with AR.js. Its doable but I don't consider this option because it comes at a cost, maintainability and also 👇

## Ok, render prop pattern, fine! But its React and I want everything to be a component.

Think if React didn't existed before and you were trying to use AR on the web. At that time, you only had one option, DO EVERYTHING IN AN IMPERATIVE WAY! But now that we use React to render almost anything on web, native, pdf, word why not wrap the main engine of AR inside a component using React. With React, we not only reduced the cognitive load to understand the working of AR, its lifecycle, rendering loop and its capabilities but we also preserved the actual way of using `three.js` with `AR.js`. This is a big win for us!

## Using the render prop pattern

It provides four argumnets to manage the creation and rendering of 3D objects, `scene`, an `accumulator`, `camera` and `delimiter`.

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