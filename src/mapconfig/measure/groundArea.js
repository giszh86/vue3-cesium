const Cesium = require("cesium/Cesium");
const turf = require("@turf/turf");
import { GlobeTooltip } from "./GlobeTooltip";
import circle_red from "@/assets/circle_red.png";
import circle_gray from "@/assets/circle_gray.png";
import Vue from "vue";

let layerId = "arealayer",
  tooltip = null,
  positions = [],
  tempPositions = [],
  drawHandler = null,
  material = null,
  outlineMaterial = null,
  markers = {},
  modifyHandler = null,
  entityPoint = null;

Vue.nextTick(() => {
  tooltip = new GlobeTooltip(window.viewer.container);
  tooltip.setVisible(false);
});

// * 开始绘制贴地面
function startDrawGroundPolygon() {
  areaGroundClear();
  positions = [];
  let floatingPoint = null;

  drawHandler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);

  // * 捕获鼠标左击事件
  drawHandler.setInputAction(event => {
    let position = event.position;
    if (!Cesium.defined(position)) return;

    let ray = window.viewer.camera.getPickRay(position);
    if (!Cesium.defined(ray)) return;

    let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    if (!Cesium.defined(cartesian)) return;

    let num = positions.length;
    if (num === 0) {
      // * 这里是创建一个跟随鼠标实时移动的点去绘制面
      positions.push(cartesian);
      floatingPoint = createPoint(cartesian, -1);
      _showRegion2Map();
    }
    positions.push(cartesian);
    let oid = positions.length - 2;
    createPoint(cartesian, oid);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // * 捕获鼠标移动事件
  drawHandler.setInputAction(event => {
    let position = event.endPosition;
    if (!Cesium.defined(position)) return;
    if (positions.length < 1) {
      Vue.nextTick(() => {
        tooltip.showAt(position, "<p>请选择起点</p>");
      });
      return;
    }

    let num = positions.length;
    let tip = "";
    tip = tip.replace("\n", "<br/>");
    tip += "<p>点击添加下一个点</p>";
    if (num > 3) {
      tip += "<p>点击右键结束绘制</p>";
    }
    Vue.nextTick(() => {
      tooltip.showAt(position, tip);
    });

    let ray = window.viewer.camera.getPickRay(position);
    if (!Cesium.defined(ray)) return;

    let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    if (!Cesium.defined(cartesian)) return;

    floatingPoint.position.setValue(cartesian);
    positions.pop();
    positions.push(cartesian);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // * 捕获鼠标右击事件
  drawHandler.setInputAction(() => {
    if (positions.length < 4) return;
    // * 删除浮动点
    positions.pop();
    window.viewer.entities.remove(floatingPoint);

    Vue.nextTick(() => {
      tooltip.setVisible(false);
    });

    areaGroundClear();

    // * 多边形进入编辑状态
    _showModifyRegion2Map();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// * 清除及销毁所有相关工具
function areaGroundClear() {
  if (drawHandler) {
    drawHandler.destroy();
    drawHandler = null;
  }
  if (modifyHandler) {
    modifyHandler.destroy();
    modifyHandler = null;
  }

  _clearMarker(layerId);
  Vue.nextTick(() => {
    tooltip.setVisible(false);
  });
}

// * 创建点实体
function createPoint(cartesian, oid) {
  let point = window.viewer.entities.add({
    position: cartesian,
    billboard: {
      image: circle_red,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  point.oid = oid;
  point.layerId = layerId;
  point.flag = "anchor";
  markers[oid] = point;
  return point;
}

// * 创建面以及线实体
function _showRegion2Map() {
  if (material === null) material = Cesium.Color.YELLOW.withAlpha(0.5);

  if (outlineMaterial === null)
    outlineMaterial = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.BLUE.withAlpha(0.7)
    });

  let dynamicHierarchy = new Cesium.CallbackProperty(() => {
    if (positions.length > 2) {
      // * 创建多边形环形结构
      let pHierarchy = new Cesium.PolygonHierarchy(positions);
      return pHierarchy;
    } else {
      return null;
    }
  }, false);

  let outlineDynamicPositions = new Cesium.CallbackProperty(() => {
    if (positions.length > 1) {
      // * 获取所有点并将第一个点填充到数组中形成闭环
      let arr = [].concat(positions);
      let first = positions[0];
      arr.push(first);
      return arr;
    } else {
      return null;
    }
  }, false);

  let num = positions.length;
  let last = positions[num - 1];
  // * 创建面以及面的边界
  let bData = {
    position: last,
    polygon: new Cesium.PolygonGraphics({
      hierarchy: dynamicHierarchy,
      material: material,
      show: true
    }),
    polyline: {
      positions: outlineDynamicPositions,
      clampToGround: true,
      width: 2.0,
      material: outlineMaterial,
      show: true
    }
  };

  entityPoint = window.viewer.entities.add(bData);
  entityPoint.layerId = layerId;
}

// * 对已创建的面进行编辑监测
function _showModifyRegion2Map() {
  _startModify();
  _computeTempPositions();

  let dynamicHierarchy = new Cesium.CallbackProperty(() => {
    if (positions.length > 2) {
      // * 创建多边形环形结构
      let pHierarchy = new Cesium.PolygonHierarchy(tempPositions);
      return pHierarchy;
    } else {
      return null;
    }
  }, false);

  let outlineDynamicPositions = new Cesium.CallbackProperty(() => {
    if (tempPositions.length > 1) {
      // * 获取所有点并将第一个点填充到数组中形成闭环
      let arr = [].concat(tempPositions);
      let first = tempPositions[0];
      arr.push(first);
      return arr;
    } else {
      return null;
    }
  }, false);

  if (material === null) material = Cesium.Color.YELLOW.withAlpha(0.5);

  if (outlineMaterial === null)
    outlineMaterial = new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.BLUE.withAlpha(0.7)
    });

  let num = tempPositions.length;
  let last = tempPositions[num - 1];
  // * 创建面以及面的边界
  let bData = {
    position: last,
    polygon: new Cesium.PolygonGraphics({
      hierarchy: dynamicHierarchy,
      material: material,
      show: true
    }),
    polyline: {
      positions: outlineDynamicPositions,
      clampToGround: true,
      width: 2.0,
      material: outlineMaterial,
      show: true
    }
  };

  entityPoint = window.viewer.entities.add(bData);
  entityPoint.layerId = layerId;

  for (let i = 0; i < tempPositions.length; i++) {
    let ys = i % 2;
    if (ys === 0) {
      createPoint(tempPositions[i], i);
    } else {
      _createMidPoint(tempPositions[i], i);
    }
  }
  _getMeasureTip(tempPositions).then(data => {
    entityPoint.label = {
      text: data,
      font: '16px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
      fillColor: Cesium.Color.RED,
      outlineColor: Cesium.Color.SKYBLUE,
      outlineWidth: 1,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -15)
    };
  });
}

// * 开启交互
function _startModify() {
  let isMovig = false,
    pickedAnchor = null;
  if (drawHandler) {
    drawHandler.destroy();
    drawHandler = null;
  }

  // * 创建交互监测
  modifyHandler = new Cesium.ScreenSpaceEventHandler(
    window.viewer.scene.canvas
  );

  // * 监测鼠标左击事件
  modifyHandler.setInputAction(event => {
    let position = event.position;
    if (!Cesium.defined(position)) return;

    let ray = window.viewer.camera.getPickRay(position);
    if (!Cesium.defined(ray)) return;

    let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    if (!Cesium.defined(cartesian)) return;

    if (isMovig) {
      isMovig = false;
      pickedAnchor.position.setValue(cartesian);
      let oid = pickedAnchor.oid;
      tempPositions[oid] = cartesian;
      Vue.nextTick(() => {
        tooltip.setVisible(false);
      });
      if (pickedAnchor.flag === "mid_anchor") _updateModifyAnchors(oid);

      entityPoint.position.setValue(cartesian);

      _getMeasureTip(tempPositions).then(data => {
        entityPoint.label = {
          text: data,
          font: '16px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
          fillColor: Cesium.Color.RED,
          outlineColor: Cesium.Color.SKYBLUE,
          outlineWidth: 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -15)
        };
      });
    } else {
      let pickedObject = window.viewer.scene.pick(position);
      if (!Cesium.defined(pickedObject)) return;
      if (!Cesium.defined(pickedObject.id)) return;

      let entity = pickedObject.id;
      if (entity.layerId != layerId) return;
      if (entity.flag != "anchor" && entity.flag != "mid_anchor") return;

      pickedAnchor = entity;
      isMovig = true;
      if (entity.flag === "anchor") {
        Vue.nextTick(() => {
          tooltip.showAt(position, "<p>移动控制点</p>");
        });
      } else if (entity.flag === "mid_anchor") {
        Vue.nextTick(() => {
          tooltip.showAt(position, "<p>移动创建新的控制点</p>");
        });
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  modifyHandler.setInputAction(event => {
    if (!isMovig) return;

    let position = event.endPosition;
    if (!Cesium.defined(position)) return;

    Vue.nextTick(() => {
      tooltip.showAt(position, "<p>移动控制点</p>");
    });

    let ray = window.viewer.camera.getPickRay(position);
    if (!Cesium.defined(ray)) return;

    let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    if (!Cesium.defined(cartesian)) return;

    let oid = pickedAnchor.oid;
    if (pickedAnchor.flag === "anchor") {
      pickedAnchor.position.setValue(cartesian);
      tempPositions[oid] = cartesian;

      // * 实时更新左右两个中心点
      _updateNewMidAnchors(oid);
    } else if (pickedAnchor.flag === "mid_anchor") {
      pickedAnchor.position.setValue(cartesian);
      tempPositions[oid] = cartesian;
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

// * 计算选中点的两个中间点
function _updateModifyAnchors(oid) {
  let p = tempPositions[oid],
    p1 = null,
    p2 = null,
    num = tempPositions.length;
  if (oid === 0) {
    p1 = tempPositions[num - 1];
    p2 = tempPositions[oid + 1];
  } else if (oid === num - 1) {
    p1 = tempPositions[oid - 1];
    p2 = tempPositions[0];
  } else {
    p1 = tempPositions[oid - 1];
    p2 = tempPositions[oid + 1];
  }

  // * 计算选中点与相临两点的中间点
  let cp1 = _computeCenterPotition(p1, p);
  let cp2 = _computeCenterPotition(p, p2);

  // * 将点插入到点集中
  tempPositions.splice(oid, 1, cp1, p, cp2);

  // * 重新加载点
  _clearAnchors();

  for (let i = 0; i < tempPositions.length; i++) {
    let ys = i % 2;

    // * 能被2整除的为端点,不能整除的为两个端点之间的中点
    if (ys === 0) {
      createPoint(tempPositions[i], i);
    } else {
      _createMidPoint(tempPositions[i], i);
    }
  }
}

// * 计算两点中心点
function _computeCenterPotition(p1, p2) {
  let c1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p1);
  let c2 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(p2);
  let cm = new Cesium.EllipsoidGeodesic(c1, c2).interpolateUsingFraction(0.5);
  let cp = Cesium.Ellipsoid.WGS84.cartographicToCartesian(cm);
  return cp;
}

// * 计算所有需要显示的点
function _computeTempPositions() {
  let pnts = [].concat(positions);
  let num = pnts.length;
  let first = pnts[0];
  let last = pnts[num - 1];
  if (_isSimpleXYZ(first, last) === false) {
    pnts.push(first);
    num += 1;
  }
  tempPositions = [];
  for (let i = 1; i < num; i++) {
    let p1 = pnts[i - 1];
    let p2 = pnts[i];
    let cp = _computeCenterPotition(p1, p2);
    tempPositions.push(p1);
    tempPositions.push(cp);
  }
}

// * 判断两个点是否为相同点
function _isSimpleXYZ(p1, p2) {
  if (p1.x === p2.x && p1.y === p2.y && p1.z === p2.z) {
    return true;
  }
  return false;
}

// * 清除所有的点
function _clearAnchors() {
  for (let item in markers) {
    let m = markers[item];
    window.viewer.entities.remove(m);
  }
  markers = {};
}

// * 创建中点实体
function _createMidPoint(cartesian, oid) {
  let point = window.viewer.entities.add({
    position: cartesian,
    billboard: {
      image: circle_gray,
      eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  });
  point.oid = oid;
  point.layerId = layerId;
  point.flag = "mid_anchor";
  markers[oid] = point;
  return point;
}

// * 获取面积并返回
function _getMeasureTip(pntList) {
  return new Promise(resolve => {
    computedGroundArea(pntList).then(res => {
      resolve(`面积：${res}平方米`);
    });
  });
}

// * 计算面积
function computedGroundArea(positionArray) {
  return new Promise(resolve => {
    if (!Cesium.defined(positionArray)) throw new Error("点数组未定义或为null");

    let polygonGeoJson = cartesian3ToGeoJson(positionArray);
    // * 将多边形转三角集
    let triangles = turf.tesselate(polygonGeoJson);

    let groundArea = 0,
      terrainProvider = new Cesium.CesiumTerrainProvider({
        url: "http://localhost:8091/jiuzhaigou"
      });

    let promiseArray = [];
    for (let triangle of triangles.features) {
      let trianglePoint = triangleInterpolationPoint(triangle);

      let allPos = [];
      for (let triPoint of trianglePoint.features) {
        allPos.push(
          Cesium.Cartographic.fromDegrees(
            triPoint.geometry.coordinates[0],
            triPoint.geometry.coordinates[1]
          )
        );
      }
      let promisePos = Cesium.sampleTerrainMostDetailed(
        terrainProvider,
        allPos
      );
      promiseArray.push(promisePos);
    }
    Promise.all(promiseArray).then(updatedPositions => {
      for (let m = 0; m < updatedPositions.length; m++) {
        let mapPos = new Map();
        for (let i = 0; i < updatedPositions[m].length; i++) {
          mapPos.set(
            updatedPositions[m][i].longitude.toString() +
              updatedPositions[m][i].latitude.toString(),
            updatedPositions[m][i].height
          );
        }
        let tin = getTin(triangleInterpolationPoint(triangles.features[m]));
        for (let j = 0; j < tin.features.length; j++) {
          let car3Array = [];
          for (let k = 0; k < 3; k++) {
            let lon = tin.features[j].geometry.coordinates[0][k][0];
            let lat = tin.features[j].geometry.coordinates[0][k][1];
            let car2g = Cesium.Cartographic.fromDegrees(lon, lat);
            let height = mapPos.get(
              car2g.longitude.toString() + car2g.latitude.toString()
            );
            car2g.height = height;
            car3Array.push(car2g);
          }
          groundArea += computed(car3Array);
        }
      }
      resolve(parseFloat(groundArea).toFixed(3));
    });
  });
}

// * 点集转多边形
function cartesian3ToGeoJson(positionArray) {
  let elliposid = Cesium.Ellipsoid.WGS84,
    lonLatArray = [];
  for (let item of positionArray) {
    let cartographic = elliposid.cartesianToCartographic(item);
    lonLatArray.push([
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude)
    ]);
  }
  lonLatArray.push(lonLatArray[0]);
  return turf.polygon([lonLatArray]);
}

// * 三角插值点
function triangleInterpolationPoint(triangle) {
  let area = turf.area(triangle);
  let cellSize = Math.sqrt(area / 1000);
  // * 通过三个点形成一个矩形
  let enveloped = turf.envelope(triangle);
  // * 获取最大及最小的xy值
  let bbox = turf.bbox(enveloped);
  // * 通过最大最小点形成矩形内插值,返回点集
  let grid = turf.pointGrid(bbox, cellSize, { units: "meters" });
  // * 获取所有落在三角形内的点
  return turf.pointsWithinPolygon(grid, triangle);
}

// * 通过点形成三角形
function getTin(trianglePoint) {
  return turf.tin(trianglePoint);
}

// * 计算三角形面积
function computed(car3Array) {
  let firstPoint2car3 = Cesium.Cartesian3.fromRadians(
    car3Array[0].longitude,
    car3Array[0].latitude,
    car3Array[0].height
  );
  let secondPoint2car3 = Cesium.Cartesian3.fromRadians(
    car3Array[1].longitude,
    car3Array[1].latitude,
    car3Array[1].height
  );
  let thirdPoint2car3 = Cesium.Cartesian3.fromRadians(
    car3Array[2].longitude,
    car3Array[2].latitude,
    car3Array[2].height
  );
  let a = Cesium.Cartesian3.distance(firstPoint2car3, secondPoint2car3);
  let b = Cesium.Cartesian3.distance(thirdPoint2car3, secondPoint2car3);
  let c = Cesium.Cartesian3.distance(firstPoint2car3, thirdPoint2car3);
  let p = (a + b + c) / 2;
  return Math.sqrt(p * (p - a) * (p - b) * (p - c));
}

// * 更新中心点
function _updateNewMidAnchors(oid) {
  if (oid === null || oid === undefined) {
    throw new Error("oid未定义或为null");
  }

  // * oid1,2为左边中间点oid3,4为右边中间点,2,3为临时中间点
  let oid1 = null,
    oid2 = null,
    oid3 = null,
    oid4 = null;
  let num = tempPositions.length;
  if (oid === 0) {
    oid1 = num - 2;
    oid2 = num - 1;
    oid3 = oid + 1;
    oid4 = oid + 2;
  } else if (oid === num - 2) {
    oid1 = oid - 2;
    oid2 = oid - 1;
    oid3 = num - 1;
    oid4 = 0;
  } else {
    oid1 = oid - 2;
    oid2 = oid - 1;
    oid3 = oid + 1;
    oid4 = oid + 2;
  }

  let c1 = tempPositions[oid1];
  let c = tempPositions[oid];
  let c4 = tempPositions[oid4];

  let c2 = _computeCenterPotition(c1, c);
  let c3 = _computeCenterPotition(c4, c);

  tempPositions[oid2] = c2;
  tempPositions[oid3] = c3;

  markers[oid2].position.setValue(c2);
  markers[oid3].position.setValue(c3);
}

// * 清除所有相关实体
function _clearMarker(layerName) {
  let entities = window.viewer.entities.values;
  if (entities === null || entities.length < 1) return;
  for (let i = 0; i < entities.length; i++) {
    let entity = entities[i];
    if (entity.layerId === layerName) {
      window.viewer.entities.remove(entity);
      i--;
    }
  }
}

export { startDrawGroundPolygon, areaGroundClear };
