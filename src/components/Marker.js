import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { markerPropTypes } from '../props'

// Renders an object under a marker with a preset or a patternUrl
export default class Marker extends Component {
  static propTypes = markerPropTypes()

  static contextTypes = {
    inherent: PropTypes.bool
  }

  useCustomMarker = (markerProps) => {
    if (markerProps.preset === 'custom') {
      markerProps.url = markerProps.patternUrl
      // We don't need patternUrl anymore when dealing with custom markers
      delete markerProps.patternUrl
      return markerProps
    }
  }

  renderWithMatrix = (props) => {
    this.useCustomMarker(props.parameters)

    if (this.context.inherent) {
      return this.modelViewMatrix(props)
    }

    return this.cameraTransformMatrix(props)
  }

  // Track the marker movement and use modelViewMatrix
  modelViewMatrix = (props) => {
    return (
      <a-marker {...props.parameters}>
        {props.children}
      </a-marker>
    )
  }

  // Track the movement of the camera and use cameraTransformMatrix
  cameraTransformMatrix = (props) => {
    // Uses cameraTransformMatrix as matrix mode for tracking the movement of the camera instead of the object
    return (
      <a-marker-camera {...props.parameters}>
        {props.children}
      </a-marker-camera>
    )
  }

  render() {
    return this.renderWithMatrix(this.props)
  }
}