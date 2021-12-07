<template>
  <div id="cesiumContainer"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { Viewer } from "cesium";
onMounted(() => {
  window.viewer = new Viewer("cesiumContainer");
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