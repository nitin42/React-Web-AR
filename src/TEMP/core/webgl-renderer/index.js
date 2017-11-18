import { WebGl, Color } from '../../constructors/ThreeJSConstructors'

export const initialiseGlRenderer = (props) => {
  const renderer = new WebGl({ ...props.glRendererProps })

  return renderer
}

export const applyRendererProps = (renderer) => {
  renderer.setClearColor(new Color('brown'), 0)
  renderer.setSize(400, 400)
}

export const applyRendererStyles = (renderer, styles) => {
  Object.assign(renderer.domElement.style, styles)
}
