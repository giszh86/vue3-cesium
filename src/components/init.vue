<template>
  <div id="cesiumContainer"></div>
</template>

<script setup lang="ts">
import CesiumNavigation from "cesium-navigation-es6";
import { onMounted } from "vue";
import {
  Viewer,
  Rectangle,
  DataSource,
  HorizontalOrigin,
  VerticalOrigin,
  DistanceDisplayCondition,
  Ellipsoid,
  BoundingSphere,
  JulianDate,
  Color,
  defined,
  ClassificationType,
  ColorMaterialProperty,
  Entity,
  PolygonGraphics,
  Cartesian3,
  LabelGraphics,
  ModelGraphics,
  VelocityOrientationProperty,
  HermitePolynomialApproximation,
} from "cesium";
import { useStore } from "vuex";
import { globalStoreKey } from "../store";
import { useActions } from "vuex-composition-helpers";
import createImageryProvider from "../mapconfig/addlayer/createImageryProvider";
import addTerrain from "../mapconfig/addTerrain/addTerrain";
import Camera from "../mapconfig/camera/camera";
import CesiumWallBillboard from "../mapconfig/cesiumWallBillboard/cesiumWallBillboard";
import CDataSource from "../mapconfig/dataSource/dataSource";

// 通过key拿到特定的store
const store = useStore(globalStoreKey);

onMounted(() => {
  let viewer = new Viewer("cesiumContainer", {
    animation: true,
    shouldAnimate: true,
    baseLayerPicker: false,
    fullscreenButton: false,
    vrButton: false,
    homeButton: false,
    selectionIndicator: false, // * 点击后地图上显示的选择控件
    infoBox: false, // * 右上角鼠标点击后信息展示框
    sceneModePicker: false, // * 右上角2D和3D之间的切换
    timeline: false, // * 页面下方的时间条
    navigationHelpButton: false, // * 右上角帮助按钮
    navigationInstructionsInitiallyVisible: false, // * 是否展开帮助
    scene3DOnly: true, // * 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
    useDefaultRenderLoop: true, // * 控制渲染循环
    showRenderLoopErrors: false, // * HTML面板中显示错误信息
    useBrowserRecommendedResolution: true, // * 如果为true，则以浏览器建议的分辨率渲染并忽略window.devicePixelRatio
    automaticallyTrackDataSourceClocks: true, // * 自动追踪最近添加的数据源的时钟设置
    orderIndependentTranslucency: true, // * 如果为true并且配置支持它，则使用顺序无关的半透明性
    shadows: false, // * 阴影效果
    projectionPicker: false, // * 透视投影和正投影之间切换
    requestRenderMode: true, // * 在指定情况下进行渲染,提高性能
    imageryProvider: createImageryProvider("bing", "https://dev.virtualearth.net", {
      key: "AmXdbd8UeUJtaRSn7yVwyXgQlBBUqliLbHpgn2c76DfuHwAXfRrgS5qwfHU6Rhm8",
    }),
    terrainProvider: addTerrain("ionTerrain", "", {}),
  });

  // 这里的 useActions 类似之前vuex的mapActions
  const { updateFakeName } = useActions(store, ["updateFakeName"]);

  updateFakeName(viewer);

  // * 隐藏版权信息
  let creditContainer = <HTMLElement>viewer.cesiumWidget.creditContainer;
  creditContainer.style.display = "none";

  interface CesiumNavigationOptions {
    defaultResetView: Rectangle; // * 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
    enableCompass: boolean; // * 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    enableZoomControls: boolean; // * 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
    enableDistanceLegend: boolean; // * 用于启用或禁用比例尺。true是启用，false是禁用。默认值为true。如果将选项设置为false，比例尺将不会添加到地图中。
    enableCompassOuterRing: boolean; // * 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  }
  var options: CesiumNavigationOptions = {
    defaultResetView: Rectangle.fromDegrees(80, 22, 130, 50),
    enableCompass: true,
    enableZoomControls: false,
    enableDistanceLegend: false,
    enableCompassOuterRing: true,
  };

  new CesiumNavigation(viewer, options);

  let camera = new Camera(viewer);
  camera.flyTo({
    destination: [118.05741, 24.630362, 150.0],
    orientation: {
      heading: 175.0,
      pitch: -35.0,
      roll: 0.0,
      up: [],
    },
    duration: 5,
  });

  let dataSource = new CDataSource(
    viewer,
    "czml",
    "http://localhost:8091/SampleData/simple.czml"
  );
  let dS = dataSource._Init({});
  dS.then((res: DataSource) => {
    viewer.dataSources.add(res);
    let drone = res.entities.getById("Satellite/ISS");
    // * 替换glb
    if (drone && drone.position) {
      drone.model = new ModelGraphics({
        uri: "http://localhost:8091/SampleData/models/CesiumDrone/CesiumDrone.glb",
        minimumPixelSize: 128, // * 最小像素大小
        maximumScale: 1000, // * 最大比例尺寸
        silhouetteColor: Color.WHITE, // * 轮廓颜色
        silhouetteSize: 3, // * 轮廓大小
      });
      // * 计算并设置模型方向
      drone.orientation = new VelocityOrientationProperty(drone.position);
      // * 位置插值使运动平滑
      // drone.position.setInterpolationOptions({
      //   interpolationDegree: 3,
      //   interpolationAlgorithm: HermitePolynomialApproximation, // * 插值算法
      // });
    }
  });
});
</script>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
