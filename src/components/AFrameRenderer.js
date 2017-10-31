import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { setARToolKitParameters } from '../core/react-ar-aframe/ARToolKitParameters'
import { toolKitProps, toolKitDefaultProps } from '../props'

// Renders the aframe primitives
// May also render the custom aframe primitive registered by AR.js like portals
export default class AFrameRenderer extends Component {
  container = document.body

  static propTypes = toolKitProps()

  static defaultProps = toolKitDefaultProps()
  
  static childContextTypes = {
    inherent: PropTypes.bool
  }

  getChildContext() {
    return {
      inherent: this.props.inherent
    }
  }

  passSceneRef = (props, ref) => props.getSceneRef(ref)

  // We need to render the <a-scene> next to the body tag and not in the parent container because
  // arjs adds the image outside the parent container and the tracking module thus cannot the track the position
  // of the marker lying outside its context

  // Alternate will be to change this behavior in arjs's aframe fork but its not convenient at all because it may break their internals

  renderVirtualComponentInsideTheAFrameContext = component =>
    ReactDOM.createPortal(component, this.container)

  flush = props => {
    const { arToolKit, children, ...rest } = props
    
    const component = (
      <a-scene
        // Forward the scene reference as it is useful in VR enter and exit events
        // where this ref node can be use to add or remove content
        ref={sceneRef => this.passSceneRef(props, sceneRef)}
        // Remove full screen props from the canvas
        embedded
        // Custom component registered by arjs
        arjs={setARToolKitParameters(arToolKit)}
        // Inject the rest of the component props
        {...rest}
      >
        {this.props.children}
        {props.inherent ? <a-entity camera></a-entity> : null}
      </a-scene>
    )

    return this.renderVirtualComponentInsideTheAFrameContext(component)
  }

  render() {
    return this.flush(this.props)
  }
}
