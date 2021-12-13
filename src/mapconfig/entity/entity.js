const Cesium = require("cesium/Cesium");

function entity(type, options = {}) {
  let entity = null;
  switch (type) {
    case "polygon":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        polygon: {
          show: options.show || true,
          hierarchy: Cesium.Cartesian3.fromDegreesArray(options.hierarchy), // * polygon坐标
          height: options.height || 0, // * 离地面高度
          extrudedHeight: options.extrudedHeight || 0, // * 这一项与height的差为物体本身的高度
          stRotation: options.stRotation || 0.0, // * 纹理沿正北逆时钟方向旋转角度
          fill: options.fill || true, // * 是否填充
          material: options.material, // * 材质
          outline: options.outline || true, // * 边框
          outlineColor: options.outlineColor || Cesium.Color.BLACK, // * 边框颜色
          outlineWidth: options.outlineWidth || 1.0, // *边框宽度 只适用于非Windows系统
          classificationType:
            options.classificationType || Cesium.ClassificationType.BOTH // * 多边形对地形和3D tile进行区分
        }
      };
      break;
    case "point":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1]
        ),
        point: {
          show: options.show || true,
          pixelSize: options.pixelSize || 1, // * 大小
          heightReference:
            options.heightReference || Cesium.HeightReference.NONE, // * 高度相对于什么
          color: options.color || Cesium.Color.WHITE,
          outlineColor: options.outlineColor || Cesium.Color.BLACK, // * 边框颜色
          outlineWidth: options.outlineWidth || 0 // *边框宽度
        }
      };
      break;
    case "polyline":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        polyline: {
          show: options.show || true,
          positions: Cesium.Cartesian3.fromDegreesArray(
            options.positions || [-77, 35, -77.1, 35]
          ),
          width: options.width || 1.0,
          material: options.material, // * 材质
          depthFailMaterial: options.depthFailMaterial, // * 线条位于地形下方时的材质,entity中失效,在Primitive中有效
          clampToGround: options.clampToGround || false, // * 是否依附在地形上面
          classificationType:
            options.classificationType || Cesium.ClassificationType.BOTH, // * 对地形和3D tile进行区分
          zIndex: options.zIndex || 0
        }
      };
      break;
    case "billboard":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1]
        ),
        billboard: {
          show: options.show || true,
          image: options.image,
          scale: options.scale || 1.0,
          pixelOffset: options.pixelOffset || new Cesium.Cartesian2(0, 0), // * 偏移量
          eyeOffset: options.eyeOffset || new Cesium.Cartesian3(0.0, 0.0, 0.0), // * eyeOffset能够基于viewer来移动label或billboard的渲染位置。x为正移动到viewer的右边，y为正向上移动，z为正就移动到屏幕里面
          horizontalOrigin:
            options.horizontalOrigin || Cesium.HorizontalOrigin.CENTER, // * 标签的左右位置
          verticalOrigin:
            options.verticalOrigin || Cesium.VerticalOrigin.CENTER, // * 标签的垂直位置
          color: options.color || Cesium.Color.WHITE, // * 图像的色调颜色
          rotation: options.rotation || 0, // * 绕轴旋转
          alignedAxis: options.alignedAxis || Cesium.Cartesian3(0, 0, 0), // * 指定旋转轴
          sizeInMeters: options.sizeInMeters, // * 指定坐标轴是否以米来衡量
          width: options.width, // * 以像素为单位指定公告牌的宽度
          height: options.height // * 以像素为单位指定公告牌的高度
        }
      };
      break;
    case "box":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1]
        ),
        box: {
          show: options.show || true,
          dimensions: new Cesium.Cartesian3(
            options.dimensions[0],
            options.dimensions[1],
            options.dimensions[2]
          ), // * 长宽高
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0
        }
      };
      break;
    case "corridor":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        corridor: {
          show: options.show || true,
          positions: new Cesium.Cartesian3.fromDegreesArray(options.position),
          height: options.height,
          width: options.width,
          extrudedHeight: options.extrudedHeight, // * 物体本身的高度
          cornerType: options.cornerType || Cesium.CornerType.ROUNDED, // * 拐角样式
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0,
          classificationType:
            options.classificationType || Cesium.ClassificationType.BOTH,
          zIndex: options.zIndex || 0
        }
      };
      break;
    case "cylinder":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1],
          options.position[2]
        ),
        cylinder: {
          show: options.show || true,
          length: options.length,
          topRadius: options.topRadius, // * 圆柱体顶部半径
          bottomRadius: options.bottomRadius, // * 圆柱体底部半径
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0
        }
      };
      break;
    case "ellipse":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1],
          options.position[2] || 0
        ),
        ellipse: {
          show: options.show || true,
          semiMajorAxis: options.semiMajorAxis, // * 长半轴
          semiMinorAxis: options.semiMinorAxis, // * 短半轴
          height: options.height || 0,
          extrudedHeight: options.extrudedHeight, // * 物体本身的高度
          rotation: options.rotation || 0, // * 绕轴旋转 北方逆时针
          stRotation: options.stRotation || 0, // *纹理绕轴旋转 北方逆时针
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0,
          classificationType:
            options.classificationType || Cesium.ClassificationType.BOTH,
          zIndex: options.zIndex || 0
        }
      };
      break;
    case "ellipsoid":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1],
          options.position[2] || 0
        ),
        ellipsoid: {
          show: options.show || true,
          radii: new Cesium.Cartesian3(
            options.radii[0],
            options.radii[1],
            options.radii[2]
          ), // * 椭球的尺寸
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0,
          slicePartitions: options.slicePartitions || 64, // * 径向切片数量
          stackPartitions: options.stackPartitions || 64 // * 堆栈数量
        }
      };
      break;
    case "label":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1],
          options.position[2] || 0
        ),
        label: {
          show: options.show || true,
          text: options.text || "示例",
          font: options.font || "30px sans-serif",
          style: options.style || Cesium.LabelStyle.FILL,
          scale: options.scale || 1.0,
          showBackground: options.showBackground || false,
          backgroundColor:
            options.backgroundColor ||
            new Cesium.Color(0.165, 0.165, 0.165, 0.8),
          backgroundPadding:
            options.backgroundPadding || new Cesium.Cartesian2(7, 5), // * 水平和垂直背景填充
          fillColor: options.fillColor || Cesium.Color.WHITE,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1
        }
      };
      break;
    case "plane":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.position[0],
          options.position[1],
          options.position[2] || 0
        ),
        plane: {
          show: options.show || true,
          plane:
            options.plane || new Cesium.Plane(Cesium.Cartesian3.UNIT_Y, 0.0), // * Cesium.Cartesian3.UNIT_X,Cesium.Cartesian3.UNIT_Y,Cesium.Cartesian3.UNIT_Z
          dimensions: new Cesium.Cartesian2(
            options.dimensions[0],
            options.dimensions[1]
          ), // * 指定平面宽高
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0
        }
      };
      break;
    case "polylineVolume":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        polylineVolume: {
          show: options.show || true,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(
            options.positions
          ),
          shape: options.shape || [
            new Cesium.Cartesian2(-50000, -50000),
            new Cesium.Cartesian2(50000, -50000),
            new Cesium.Cartesian2(50000, 50000),
            new Cesium.Cartesian2(-50000, 50000)
          ], // * 指定面形状
          cornerType: options.cornerType || Cesium.CornerType.ROUNDED, // * 指定拐角样式
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0
        }
      };
      break;
    case "rectangle":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        rectangle: {
          show: options.show || true,
          coordinates: Cesium.Rectangle.fromDegrees(
            options.coordinates[0],
            options.coordinates[1],
            options.coordinates[2],
            options.coordinates[3]
          ),
          height: options.height || 0,
          extrudedHeight: options.extrudedHeight,
          rotation: options.rotation || 0,
          stRotation: options.stRotation || 0,
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0,
          classificationType:
            options.classificationType || Cesium.ClassificationType.BOTH,
          zIndex: options.zIndex || 0
        }
      };
      break;
    case "wall":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        wall: {
          show: options.show || true,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(
            options.positions
          ),
          maximumHeights: options.maximumHeights,
          minimumHeights: options.minimumHeights,
          fill: options.fill || true,
          material: options.material || Cesium.Color.WHITE,
          outline: options.outline || false,
          outlineColor: options.outlineColor || Cesium.Color.BLACK,
          outlineWidth: options.outlineWidth || 1.0
        }
      };
      break;
    case "model":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        position: Cesium.Cartesian3.fromDegrees(
          options.positions[0],
          options.positions[1],
          options.positions[2]
        ),
        orientation:
          options.orientation ||
          Cesium.Transforms.headingPitchRollQuaternion(
            Cesium.Cartesian3.fromDegrees(
              options.positions[0],
              options.positions[1],
              options.positions[2]
            ),
            new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(135), 0, 0)
          ),
        model: {
          show: options.show || true,
          uri: options.uri,
          scale: options.scale || 1.0,
          minimumPixelSize: options.minimumPixelSize || 128, // * 模型的最小最小像素大小，而不考虑缩放
          maximumScale: options.maximumScale || 20000, // * 模型的最大比例尺大小。 minimumPixelSize的上限
          incrementallyLoadTextures: options.incrementallyLoadTextures || true, // * 确定在加载模型后纹理是否可以继续流入
          runAnimations: options.runAnimations || true, // * 是否应启动模型中指定的glTF动画
          clampAnimations: options.clampAnimations || true, // * glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
          shadows: options.shadows || Cesium.ShadowMode.DISABLED,
          heightReference:
            options.heightReference || Cesium.HeightReference.NONE,
          silhouetteColor: options.silhouetteColor || Cesium.Color.RED, // * 轮廓的颜色
          silhouetteSize: options.silhouetteSize || 0.0, // * 轮廓的宽度
          color: options.color || Cesium.Color.WHITE, // * 模型的颜色

          // * 目标颜色和图元的源颜色之间混合的不同模式
          // * HIGHLIGHT 将源颜色乘以目标颜色;REPLACE 将源颜色替换为目标颜色;MIX 将源颜色和目标颜色混合在一起
          colorBlendMode:
            options.colorBlendMode || Cesium.ColorBlendMode.HIGHLIGHT,
          // * 用于指定 colorBlendMode 为 MIX 时的颜色强度。值0.0会产生模型的着色，而值1.0会导致纯色，介于两者之间的任何值都会导致两者混合
          colorBlendAmount: options.colorBlendAmount || 0.5,
          imageBasedLightingFactor:
            options.imageBasedLightingFactor || new Cesium.Cartesian2(1.0, 1.0), // * 指定基于漫反射和镜面反射的图像照明的贡献
          lightColor: options.lightColor || undefined // * 为模型着色时指定浅色的属性。如果 undefined ，则使用场景的浅色。
        }
      };
      break;
    case "tileset":
      entity = {
        name: options.name || "示例",
        availability: options.availability,
        tileset: {
          show: options.show || true,
          uri: options.uri
        }
      };
      break;
    default:
      break;
  }
  return entity;
}

export default entity;
