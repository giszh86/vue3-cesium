const Cesium = require("cesium/Cesium");
import { GlobeTooltip } from "./GlobeTooltip";
import circle_red from "@/assets/circle_red.png";
import Vue from "vue";

let layerId = "globeDrawerLayer",
  ellipsoid = null,
  tempPositions = [],
  entity = null,
  tooltip = null,
  positions = [],
  drawHandler = null,
  material = null,
  markers = {},
  modifyHandler = null;

// * 清除当前页面绘制的线
function ClerLine() {
  window.viewer.entities.remove(entity);
}

// * tooltip提示框
Vue.nextTick(() => {
  tooltip = new GlobeTooltip(window.viewer.container);
  tooltip.setVisible(false);
});

// * 测量线
function MeasureStickDis() {
  startDrawPolyline();
}

// * 绘制线并进行计算
function startDrawPolyline() {
  clear();
  positions = [];
  let floatingPoint = null;
  drawHandler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);

  // * 监测鼠标左击事件
  drawHandler.setInputAction(event => {
    let position = event.position;
    if (!Cesium.defined(position)) return;

    let ray = window.viewer.camera.getPickRay(position);
    if (!Cesium.defined(ray)) return;

    let cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);
    if (!Cesium.defined(cartesian)) return;

    let num = positions.length;
    if (num === 0) {
      positions.push(cartesian);
      floatingPoint = createPoint(cartesian, -1);
      showPolyline2Map();
    }
    positions.push(cartesian);
    let oid = positions - 2;
    createPoint(cartesian, oid);

    entity.position = cartesian;
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // * 监测鼠标移动事件
  drawHandler.setInputAction(event => {
    let position = event.endPosition;
    if (!Cesium.defined(position)) return;

    if (positions.length < 1) {
      Vue.nextTick(() => {
        tooltip.showAt(position, "<p>选择起点</p>");
      });
      return;
    }

    let num = positions.length;
    let tip = "<p>点击添加下一个点</p>";
    if (num > 2) {
      tip += "<p>点击鼠标右键结束绘制</p>";
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

    // entity.position.setValue(cartesian);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  // * 监测鼠标右击事件
  drawHandler.setInputAction(() => {
    if (positions.length < 3) return;
    positions.pop();
    window.viewer.entities.remove(floatingPoint);

    Vue.nextTick(() => {
      tooltip.setVisible(false);
    });

    clear();
    // * 线进入编辑状态
    showModifyPolyline2Map();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// * 创建绘制结束后的交互事件以及计算长度
function showModifyPolyline2Map() {
  startModify();
  tempPositions = [].concat(positions);

  let dynamicPositions = new Cesium.CallbackProperty(() => {
    return tempPositions;
  }, false);

  if (material === null)
    material = new Cesium.PolylineGlowMaterialProperty({
      color: Cesium.Color.BLUE.withAlpha(0.9)
    });

  let num = tempPositions.length;
  let last = tempPositions[num - 1];

  let bData = {
    position: last,
    polyline: {
      positions: dynamicPositions,
      clampToGround: false,
      width: 8,
      material: material
    }
  };

  entity = window.viewer.entities.add(bData);
  entity.layerId = layerId;
  for (let i = 0; i < tempPositions.length; i++) {
    createPoint(tempPositions[i], i);
  }
  entity.label = {
    text: CountLineLength(tempPositions),
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
}

// * 交互事件
function startModify() {
  let isMoving = false,
    pickedAnchor = null;
  if (drawHandler) {
    drawHandler.destroy();
    drawHandler = null;
  }
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

    if (isMoving) {
      isMoving = false;
      pickedAnchor.position.setValue(cartesian);
      let oid = pickedAnchor.oid;
      tempPositions[oid] = cartesian;
      Vue.nextTick(() => {
        tooltip.setVisible(false);
      });

      entity.position.setValue(tempPositions[tempPositions.length - 1]);
      entity.label = {
        text: CountLineLength(tempPositions),
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
    } else {
      let pointObject = window.viewer.scene.pick(position);
      if (!Cesium.defined(pointObject)) return;
      if (!Cesium.defined(pointObject.id)) return;

      let entity1 = pointObject.id;
      if (entity1.layerId != layerId) return;
      if (entity1.flag != "anchor") return;

      pickedAnchor = entity1;
      isMoving = true;
      Vue.nextTick(() => {
        tooltip.showAt(position, "<p>请移动控制点</p>");
      });
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  modifyHandler.setInputAction(event => {
    if (!isMoving) return;

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

    entity.position.setValue(tempPositions[tempPositions.length - 1]);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

// * 创建点
function createPoint(cartesian, oid) {
  let bData = {
    position: cartesian,
    billboard: {
      image: circle_red,
      eyeOffset: new Cesium.ConstantProperty(new Cesium.Cartesian3(0, 0, -500)),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    }
  };

  let point = window.viewer.entities.add(bData);
  point.oid = oid;
  point.layerId = layerId;
  point.flag = "anchor";
  markers[oid] = point;
  return point;
}

function showPolyline2Map() {
  if (material === null)
    material = new Cesium.PolylineGlowMaterialProperty({
      color: Cesium.Color.BLUE.withAlpha(0.9)
    });

  let dynamicPositions = new Cesium.CallbackProperty(() => {
    return positions;
  }, false);

  let num = positions.length,
    last = positions[num - 1];
  let bData = {
    position: last,
    polyline: {
      positions: dynamicPositions,
      clampToGround: false,
      width: 8,
      material: material
    }
  };

  entity = window.viewer.entities.add(bData);
  entity.layerId = layerId;
}

// * 计算
function CountLineLength(tempPositions) {
  let text = getMeasureTip(tempPositions);
  return text;
}

// * 设置tip
function getMeasureTip(tempPositions) {
  try {
    let dis3d = computeLineDIs3d(tempPositions);
    dis3d = dis3d.toFixed(3);
    let tip = `距离：${dis3d}千米`;
    return tip;
  } catch (e) {
    throw new Error("超出计算范围,请缩短距离");
  }
}

// * 计算距离
function computeLineDIs3d(tempPositions) {
  let total = 0;
  let positions = getStick2GroundLine(tempPositions);

  for (let i = 1; i < positions.length; i++) {
    let p1 = positions[i - 1];
    let p2 = positions[i];
    let dis = computeDis3d(p1, p2);
    total += dis;
  }
  return total;
}

// * 获取贴地线上面的点
function getStick2GroundLine(tempPositions) {
  let raisedPositions = [];

  for (let i = 0; i < tempPositions.length; i++) {
    let cartesian3 = getStick2GroundPoint3d(tempPositions[i]);
    raisedPositions.push(cartesian3);
  }

  return raisedPositions;
}

// * 获取高程值
function getStick2GroundPoint3d(cartesian) {
  ellipsoid = window.viewer.scene.globe.ellipsoid;
  let cartographic = ellipsoid.cartesianToCartographic(cartesian);
  cartographic.height = 0;
  let cartesian3 = ellipsoid.cartographicToCartesian(cartographic); //长度大了会报错

  return cartesian3;
}

// * 距离
function computeDis3d(p1, p2) {
  let dis = Cesium.Cartesian3.distance(p1, p2) / 1000;
  return dis;
}

// * 清除所有相关的监测事件以及markers
function clear() {
  if (drawHandler) {
    drawHandler.destroy();
    drawHandler = null;
  }
  if (modifyHandler) {
    modifyHandler.destroy();
    modifyHandler = null;
  }

  clearMarkers(layerId);
  Vue.nextTick(() => {
    tooltip.setVisible(false);
  });
}

// * 清除所有markers
function clearMarkers(layerName) {
  let entityList = window.viewer.entities.values;
  if (entityList === null || entityList.length < 1) return;
  for (let i = 0; i < entityList.length; i++) {
    let entity = entityList[i];
    if (entity.layerId === layerName) {
      window.viewer.entities.remove(entity);
      i--;
    }
  }
}

export { ClerLine, MeasureStickDis };
