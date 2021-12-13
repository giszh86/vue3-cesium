const Cesium = require("cesium/Cesium");

function dataSource(type, url, options = {}) {
  let dataSource = null;
  switch (type) {
    case "customDataSource":
      dataSource = new Cesium.CustomDataSource(url);
      break;
    case "kmlDataSource":
      dataSource = new Cesium.KmlDataSource.load(url, {
        camera: window.viewer.scene.camera,
        canvas: window.viewer.scene.canvas,
        clampToGround: options.clampToGround || false
      });
      break;
    case "json": // * 可以加载geojson或者topojson
      dataSource = new Cesium.GeoJsonDataSource.load(url, {
        clampToGround: options.clampToGround || false
      });
      break;
    case "czml":
      dataSource = new Cesium.CzmlDataSource.load(url);
      break;
    default:
      break;
  }
  return dataSource;
}

export default dataSource;
