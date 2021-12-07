const Cesium = require("cesium/Cesium");

let listenerEvt = null;

export function popFun(cartesain) {
  let cartographic = window.viewer.scene.globe.ellipsoid.cartesianToCartographic(
    cartesain
  );
  let height = window.viewer.scene.globe.getHeight(cartographic);

  let newCartesain = Cesium.Cartesian3.fromRadians(
    cartographic.longitude,
    cartographic.latitude,
    height
  );

  if (listenerEvt) {
    window.viewer.scene.postRender.removeEventListener(listenerEvt);
    listenerEvt = null;
  }

  let coordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    window.viewer.scene,
    newCartesain
  );
  let infoDiv = document.getElementsByClassName("infoBox");

  positionPopUp(coordinates, infoDiv);

  listenerEvt = function() {
    let new_cartesain = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      window.viewer.scene.globe.getHeight(cartographic)
    );
    let changeCoordinates = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      window.viewer.scene,
      new_cartesain
    );
    if (
      coordinates &&
      changeCoordinates &&
      coordinates.x &&
      changeCoordinates.x &&
      coordinates.y &&
      changeCoordinates.y
    ) {
      if (
        coordinates.x !== changeCoordinates.x ||
        coordinates.y !== changeCoordinates.y
      ) {
        positionPopUp(changeCoordinates, infoDiv);
        coordinates = changeCoordinates;
      }
    }
  };

  window.viewer.scene.postRender.addEventListener(listenerEvt);
}

function positionPopUp(coordinates, infoDiv) {
  if (infoDiv[0]) {
    let x = coordinates.x - infoDiv[0].offsetWidth / 2;
    let y = coordinates.y - infoDiv[0].offsetHeight - 65;
    infoDiv[0].style.left = x + "px";
    infoDiv[0].style.top = y + "px";
  }
}
