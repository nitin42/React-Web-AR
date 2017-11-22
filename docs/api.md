# API Reference

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
| `trackingMethod` | `string` | `best` | ['tango', 'artoolkit', 'best'] |
| `areaLearningButton` | `boolean` | `true` | - |
| `performanceProfile` | `string` | `default` | - |
| `tangoPointCloudEnabled` | `boolean` | `false` | - |

`trackingMethod` decides which tracking module to use. If set to `best`, it always tries to provide the best tracking module available on a device.

* If you use a tango device, it will use tango tracking.
* If you use a normal device, it will use pure web based tracking.
* If you use an iOS device, it will use `artoolkit`.

Tango tracking means markerless tracking. Using tango tracking, you can add virtual objects by selecting positions in real world.
This tracking module is robust, efficient and mature. Read more about tango tracking [here](https://developers.google.com/tango/overview/concepts).

### getSceneRef

`getSceneRef` accepts a function with an argument and returns a reference to `<a-scene>` primitive. This reference can be used to switch the mode to either `stereo` or `mono` or in other words `enterVR()` and `exitVR()`. It can also be used with the events associated with `<a-scene>`.

Learn more about the events and methods supported by `<a-scene>` [here](https://aframe.io/docs/0.7.0/core/scene.html#methods).

For example -

```js
class App extends React.Component {
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

## inherent

**`type`** - `boolean`\
**`default`** - `true`

**What is the use of inherent prop?**

If set to `true`, `AFrameRenderer` component uses a basic marker component (\<a-marker /\>) and a camera component which is static at (0, 0, 0) and uses **`modelViewMatrix`**. 
**`modelViewMatrix`** determines what user sees on the camera. 

I recommend reading a little more about `modelViewMatrix`. You can find an easy and detailed description about it(not too much math) [here]().

### Supported properties for `<a-scene>`

You can add the same properties to `AFrameRenderer` component that you used to add to `<a-scene>` primitive in aframe.io. Also, it means that you can register a custom component using `AFRAME` global and then pass it to `AFrameRenderer` component.

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

## Marker component props

Marker component accepts only a single prop `parameters`. You can add following properties to the `parameters` object.

| Property      | Type           | Default  | Supported values |
| ------------- |:-------------:| -----:| -------------:|
| `size` | `number` | `1` | - |
| `type` | `string` | `'pattern'` | `['pattern', 'barcode', 'unknown' ]` |
| `patternUrl` | `string` | `'patt.hiro'` | - |
| `barcodeValue` | `number` | `null` (initialise a bar code value when the type is `barcode`) | - |
| `minConfidence` | `number` | `0.6` | - |
| `preset` | `string` | `'hiro'` | ['hiro', 'kanji', 'custom']
| `hit-testing-enabled` | `boolean` | `false` | - |
| `hit-testing-renderDebug` | `boolean` | `false` | - |

> Hit Testing - Process of determining whether the user controlled cursor intersects a graphic object or not. It is used in graphics programming for detecting the intersection.

[Continue to implementation notes section](./implementation.md)
