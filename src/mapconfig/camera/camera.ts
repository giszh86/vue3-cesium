const Cesium = require("cesium/Cesium");

/**
 * ! cesium中的笛卡尔坐标系介绍
 * ! x轴垂直屏幕向外
 * ! y轴向东
 * ! z轴向北
 * ! 坐标原点为地球集合中心
 */

class Camera {
  camera: any;
  constructor() {
    this.camera = window.viewer.scene.camera;
  }
  /**
   * @description: 为相机设置位置和角度
   * @param {*} destination 设置相机的位置需要以数组的形式提供,可分别提供迪卡尔坐标[经度,维度,高度],如[-117.16, 32.71, 15000.0]或者矩形的西,南,东,北坐标的最大值如[-100.0, 20.0, -90.0, 30.0]
   * @param {*} orientation 设置相机的方向,{ heading: 90.0, pitch:-90, roll: 0.0 },heading表示绕Z轴旋转,沿-Z方向为正值;pitch表示绕y轴旋转,沿-Y方向为正值;roll表示绕x轴旋转,沿+X为正值
   * @param {*} convert 是否将目的地从世界坐标转换为场景坐标(仅在不使用3D时相关)
   */
  setView(
    destination = [0, 0, 0],
    orientation = {
      heading: 90.0,
      pitch: -90,
      roll: 0.0
    },
    convert = true
  ) {
    this.camera.setView({
      destination:
        destination.length === 3
          ? Cesium.Cartesian3.fromDegrees(
            destination[0],
            destination[1],
            destination[2]
          )
          : Cesium.Rectangle.fromDegrees(
            destination[0],
            destination[1],
            destination[2],
            destination[3]
          ),
      orientation: {
        heading: Cesium.Math.toRadians(orientation.heading),
        pitch: Cesium.Math.toRadians(orientation.pitch),
        roll: Cesium.Math.toRadians(orientation.roll)
      },
      convert: convert
    });
  }
  // * 相机由鼠标控制改变为由键盘控制
  cameraControl() {
    let scene = window.viewer.scene;
    let canvas = window.viewer.canvas;

    // * 使焦点聚集在画布
    canvas.setAttribute("tabindex", "0");
    canvas.onclick = function () {
      canvas.focus();
    };

    let ellipsoid = window.viewer.scene.globe.ellipsoid;

    // * 禁止鼠标控制相机的默认事件
    // * 禁止旋转
    scene.screenSpaceCameraController.enableRotate = false;
    // * 禁止平移
    scene.screenSpaceCameraController.enableTranslate = false;
    // * 禁止缩放
    scene.screenSpaceCameraController.enableZoom = false;
    // * 禁止倾斜
    scene.screenSpaceCameraController.enableTilt = false;
    // * 禁止自由观看,只能通过旋转和平移改变相机的视图方向
    scene.screenSpaceCameraController.enableLook = false;

    let startMousePosition;
    let mousePosition;
    let flags = {
      looking: false,
      moveForward: false,
      moveBackward: false,
      moveUp: false,
      moveDown: false,
      moveLeft: false,
      moveRight: false
    };

    let handler = new Cesium.ScreenSpaceEventHandler(canvas);

    // * 设置鼠标左键按下时的事件
    handler.setInputAction(function (movement) {
      flags.looking = true;
      mousePosition = startMousePosition = Cesium.Cartesian3.clone(
        movement.position
      );
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    // * 设置鼠标移动事件
    handler.setInputAction(function (movement) {
      mousePosition = movement.endPosition;
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // * 设置鼠标左键抬起事件
    handler.setInputAction(function () {
      flags.looking = false;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    function getFlagForKeyCode(keyCode) {
      switch (keyCode) {
        case "W".charCodeAt(0):
          return "moveForward";
        case "S".charCodeAt(0):
          return "moveBackward";
        case "Q".charCodeAt(0):
          return "moveUp";
        case "E".charCodeAt(0):
          return "moveDown";
        case "D".charCodeAt(0):
          return "moveRight";
        case "A".charCodeAt(0):
          return "moveLeft";
        default:
          return undefined;
      }
    }

    // * 监测键盘按键按下事件
    document.addEventListener(
      "keydown",
      function (e) {
        let flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== "undefined") {
          flags[flagName] = true;
        }
      },
      false
    );

    // * 监测键盘按键抬起时事件
    document.addEventListener(
      "keyup",
      function (e) {
        let flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== "undefined") {
          flags[flagName] = false;
        }
      },
      false
    );

    // * 添加时间变化监听
    window.viewer.clock.onTick.addEventListener(() => {
      if (flags.looking) {
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        let x = (mousePosition.x - startMousePosition.x) / width;
        let y = -(mousePosition.y - startMousePosition.y) / height;

        let lookFactor = 0.05;
        this.camera.lookRight(x * lookFactor);
        this.camera.lookUp(y * lookFactor);
      }

      let cameraHeight = ellipsoid.cartesianToCartographic(this.camera.position)
        .height;
      let moveRate = cameraHeight / 100.0;

      if (flags.moveForward) {
        this.camera.moveForward(moveRate);
      }
      if (flags.moveBackward) {
        this.camera.moveBackward(moveRate);
      }
      if (flags.moveUp) {
        this.camera.moveUp(moveRate);
      }
      if (flags.moveDown) {
        this.camera.moveDown(moveRate);
      }
      if (flags.moveLeft) {
        this.camera.moveLeft(moveRate);
      }
      if (flags.moveRight) {
        this.camera.moveRight(moveRate);
      }
    });
  }
  // * 取消相机飞行
  cancelFlight() {
    return this.camera.cancelFlight();
  }
  // * 立即完成相机飞行并且相机移动到目的地
  completeFlight() {
    return this.camera.completeFlight();
  }
  // * 计算椭球上近似可见的矩形,返回矩形或者undefined
  computeViewRectangle() {
    return this.camera.computeViewRectangle(
      window.viewer.scene.globe.ellipsoid
    );
  }
  /**
   * @description: 相机飞往某个地点
   * @param {*} options 下面是options的配置项
   * @param {*} destination 此项是必须项,设置相机飞向的位置要以数组的形式提供,可分别提供迪卡尔坐标[经度,维度,高度],如[-117.16, 32.71, 15000.0]或者矩形的西,南,东,北坐标的最大值如[-100.0, 20.0, -90.0, 30.0]
   * @param {*} orientation 指定飞行的方向 { heading: , pitch:, roll:  }或者{direction: ,up:  }
   * @param {*} duration 飞行时间,单位秒
   * @param {*} maximumHeight 飞行的最大高度
   * @param {*} pitchAdjustHeight 飞行超过这个高度时,调整角度向下看并且保证地球在视口
   * @param {*} flyOverLongitude 指定飞行必须经过的经度
   */
  flyTo(options) {
    this.camera.flyTo({
      destination:
        options.destination.length === 3
          ? Cesium.Cartesian3.fromDegrees(
            options.destination[0],
            options.destination[1],
            options.destination[2]
          )
          : Cesium.Rectangle.fromDegrees(
            options.destination[0],
            options.destination[1],
            options.destination[2],
            options.destination[3]
          ),
      orientation: options.orientation
        ? options.orientation.direction != undefined
          ? {
            direction: new Cesium.Cartesian3(
              options.orientation.direction[0],
              options.orientation.direction[1],
              options.orientation.direction[1]
            ),
            up: new Cesium.Cartesian3(
              options.orientation.up[0],
              options.orientation.up[1],
              options.orientation.up[1]
            )
          }
          : {
            heading: Cesium.Math.toRadians(options.orientation.heading),
            pitch: Cesium.Math.toRadians(options.orientation.pitch),
            roll: Cesium.Math.toRadians(options.orientation.roll)
          }
        : undefined,
      duration: options.duration,
      maximumHeight: options.maximumHeight,
      pitchAdjustHeight: options.pitchAdjustHeight,
      flyOverLongitude: options.flyOverLongitude
    });
  }
  // * 获取camera
  getCesiumCamera() {
    return this.camera;
  }
}

export default Camera;
