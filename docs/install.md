# Install

* Place these two files in your `index.html`

```html
<script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
<script src="https://rawgit.com/jeromeetienne/ar.js/master/aframe/build/aframe-ar.js"></script>
```

The first script is required to use [aframe](aframe.io) primitives with `AR.js` and the other script registers the `arjs` component in aframe which is required to configure the ARToolKit system.

* Install `React-AR`
> Not released yet

```
npm install react-web-ar
```

This is the main package that contains the components to render AR on web using [three.js](https://threejs.org) or [aframe.io](aframe.io) primitives.

* Install `three.js` to create and render 3D objects. Also, `ReactArToolKit` component relies on `three.js` internally so make sure you've installed it.

```
npm install three
```

[Continue to usage section](./usage.md)
