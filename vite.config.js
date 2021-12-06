// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// 新增
import cesium from "vite-plugin-cesium";

// https://vitejs.dev/config/
export default defineConfig({
  // 新增
  plugins: [vue(), cesium()],
});
