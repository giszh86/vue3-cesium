// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
// 新增
import cesium from "vite-plugin-cesium";

function pathResolve(dir) {
  return resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  // 新增
  plugins: [vue(), cesium()],
  resolve: {
    alias: {
      "@": pathResolve("src"),
    }
  },
  server: {
    host: 'localhost',
    port: 8519,
    open: true,
    strictPort: false,
    https: false,
  },
});
