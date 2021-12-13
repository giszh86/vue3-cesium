const Cesium = require("cesium/Cesium");
const turf = require("@turf/turf");
import { GlobeTooltip } from "./GlobeTooltip";
import circle_red from "@/assets/circle_red.png";
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
    createPoint(tempPositions[i], i);
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
      if (entity.flag != "anchor") return;

      pickedAnchor = entity;
      isMovig = true;
      if (entity.flag === "anchor") {
        Vue.nextTick(() => {
          tooltip.showAt(position, "<p>移动控制点</p>");
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
    pickedAnchor.position.setValue(cartesian);
    tempPositions[oid] = cartesian;
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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
  tempPositions = [].concat(pnts);
}

// * 判断两个点是否为相同点
function _isSimpleXYZ(p1, p2) {
  if (p1.x === p2.x && p1.y === p2.y && p1.z === p2.z) {
    return true;
  }
  return false;
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
    let groundArea = turf.area(polygonGeoJson);

    resolve(parseFloat(groundArea).toFixed(3));
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
