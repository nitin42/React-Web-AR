import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { markerPropTypes } from '../../props'

// Renders an object under a marker with a preset or a patternUrl
export default class Marker extends Component {
	static propTypes = markerPropTypes()

	static defaultProps = {
		// Use AR.js defaults (arjs component already has a mapping to default parameters), 
		parameters: {}
	}

	static contextTypes = {
		inherent: PropTypes.bool,
	}

  // Render using a custom marker
	shouldUseCustomMarker = markerProps => {
		if (markerProps !== undefined && markerProps.preset === 'custom') {
			markerProps.url = markerProps.patternUrl
			// We don't need patternUrl anymore when dealing with custom markers, so goodbye!
			delete markerProps.patternUrl
			return markerProps
		}
  }
  
	renderUsingMatrixMode = props => {
		// Check if the component is using a custom marker
		this.shouldUseCustomMarker(props.parameters)

		// Track the marker movement and use modelViewMatrix
		if (this.context.inherent) {
			return <a-marker {...props.parameters}>{props.children}</a-marker>
		} else {
			// Track the movement of the camera and use cameraTransformMatrix
			// Uses cameraTransformMatrix as matrix mode for tracking the movement of the camera instead of the object
			return <a-marker-camera {...props.parameters}>{props.children}</a-marker-camera>
		}
	}

	render() {
		return this.renderUsingMatrixMode(this.props)
	}
}
