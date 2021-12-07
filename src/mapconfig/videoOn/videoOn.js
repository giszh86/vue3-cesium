const Cesium = require("cesium/Cesium");

function VideoOn(west, south, east, north) {
  const videoElement = document.getElementById("myVideo");
  let rectangle = window.viewer.entities.add({
    rectangle: {
      coordinates: Cesium.Rectangle.fromDegrees(west, south, east, north),
      material: videoElement
    }
  });

  videoElement.style.display = "none";

  new Cesium.VideoSynchronizer({
    clock: window.viewer.clock,
    element: videoElement
  });
  window.viewer.clock.shouldAnimate = true;

  return rectangle;
}

export default VideoOn;
