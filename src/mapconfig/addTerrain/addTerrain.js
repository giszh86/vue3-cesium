import { ArcGISTiledElevationTerrainProvider, CesiumTerrainProvider, createWorldTerrain, EllipsoidTerrainProvider, GoogleEarthEnterpriseTerrainProvider, GoogleEarthEnterpriseMetadata, VRTheWorldTerrainProvider } from "cesium";

function addTerrain(type, url, options = {}) {
  let terrain = null;
  switch (type) {
    case "arcgisTerrain": // * 常用于arcgis地形服务
      terrain = new ArcGISTiledElevationTerrainProvider({
        url: url,
        token: options.token,
        hasVertexNormals: options.requestVertexNormals || false, // 请求照明
        hasWaterMask: options.requestWaterMask || false // 请求水波纹效果
      });
      break;
    case "cesiumTerrain": // * 常用于自己部署的地形服务,也是最常用的地形类型
      terrain = new CesiumTerrainProvider({
        url: url,
        requestVertexNormals: options.requestVertexNormals || false, // 请求照明
        requestWaterMask: options.requestWaterMask || false // 请求水波纹效果
      });
      break;
    case "ionTerrain": // * Cesium ion提供了全球地形数据服务
      terrain = new createWorldTerrain({
        requestVertexNormals: options.requestVertexNormals || false, // 请求照明
        requestWaterMask: options.requestWaterMask || false // 请求水波纹效果
      });
      break;
    case "ellipsoidTerrain": // * cesium默认采用,高度为0的地形
      terrain = new EllipsoidTerrainProvider();
      break;
    // ! 暂无此项示例
    case "googleTerrain": // * Google地球REST API提供平铺地形
      terrain = new GoogleEarthEnterpriseTerrainProvider({
        metadata: new GoogleEarthEnterpriseMetadata(url)
      });
      break;
    // ! 暂无此项示例
    case "VRTheWorldTerrain": // * 地形提供器，通过细分从 VT M+K VR-TheWorld 服务器检索的高度地图来生成地形几何
      terrain = new VRTheWorldTerrainProvider({
        url: url
      });
  }
  return terrain;
}

export default addTerrain;
