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

Now move the `hiro` pattern marker on the webcam, or if you have an image of `hiro` marker or a video. For samples, you can download the assets from [public](../public) folder in this repo.

Try changing the prop `sourceType` and `sourceUrl` and notice the behavior when it renders the object.

<img src="https://i.gyazo.com/8a1100c650c291b926ca6ba3de6e5673.gif">

> Note - Don't try to import the image when the source type is an image because `sourceUrl` prop expects a relative url for an image. For example - `{ sourceType: 'image', sourceUrl: './some_relative_path_.png'}`. Also, make sure that the image is in the folder that you're serving via a dev server.

Read the docs for [aframe.io](aframe.io) for using the primitives.

## Creating a custom marker

You can also create and use your own marker. Follow the below steps to create your own marker:

* Go to [this](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) link. Its a simple web app to create and download the custom marker pattern.

* Upload an image

* Download the pattern file

* Save that image

Now after you've the image and its corresponding pattern file, simply provide a path to the `pattern` and also a path to that image.

> Read [this thread](https://github.com/jeromeetienne/AR.js/issues/164#issuecomment-332065686) about editing the image and regenerating the pattern file if your marker doesn't work.

## More examples

You can find all the different examples [here](../examples).

[Continue to API section](./api.md)
