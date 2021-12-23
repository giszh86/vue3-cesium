import { CallbackProperty, Cartesian3, Cartographic, Ellipsoid, Entity, ImageMaterialProperty, Viewer, Math as cesiumMath } from "cesium";

const Utils = {
  /**
   * @description: 通过中心点，角度及宽度计算广告牌的左右顶点
   * @param {{ longitude: number, latitude: number, height: number }} lonlat 中心点
   * @param {number} brng 正北顺时针角度
   * @param {number} dist 广告牌的宽度
   * @return {*}  {{ longitude: number, latitude: number, height: number }}
   */
  destinationVincenty(lonlat: { longitude: number, latitude: number, height: number }, brng: number, dist: number): { longitude: number, latitude: number, height: number } {
    let ct = {
      a: 6378137,
      b: 6356752.3142,
      f: 1 / 298.257223563
    };
    let a = ct.a,
      b = ct.b,
      f = ct.f;

    let lon1 = lonlat.longitude;
    let lat1 = lonlat.latitude;

    let s = dist;
    let alpha1 = (brng * Math.PI) / 180.0;
    let sinAlpha1 = Math.sin(alpha1);
    let cosAlpha1 = Math.cos(alpha1);

    let tanU1 = (1 - f) * Math.tan((lat1 * Math.PI) / 180.0);
    let cosU1 = 1 / Math.sqrt(1 + tanU1 * tanU1),
      sinU1 = tanU1 * cosU1;
    let sigma1 = Math.atan2(tanU1, cosAlpha1);
    let sinAlpha = cosU1 * sinAlpha1;
    let cosSqAlpha = 1 - sinAlpha * sinAlpha;
    let uSq = (cosSqAlpha * (a * a - b * b)) / (b * b);
    let A =
      1 + (uSq / 16384) * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    let B = (uSq / 1024) * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));

    let sigma = s / (b * A),
      sigmaP = 2 * Math.PI;
    let sinSigma: number = Math.sin(sigma);
    let cosSigma: number = Math.cos(sigma);
    let cos2SigmaM: number = Math.cos(2 * sigma1 + sigma);
    while (Math.abs(sigma - sigmaP) > 1e-12) {
      cos2SigmaM = Math.cos(2 * sigma1 + sigma);
      sinSigma = Math.sin(sigma);
      cosSigma = Math.cos(sigma);
      var deltaSigma =
        B *
        sinSigma *
        (cos2SigmaM +
          (B / 4) *
          (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) -
            (B / 6) *
            cos2SigmaM *
            (-3 + 4 * sinSigma * sinSigma) *
            (-3 + 4 * cos2SigmaM * cos2SigmaM)));
      sigmaP = sigma;
      sigma = s / (b * A) + deltaSigma;
    }

    var tmp = sinU1 * sinSigma - cosU1 * cosSigma * cosAlpha1;
    var lat2 = Math.atan2(
      sinU1 * cosSigma + cosU1 * sinSigma * cosAlpha1,
      (1 - f) * Math.sqrt(sinAlpha * sinAlpha + tmp * tmp)
    );
    var lambda = Math.atan2(
      sinSigma * sinAlpha1,
      cosU1 * cosSigma - sinU1 * sinSigma * cosAlpha1
    );
    var C = (f / 16) * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
    var L =
      lambda -
      (1 - C) *
      f *
      sinAlpha *
      (sigma +
        C *
        sinSigma *
        (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));

    // var revAz = Math.atan2(sinAlpha, -tmp); // final bearing

    return {
      longitude: lon1 + (L * 180) / Math.PI,
      latitude: (lat2 * 180) / Math.PI,
      height: lonlat.height
    };
  },
  /**
   * @description: 通过两个点的坐标计算角度
   * @param {number} startLat 起点纬度
   * @param {number} startLng 起点经度
   * @param {number} destLat 视点纬度
   * @param {number} destLng 视点经度
   * @return {*}  {number}
   */
  bearing(startLat: number, startLng: number, destLat: number, destLng: number): number {
    let y = Math.sin(destLng - startLng) * Math.cos(destLat);
    let x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);

    const degrees = brng % (2 * Math.PI);
    return (degrees * 180) / Math.PI;
  },
  /**
   * @description: 通过Cartesian3点计算经纬度及高度
   * @param {Cartesian3} cartesian Cartesian3点
   * @return {*} 
   */
  cartesianToLonlat(cartesian: Cartesian3): { longitude: number, latitude: number, height: number } {
    if (cartesian) {
      let cartographic = Ellipsoid.WGS84.cartesianToCartographic(
        cartesian
      );
      return {
        longitude: cesiumMath.toDegrees(cartographic.longitude),
        latitude: cesiumMath.toDegrees(cartographic.latitude),
        height: cartographic.height
      };
    }
    return {
      longitude: 0,
      latitude: 0,
      height: 0
    };
  },
  /**
   * @description: 点转弧度
   * @param {{ longitude: number, latitude: number, height: number }} point 坐标点
   * @return {*}  {{ longitude: number, latitude: number, height: number }}
   */
  lonLatToRadians(point: { longitude: number, latitude: number, height: number }): { longitude: number, latitude: number, height: number } {
    return {
      longitude: cesiumMath.toRadians(point.longitude),
      latitude: cesiumMath.toRadians(point.latitude),
      height: point.height
    };
  }
}

