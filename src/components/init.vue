<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import CesiumNavigation from "cesium-navigation-es6";
import { onMounted } from "vue";
import { Viewer, Rectangle } from "cesium";
import createImageryProvider from "@/mapConfig/addlayer/createImageryProvider";
import addTerrain from "@/mapconfig/addTerrain/addTerrain";

onMounted(() => {
  const viewer = new Viewer("cesiumContainer", {
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
    imageryProvider: createImageryProvider(
      "wmts",
      "http://t0.tianditu.gov.cn/img_w/wmts?tk=c0b9cb30599dd11c468c8aaa2fc1863a",
      {
        layer: "img",
        format: "image/jpeg",
        tileMatrixSetID: "w",
        maximumLevel: 18,
      }
    ),
    terrainProvider: addTerrain("ionTerrain"),
  });
  viewer._cesiumWidget._creditContainer.style.display = "none"; // * 隐藏版权信息
  var options = {};
  // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
  options.defaultResetView = Rectangle.fromDegrees(80, 22, 130, 50);
  // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
  options.enableCompass = true;
  // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
  options.enableZoomControls = false;
  // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
  options.enableDistanceLegend = false;
  // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
  options.enableCompassOuterRing = true;

  new CesiumNavigation(viewer, options);
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
