<script setup>
import { onMounted } from "vue";
import { Viewer } from "cesium";
onMounted(() => {
  const viewer = new Viewer("cesiumContainer");
});
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style>
#cesiumContainer {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>