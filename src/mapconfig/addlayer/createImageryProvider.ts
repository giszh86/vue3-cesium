import {
  ArcGisMapServerImageryProvider,
  BingMapsImageryProvider,
  BingMapsStyle,
  GoogleEarthEnterpriseImageryProvider,
  GoogleEarthEnterpriseMetadata,
  GridImageryProvider,
  IonImageryProvider,
  MapboxImageryProvider,
  MapboxStyleImageryProvider,
  OpenStreetMapImageryProvider,
  SingleTileImageryProvider,
  Rectangle,
  TileCoordinatesImageryProvider,
  TileMapServiceImageryProvider,
  UrlTemplateImageryProvider,
  WebMapServiceImageryProvider,
  WebMapTileServiceImageryProvider,
  GeographicTilingScheme,
  Math,
} from "cesium";

/**
 * @description: 创建一个imageryProvider并返回
 * @param {*} type 要创建的imageryProvider的类型
 * @param {*} url 地图的地址
 * @param {*} options imageryProvider的配置项,可选参数
 * @return {*} 返回一个imageryProvider
 */
function createImageryProvider(type: string, url: string, options?: any) {
  let imageryProvider: any = null;

  switch (type) {
    case "arcgis":
      imageryProvider = new ArcGisMapServerImageryProvider({
        url: url
      });
      break;
    case "bing":
      if (!options.key) {
        throw new Error("使用bing地图必须传入options.key!");
      }
      imageryProvider = new BingMapsImageryProvider({
        url: url,
        key: options.key,
        mapStyle: options.mapStyle
          ? options.mapStyle
          : BingMapsStyle.AERIAL_WITH_LABELS_ON_DEMAND
      });
      break;
    case "google": // * 提供对托管在Google Earth企业服务器上的数据的访问
      imageryProvider = new GoogleEarthEnterpriseImageryProvider({
        url: url,
        metadata: new GoogleEarthEnterpriseMetadata(url)
      });
      break;
    case "grid": // * 地图网格
      imageryProvider = new GridImageryProvider({});
      break;
    case "ion": // * 在网站 https://com/ion/ 注册一个账号;点击"Access Token"，跳转到Access Tokens page页面;选择Default默认的access token拷贝到contents中
      imageryProvider = new IonImageryProvider({
        assetId: parseInt(url)
      });
      break;
    case "mapbox":
      if (!options.accessToken) {
        throw new Error("使用bing地图必须传入options.accessToken!");
      }
      imageryProvider = new MapboxImageryProvider({
        mapId: `mapbox.${options.mapId}`,
        accessToken: options.accessToken
      });
      break;
    case "mapboxStyle":
      imageryProvider = new MapboxStyleImageryProvider({
        styleId: options.styleId,
        accessToken: options.accessToken
      });
      break;
    case "osm":
      imageryProvider = new OpenStreetMapImageryProvider({
        fileExtension: "png",
        url: "https://a.tile.openstreetmap.org/"
      });
      break;
    case "singleTile": // * 传入图片的url时要require require("@/assets/cat.jpg")
      imageryProvider = new SingleTileImageryProvider({
        url: url,
        rectangle: options.rectangle
          ? new Rectangle(
            options.rectangle[0],
            options.rectangle[1],
            options.rectangle[2],
            options.rectangle[3]
          )
          : new Rectangle(-3.141592653589793, -1.4844222297453324, 3.141592653589793, 1.4844222297453322)
      });
      break;
    case "tileCoordinates": // * 网格瓦片 包括网格瓦片等级、X、Y序号
      imageryProvider = new TileCoordinatesImageryProvider();
      break;
    case "tileMapService": // * 访问瓦片图的Rest接口
      imageryProvider = new TileMapServiceImageryProvider({
        url: url
      });
      break;
    case "urlTemplate": // * 通过使用指定的URL模板请求贴图来提供图像。通常用于加载拥有固定规范url的地图,如'xyz'方式的地图
      imageryProvider = new UrlTemplateImageryProvider({
        url: url
      });
      break;
    case "wms": // * 适用于所有符合wms标准的地图
      imageryProvider = new WebMapServiceImageryProvider({
        url: url,
        layers: options.layer,
        parameters: {
          transparent: true,
          format: "image/png"
        }
      });
      break;
    case "wmts": // * 适用于所有符合wmts标准的地图
      imageryProvider = new WebMapTileServiceImageryProvider({
        url: url,
        layer: options.layer,
        style: options.style || "default",
        format: options.format,
        tileMatrixSetID: options.tileMatrixSetID,
        tileMatrixLabels: options.matrixIds,
        maximumLevel: options.maximumLevel,
        tilingScheme: options.tilingScheme
          ? new GeographicTilingScheme({
            numberOfLevelZeroTilesX: options.tilingScheme[0],
            numberOfLevelZeroTilesY: options.tilingScheme[1]
          })
          : undefined,
        rectangle: options.rectangle
          ? Rectangle.fromDegrees(
            options.rectangle[0],
            options.rectangle[1],
            options.rectangle[2],
            options.rectangle[3]
          )
          : new Rectangle(-3.141592653589793, -1.4844222297453324, 3.141592653589793, 1.4844222297453322)
      });
      break;
    default:
      throw new Error("请选择正确的地图加载类型!");
  }
  return imageryProvider;
}

export default createImageryProvider;
