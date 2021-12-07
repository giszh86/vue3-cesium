const Cesium = require("cesium/Cesium");
import { GlobeTooltip } from "@/mapconfig/measure/GlobeTooltip";
import circle_red from "@/assets/circle_red.png";
import Vue from "vue";

let layerId = "visibilityLayer";
let handler,
  floatingPoint,
  material = null,
  entity,
  tooltip;
let positions = [];

// * tooltip提示框
Vue.nextTick(() => {
  tooltip = new GlobeTooltip(window.viewer.container);
  tooltip.setVisible(false);
});

function VisibilityAnalysis() {
  handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);

  // * 监测鼠标左击事件
  handler.setInputAction(event => {
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
      floatingPoint = createPoint(cartesian);
      showPolyline2Map();
      positions.push(cartesian);
      createPoint(cartesian);
    } else {
      positions.push(cartesian);
      createPoint(cartesian);
      Vue.nextTick(() => {
        tooltip.setVisible(false);
      });

      window.viewer.entities.remove(floatingPoint);
      handler.destroy();
      handler = null;
      analysisVisible(positions);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // * 监测鼠标移动事件
  handler.setInputAction(event => {
    let position = event.endPosition;
    if (!Cesium.defined(position)) return;

    if (positions.length < 1) {
      Vue.nextTick(() => {
        tooltip.showAt(position, "<p>选择起点</p>");
      });
      return;
    }

    let tip = "<p>点击添加下一个点</p>";

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
}

// * 进行通视分析
function analysisVisible(positions) {
  window.viewer.entities.remove(entity);
  // 计算射线的方向
  let direction = Cesium.Cartesian3.normalize(
    Cesium.Cartesian3.subtract(
      positions[1],
      positions[0],
      new Cesium.Cartesian3()
    ),
    new Cesium.Cartesian3()
  );
  // 建立射线
  let ray = new Cesium.Ray(positions[0], direction);
  let result = window.viewer.scene.globe.pick(ray, window.viewer.scene); // 计算交互点，返回第一个

  if (result !== undefined && result !== null) {
    drawLine(result, positions[0], Cesium.Color.GREEN); // 可视区域
    drawLine(result, positions[1], Cesium.Color.RED); // 不可视区域
  } else {
    drawLine(positions[0], positions[1], Cesium.Color.GREEN);
  }
}

// * 绘制线
function drawLine(leftPoint, secPoint, color) {
  window.viewer.entities.add({
    polyline: {
      positions: [leftPoint, secPoint],
      width: 1,
      material: color,
      depthFailMaterial: color
    }
  });
}

// * 创建点实体
function createPoint(cartesian) {
  let point = window.viewer.entities.add({
    position: cartesian,
    billboard: {
      image: circle_red,
      heightReference: Cesium.HeightReference.NONE
    }
  });
  point.layerId = layerId;
  return point;
}

function showPolyline2Map() {
  if (material === null)
    material = new Cesium.PolylineGlowMaterialProperty({
      color: Cesium.Color.BLUE.withAlpha(0.5)
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

// * 清除所有相关的监测事件以及markers
function clear() {
  if (handler) {
    handler.destroy();
    handler = null;
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

export { VisibilityAnalysis, clear, analysisVisible };
