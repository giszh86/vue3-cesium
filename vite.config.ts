import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cesium from 'vite-plugin-cesium';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 配置路径别名
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  server: {
    port: 8888,
    // 是否自动在浏览器打开
    open: true,
    // 是否开启 https
    https: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8888/',
        changeOrigin: true,
        rewrite: (pathStr) => pathStr.replace('/api', '')
      }
    }
  },
  plugins: [vue(), cesium()],

})