interface IOption {
  center?: {
    longitude: number,
    latitude: number,
    height: number,
  },
  width?: number,
  height?: number,
  rotate?: number,
  content?: string,
  viewer: Viewer
}
/**
 * @description: 信息广告牌类型
 * @class CesiumWallBillboard
 */
class CesiumWallBillboard {
  _center: {
    longitude: number,
    latitude: number,
    height: number,
  };
  _width: number;
  _height: number;
  _rotate: number;
  _content: string;
  _viewer: Viewer;
  _entities!: Entity;
  constructor(options: IOption) {
    this._center = options.center ? options.center : {
      longitude: 118.05741,
      latitude: 24.630362,
      height: 20
    };
    this._width = options.width ? options.width : 60;
    this._height = options.height ? options.height : 40;
    this._rotate = options.rotate ? options.rotate : 180.0;
    this._content = options.content ? options.content : "";
    this._viewer = options.viewer;
  }
  /**
   * @description: CesiumWallBillboard渲染
   * @memberof CesiumWallBillboard
   */
  _Init() {
    createImage(this, addEntity);
  }
}
/**
 * @description: 添加实体
 * @param {CesiumWallBillboard} t CesiumWallBillboard类型的实例
 * @param {*} image 图片
 */
function addEntity(t: CesiumWallBillboard, image: any) {
  t._entities = t._viewer.entities.add({
    wall: {
      positions: new CallbackProperty((time, result) => {
        if (result) {
          var cameraposition = Utils.cartesianToLonlat(
            t._viewer.camera.position
          );
          t._rotate = Utils.bearing(
            t._center.latitude,
            t._center.longitude,
            cameraposition.latitude,
            cameraposition.longitude
          );
        }
        let pointleft = Utils.destinationVincenty(
          t._center,
          t._rotate + 90,
          t._width / 2
        );
        let pointright = Utils.destinationVincenty(
          t._center,
          t._rotate + 180 + 90,
          t._width / 2
        );
        return Cartesian3.fromDegreesArrayHeights([
          pointleft.longitude,
          pointleft.latitude,
          pointleft.height,
          pointright.longitude,
          pointright.latitude,
          pointright.height
        ]);
      }, false),
      minimumHeights: [
        t._center.height - t._height / 2,
        t._center.height - t._height / 2
      ],
      maximumHeights: [
        t._height / 2 + t._center.height,
        t._height / 2 + t._center.height
      ],
      material: new ImageMaterialProperty({
        image: image,
        transparent: true
      })
    },
    polyline: {
      positions: Cartesian3.fromDegreesArrayHeights([
        t._center.longitude,
        t._center.latitude,
        0,
        t._center.longitude,
        t._center.latitude,
        t._center.height - t._height / 2
      ])
    }
  })
}
/**
 * @description: 创建图片
 * @param {CesiumWallBillboard} t CesiumWallBillboard类型的实例
 * @param {(t: CesiumWallBillboard, i: any) => void} callback 回调函数
 */
function createImage(t: CesiumWallBillboard, callback: (t: CesiumWallBillboard, i: any) => void) {
  let data =
    "data:image/svg+xml," +
    "<svg xmlns='http://www.w3.org/2000/svg'>" +
    "<foreignObject width='100%' height='100%'>" +
    "<div xmlns='http://www.w3.org/1999/xhtml' style='width: 100%;height: 100%;'>" +
    t._content +
    "</div>" +
    "</foreignObject>" +
    "</svg>";
  let img = new Image();
  img.src = data;

  img.onload = () => {
    // 将 svg转换成canvas
    let canvas = document.createElement("canvas"); //准备空画布
    canvas.width = img.width;
    canvas.height = img.height;
    //取得画布的2d绘图上下文
    let context: CanvasDrawImage | null = canvas.getContext("2d");
    if (context)
      context.drawImage(img, 0, 0);

    let image = canvas.toDataURL("png");

    callback(t, image);
  }
}

Object.defineProperties(CesiumWallBillboard.prototype, {
  center: {
    get: function () {
      return this._center;
    },
    set: function (e) {
      this._center = e;
    }
  },
  width: {
    get: function () {
      return this._width;
    },
    set: function (e) {
      this._width = e;
    }
  },
  height: {
    get: function () {
      return this._height;
    },
    set: function (e) {
      this._height = e;
    }
  },
  rotate: {
    get: function () {
      return this._rotate;
    },
    set: function (e) {
      this._rotate = e;
    }
  },
  viewer: {
    get: function () {
      return this._viewer;
    },
    set: function (e) {
      this._viewer = e;
    }
  },
  entities: {
    get: function () {
      return this._entities;
    }
  }
});

export default CesiumWallBillboard;