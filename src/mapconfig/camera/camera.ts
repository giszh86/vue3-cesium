import { Cartesian3, Rectangle, Viewer, Math, ScreenSpaceEventHandler, ScreenSpaceEventType } from "cesium";

interface IOptions {
  destination: Array<number>,
  orientation?: {
    direction?: Array<number>,
    up: Array<number>,
    heading: number,
    pitch: number,
    roll: number,
  },
  duration?: any,
  maximumHeight?: any,
  pitchAdjustHeight?: any,
  flyOverLongitude?: any
}

class FlagMouse {
  constructor() {
  }
  private _looking: Boolean = false;
  private _moveForward: Boolean = false;
  private _moveBackward: Boolean = false;
  private _moveUp: Boolean = false;
  private _moveDown: Boolean = false;
  private _moveLeft: Boolean = false;
  private _moveRight: Boolean = false;
  public get looking(): Boolean { return this._looking; }
  public set looking(value: Boolean) { this._looking = value; }
  public get moveForward(): Boolean { return this._moveForward; }
  public set moveForward(value: Boolean) { this._moveForward = value; }
  public get moveBackward(): Boolean { return this._moveBackward; }
  public set moveBackward(value: Boolean) { this._moveBackward = value; }
  public get moveLeft(): Boolean { return this._moveLeft; }
  public set moveLeft(value: Boolean) { this._moveLeft = value; }
  public get moveRight(): Boolean { return this._moveRight; }
  public set moveRight(value: Boolean) { this._moveRight = value; }
  public get moveUp(): Boolean { return this._moveUp; }
  public set moveUp(value: Boolean) { this._moveUp = value; }
  public get moveDown(): Boolean { return this._moveDown; }
  public set moveDown(value: Boolean) { this._moveDown = value; }
}
/**
 * ! cesium中的笛卡尔坐标系介绍
 * ! x轴垂直屏幕向外
 * ! y轴向东
 * ! z轴向北
 * ! 坐标原点为地球集合中心
 */

class Camera {
  camera: any;
  viewer: Viewer;
  constructor(viewer: Viewer) {
    this.viewer = viewer;
    this.camera = viewer.scene.camera;
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
          ? Cartesian3.fromDegrees(
            destination[0],
            destination[1],
            destination[2]
          )
          : Rectangle.fromDegrees(
            destination[0],
            destination[1],
            destination[2],
            destination[3]
          ),
      orientation: {
        heading: Math.toRadians(orientation.heading),
        pitch: Math.toRadians(orientation.pitch),
        roll: Math.toRadians(orientation.roll)
      },
      convert: convert
    });
  }
  /**
   *@description: 设置可以通过键盘控制相机移动，并且禁止鼠标控制相机的默认事件
   * w：向前移动；a：向左移动；s：向后移动；d：向右移动；q：向上移动；e：向下移动
   */
  cameraControl() {
    let scene = this.viewer.scene;
    let canvas = this.viewer.canvas;

    // * 使焦点聚集在画布
    canvas.setAttribute("tabindex", "0");
    canvas.onclick = function () {
      canvas.focus();
    };

    let ellipsoid = this.viewer.scene.globe.ellipsoid;

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

    let startMousePosition: Cartesian3;
    let mousePosition: Cartesian3;

    const flags = new FlagMouse();

    let handler = new ScreenSpaceEventHandler(canvas);

    // * 设置鼠标左键按下时的事件
    handler.setInputAction(function (movement) {
      flags.looking = true;
      mousePosition = startMousePosition = Cartesian3.clone(
        movement.position
      );
    }, ScreenSpaceEventType.LEFT_DOWN);

    // * 设置鼠标移动事件
    handler.setInputAction(function (movement) {
      mousePosition = movement.endPosition;
    }, ScreenSpaceEventType.MOUSE_MOVE);

    // * 设置鼠标左键抬起事件
    handler.setInputAction(function () {
      flags.looking = false;
    }, ScreenSpaceEventType.LEFT_UP);

    function getFlagForKeyCode(keyCode: String, boolean: boolean): void {
      switch (keyCode) {
        case "KeyW":
          flags.moveForward = boolean;
          break;
        case "KeyS":
          flags.moveBackward = boolean;
          break;
        case "KeyQ":
          flags.moveUp = boolean;
          break;
        case "KeyE":
          flags.moveDown = boolean;
          break;
        case "KeyD":
          flags.moveRight = boolean;
          break;
        case "KeyA":
          flags.moveLeft = boolean;
          break;
        default:
          break;
      }
    }

    // * 监测键盘按键按下事件
    document.addEventListener(
      "keydown",
      function (e) {
        getFlagForKeyCode(e.code, true);
      },
      false
    );

    // * 监测键盘按键抬起时事件
    document.addEventListener(
      "keyup",
      function (e) {
        getFlagForKeyCode(e.code, false);
      },
      false
    );

    // * 添加时间变化监听
    this.viewer.clock.onTick.addEventListener(() => {
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
  /**
   *@description: 取消当前相机飞行
   */
  cancelFlight() {
    return this.camera.cancelFlight();
  }
  /**
   *@description: 立即完成相机飞行并且相机移动到目的地
   */
  completeFlight() {
    return this.camera.completeFlight();
  }
  /**
   *@description: 计算椭球上近似可见的矩形,返回矩形或者undefined
   */
  computeViewRectangle() {
    return this.camera.computeViewRectangle(
      this.viewer.scene.globe.ellipsoid
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
  flyTo(options: IOptions) {
    this.camera.flyTo({
      destination:
        options.destination.length === 3
          ? Cartesian3.fromDegrees(
            options.destination[0],
            options.destination[1],
            options.destination[2]
          )
          : Rectangle.fromDegrees(
            options.destination[0],
            options.destination[1],
            options.destination[2],
            options.destination[3]
          ),
      orientation: options.orientation
        ? options.orientation.direction != undefined
          ? {
            direction: new Cartesian3(
              options.orientation.direction[0],
              options.orientation.direction[1],
              options.orientation.direction[1]
            ),
            up: new Cartesian3(
              options.orientation.up[0],
              options.orientation.up[1],
              options.orientation.up[1]
            )
          }
          : {
            heading: Math.toRadians(options.orientation.heading),
            pitch: Math.toRadians(options.orientation.pitch),
            roll: Math.toRadians(options.orientation.roll)
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
