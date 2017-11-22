# Install

* Place these two files in your `index.html`

```html
<script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
<script src="https://rawgit.com/jeromeetienne/ar.js/master/aframe/build/aframe-ar.js"></script>
```

The first script is required to use [aframe](aframe.io) primitives with `AR.js` and the other script registers the `arjs` component in aframe which is required to configure the ARToolKit system.

* Install `React-Web-AR`

```
npm install react-web-ar@1.0.0-beta2
```

This is the main package that contains the components to render AR on web.

Also, this depends on `react` so make sure you've installed it. 

[Continue to usage section](./usage.md)
