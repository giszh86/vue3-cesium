import { Viewer, BoundingSphere, CallbackProperty, Cartesian3, Cartographic, ClippingPlane, ClippingPlaneCollection, Color, HeadingPitchRange, Matrix4, PolygonHierarchy, Transforms } from "cesium";

/**
 * @description: 快速创建地形开挖以及淹没分析实例
 * @class SubmergenceAnalysis
 */
export default class SubmergenceAnalysis {
  viewer: Viewer;
  polygonEntities: any;
  extrudedHeight: number;
  height_max: number;
  height_min: number;
  step: number;
  polygon_degrees: Array<number>;
  speed: number;
  timer: any;
  /**
   * @description: 创建SubmergenceAnalysis对象
   * @param {Viewer} viewer 实例化的viewer对象
   * @param {number} height_max 高度最大值
   * @param {number} height_min 高度最小值
   * @param {number} step 每次增长多少
   * @param {Array<number>} positionsArr 淹没地区范围
   * @param {number} speed 多长时间增长一次
   * @memberof SubmergenceAnalysis
   */
  constructor(viewer:Viewer, height_max:number, height_min:number, step:number, positionsArr:Array<number>, speed:number) {
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

  /**
   * @description: 绘制淹没区域
   * @param {Array<number>} degrees 淹没区域范围
   * @memberof SubmergenceAnalysis
   */
  _drawPoly(degrees:Array<number>) {
    const that = this;
    this.polygonEntities = this.viewer.entities.add({
      polygon: {
        material: Color.fromBytes(64, 157, 253, 100),
        perPositionHeight: true
      }
    });
    this.polygonEntities.polygon.hierarchy = new PolygonHierarchy(
      Cartesian3.fromDegreesArray(degrees)
    );
    this.polygonEntities.polygon.extrudedHeight = new CallbackProperty(
      () => that.extrudedHeight,
      false
    );
  }

  /**
   * @description: 开始淹没分析
   * @memberof SubmergenceAnalysis
   */
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

  /**
   * @description: 清楚淹没分析
   * @memberof SubmergenceAnalysis
   */
  clear() {
    let viewer = this.viewer;
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    this.extrudedHeight = this.height_min;
    viewer.entities.remove(this.polygonEntities);
  }

  /**
   * @description: 改变淹没分析显示状态
   * @param {*} type true为显示，false为不显示
   * @memberof SubmergenceAnalysis
   */
  changeMapType(type: any){
    if (type) {
      this.polygonEntities.show = false;
    } else {
      this.polygonEntities.show = true;
    }
  }

  /**
   * @description: 进行地形切割
   * @memberof SubmergenceAnalysis
   */
  loadGrandCanyon() {
    var globe = this.viewer.scene.globe;
    const viewer = this.viewer;
    // viewer.skyAtmosphere = false,
    // Pick a position at the Grand Canyon
    var position = Cartographic.toCartesian(
      Cartographic.fromDegrees(115.9165534, 40.0139345, 100)
    );
    var distance = 30000.0;
    var boundingSphere = new BoundingSphere(position, distance);

    globe.clippingPlanes = new ClippingPlaneCollection({
      modelMatrix: Transforms.eastNorthUpToFixedFrame(position),
      planes: [
        new ClippingPlane(
          new Cartesian3(1.0, 0.0, 0.0),
          distance
        ),
        new ClippingPlane(
          new Cartesian3(-1.0, 0.0, 0.0),
          distance
        ),
        new ClippingPlane(
          new Cartesian3(0.0, 1.0, 0.0),
          distance
        ),
        new ClippingPlane(
          new Cartesian3(0.0, -1.0, 0.0),
          distance
        )
      ],
      unionClippingRegions: true
    });
    globe.clippingPlanes.enabled = true;
    viewer.camera.viewBoundingSphere(
      boundingSphere,
      new HeadingPitchRange(0.5, -0.5, boundingSphere.radius * 5.0)
    );
    viewer.camera.lookAtTransform(Matrix4.IDENTITY);
  }
}
