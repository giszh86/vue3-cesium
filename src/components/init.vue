<template>
  <div id="cesiumContainer"></div>
</template>

<script setup lang="ts">
import CesiumNavigation from "cesium-navigation-es6";
import { onMounted } from "vue";
import { Viewer, Rectangle } from "cesium";
import { useStore } from "vuex";
import { globalStoreKey } from "../store";
import { useActions } from "vuex-composition-helpers";
import createImageryProvider from "../mapconfig/addlayer/createImageryProvider";
import addTerrain from "../mapconfig/addTerrain/addTerrain";
import Camera from "../mapconfig/camera/camera";
import SubmergenceAnalysis from "../mapconfig/floodAnalysis/FloodAnalysis";

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

  // let camera = new Camera(viewer);
  // camera.flyTo({
  //   destination: [112.419718, 37.927023, 150.0],
  //   orientation: {
  //     heading: 175.0,
  //     pitch: -35.0,
  //     roll: 0.0,
  //     up: [],
  //   },
  //   duration: 5,
  // });

  viewer.scene.globe.depthTestAgainstTerrain = true;
  let obj = new SubmergenceAnalysis(
    viewer,
    3800,
    1000,
    1,
    [
      112.419718,
      37.927023,
      112.442443,
      37.916786,
      112.435592,
      37.904635,
      112.411082,
      37.915696,
    ],
    0.05
  );
  obj.loadGrandCanyon();
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
