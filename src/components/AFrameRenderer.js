import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { setARToolKitParameters } from '../core/react-ar-aframe/ARToolKitParameters'
import { toolKitProps, toolKitDefaultProps } from '../props'

// Renders the aframe primitives
// May also render the custom aframe primitive registered by AR.js like portals
export default class AFrameRenderer extends Component {
  static propTypes = toolKitProps()

  static defaultProps = toolKitDefaultProps()

  setMarker = props => {
    // Uses cameraTransformMatrix as matrix mode for tracking the movement of the camera instead of the object
    // Although I think <a-marker> primitive is not that useful but it may be added in future release
    const { preset, ...rest } = props.marker

    return <a-marker-camera preset={preset} {...rest} />
  }

  // We need to render the <a-scene> next to the body tag and not in the parent container because
  // arjs adds the image outside the parent container and the tracking module thus cannot the track the position
  // of the marker lying outside its context

  // Alternate will be to change this behavior in arjs's aframe fork but its not convenient at all because it may break their internals

  renderInsideTheAFrameContext = props =>
    ReactDOM.createPortal(
      <a-scene embedded arjs={setARToolKitParameters(props.arToolKit)}>
        {props.children}
        {this.setMarker(props)}
      </a-scene>,
      document.body
    )

  render() {
    return this.renderInsideTheAFrameContext(this.props)
  }
}

// More to explore

// <a-anchor>

// <a-static-camera>

// <a-portals>

// Stablise the api for AFrameRenderer component

// Update the docs (add usage, api, installation and description)
