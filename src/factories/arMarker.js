function initialiseMarker(arContext, camera, props) {
  return new window.THREEx.ArMarkerControls(arContext, camera, props);
}

export default initialiseMarker;
