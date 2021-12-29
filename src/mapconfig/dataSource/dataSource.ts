import { CustomDataSource, CzmlDataSource, DataSource, GeoJsonDataSource, KmlDataSource, Viewer } from "cesium";
/**
 * @description: option接口
 * @param clampToGround Boolean 设置是否贴地
 * @interface IOption
 */
interface IOption {
  clampToGround?: boolean
}

/**
 * @description: 快速创建DataSource类型
 * @class CDataSource
 */
class CDataSource {
  viewer: Viewer;
  type: string;
  url: string;
  /**
   * 快速创建DataSource类型
   * @param {Viewer} viewer 实例化的viewer对象
   * @param {string} type 需要创建的DataSource类型，可选值：customDataSource、kmlDataSource、json、czml
   * @param {string} url 设置文件路径
   * @param {IOption} options {clampToGround?: boolean} 设置是否贴地
   * @memberof CDataSource
   */
  constructor(viewer: Viewer, type: string, url: string) {
    this.viewer = viewer;
    this.type = type;
    this.url = url;
  }
  _Init(options: IOption): any {
    let dataSource;
    switch (this.type) {
      case "customDataSource":
        dataSource = new CustomDataSource(this.url);
        return dataSource;
      case "kmlDataSource":
        dataSource = KmlDataSource.load(this.url, {
          camera: this.viewer.scene.camera,
          canvas: this.viewer.scene.canvas,
          clampToGround: options.clampToGround || false
        });
        return dataSource;
      case "json": // * 可以加载geojson或者topojson
        dataSource = GeoJsonDataSource.load(this.url, {
          clampToGround: options.clampToGround || false
        });
        return dataSource;
      case "czml":
        dataSource = CzmlDataSource.load(this.url);
        return dataSource;
      default:
        console.log("请输入正确的类型!!!");
        break;
    }

  }

}

export default CDataSource;
