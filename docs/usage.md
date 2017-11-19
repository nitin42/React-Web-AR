# Usage

## aframe.io

Below is an example which shows the `React-AR` usage with [aframe.io](aframe.io) primitives.

```jsx
import React, { Component } from 'react'
import { render } from 'react-dom'

import { AFrameRenderer, Marker } from 'react-web-ar'

class ReactArApp extends Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{ sourceType: 'image', sourceUrl: './images/hiro_marker.png'}}
        stats
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

Now move the `hiro` pattern marker on the webcam, or if you have an image of `hiro` marker or a video. For samples, you can download the assets from [public]() folder in this repo.

Try changing the prop `sourceType` and `sourceUrl` and notice the behavior when it renders the object.

<img src="https://i.gyazo.com/8a1100c650c291b926ca6ba3de6e5673.gif">

> Note - Don't try to import the image when the source type is an image because `sourceUrl` prop expects a relative url for an image. For example - `{ sourceType: 'image', sourceUrl: './some_relative_path_.png'}`. Also, make sure that the image is in the folder that you're serving via a dev server.

## Creating a custom marker

You can also create and use your own marker. Follow the below steps to create your own marker:

* Go to [this](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) link. Its a simple web app to create and download the custom marker pattern.

* Upload an image

* Download the pattern file

* Save that image

Now after you've the image and its corresponding pattern file, simply provide a path to the `pattern` and also a path to that image.

> Read [this thread](https://github.com/jeromeetienne/AR.js/issues/164#issuecomment-332065686) about editing the image and regenerating the pattern file if your marker doesn't work.

## Portals

You can also add a portal to the scene.

To use the portal primitive, add these two files to your `index.html`.

```
<script src="https://cdn.rawgit.com/nitin42/54030fc0d05dea9656fbab3db7bb7e05/raw/8879d49042989eb198afa04e8c4647eb2ccf7979/portal.js"></script>

<script src="https://cdn.rawgit.com/nitin42/8aa08aa7df4d4afbdb0c0a1ef8bf33b2/raw/e05c0c5cc2255b497c1460c6b65ade4a444bb246/threex-portal.js"></script>
```

Then use it like this,

```jsx
class PortalApp extends React.Component {
  render() {
    return (
      <AFrameRenderer
        arToolKit={{ sourceType: 'image', sourceUrl: './images/hiro_marker.png'}}
        inherent={false}
      >
        <a-portal-door url='./images/360_topaz.png' position='0 0 0' scale='1 1 1' rotation='0 90 0' />
        <a-static-camera />
      </AFrameRenderer>
    )
  }
}
```

You can also give a url to a video.

## More examples

You can find all the different examples [here](../examples).

[Continue to API section](./api.md)
