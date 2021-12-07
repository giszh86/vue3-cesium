const Cesium = require("cesium/Cesium");

export default class SubmergenceAnalysis {
  constructor(viewer, height_max, height_min, step, positionsArr, speed) {
    this.viewer = viewer;
    this.polygonEntities = null;
    this.extrudedHeight = height_min;
    this.height_max = height_max;
    this.height_min = height_min;
    this.step = step;
    this.polygon_degrees = positionsArr;
    this.speed = speed;
    this._addDisListener();
  }

  _addDisListener() {
    this._drawPoly(this.polygon_degrees);
  }

  _drawPoly(degrees) {
    const that = this;
    this.polygonEntities = this.viewer.entities.add({
      polygon: {
        hierarchy: {},
        material: new Cesium.Color.fromBytes(64, 157, 253, 100),
        perPositionHeight: true
      }
    });
    this.polygonEntities.polygon.hierarchy = new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray(degrees)
    );
    this.polygonEntities.polygon.extrudedHeight = new Cesium.CallbackProperty(
      () => that.extrudedHeight,
      false
    );
  }

  start() {
    const that = this;
    this.timer = window.setInterval(() => {
      if (
        that.height_max > that.extrudedHeight &&
        that.extrudedHeight >= that.height_min
      ) {
        that.extrudedHeight = that.extrudedHeight + that.step;
      } else {
        that.extrudedHeight = that.height_min;
      }
    }, that.speed * 1000);
    that._drawPoly(that.polygon_degrees);
  }
  clear() {
    let viewer = this.viewer;
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.extrudedHeight = this.height_min;
    viewer.entities.remove(this.polygonEntities);
  }
  changeMapType(type) {
    if (!type) {
      this.polygonEntities.show = false;
    } else {
      this.polygonEntities.show = true;
    }
  }

  // 切割一部分地形
  loadGrandCanyon() {
    var globe = this.viewer.scene.globe;
    const viewer = this.viewer;
    // viewer.skyAtmosphere = false,
    // Pick a position at the Grand Canyon
    var position = Cesium.Cartographic.toCartesian(
      new Cesium.Cartographic.fromDegrees(115.9165534, 40.0139345, 100)
    );
    var distance = 30000.0;
    var boundingSphere = new Cesium.BoundingSphere(position, distance);

    globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
      modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
      planes: [
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(1.0, 0.0, 0.0),
          distance
        ),
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(-1.0, 0.0, 0.0),
          distance
        ),
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(0.0, 1.0, 0.0),
          distance
        ),
        new Cesium.ClippingPlane(
          new Cesium.Cartesian3(0.0, -1.0, 0.0),
          distance
        )
      ],
      unionClippingRegions: true
    });
    globe.clippingPlanes.enabled = true;
    viewer.camera.viewBoundingSphere(
      boundingSphere,
      new Cesium.HeadingPitchRange(0.5, -0.5, boundingSphere.radius * 5.0)
    );
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
  }
}
