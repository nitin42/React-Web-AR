import { WebGl, Color } from '../constructors/three'

const initialiseGlRenderer = (props) => {
  const renderer = new WebGl({ ...props.glRendererProps })

  return renderer
}

const applyRendererProps = (renderer) => {
  renderer.setClearColor(new Color('brown'), 0)
  renderer.setSize(400, 400)
}

const applyRendererStyles = (renderer, styles) => {
  Object.assign(renderer.domElement.style, styles)
}

export {
  initialiseGlRenderer,
  applyRendererProps,
  applyRendererStyles
}