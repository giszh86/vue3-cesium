# 相机使用实例

## 实例化相机

```js
// 首先引入camera文件
import Camera from "../mapconfig/camera/camera";
// 通过new来实例化相机
let camera = new Camera(viewer);
 /**
   * @description: 为相机设置位置和角度
   * @param {*} destination 设置相机的位置需要以数组的形式提供,可分别提供迪卡尔坐标[经度,维度,高度],如[-117.16, 32.71, 15000.0]或者矩形的西,南,东,北坐标的最大值如[-100.0, 20.0, -90.0, 30.0]
   * @param {*} orientation 设置相机的方向,{ heading: 90.0, pitch:-90, roll: 0.0 },heading表示绕Z轴旋转,沿-Z方向为正值;pitch表示绕y轴旋转,沿-Y方向为正值;roll表示绕x轴旋转,沿+X为正值
   * @param {*} convert 是否将目的地从世界坐标转换为场景坐标(仅在不使用3D时相关)
   */
camera.setView([112.419718, 37.927023, 2000.0], {
    heading: 0,
    pitch: -45,
    roll: 0,
  });
```

## 设置相机控制

```js
// 设置可以通过键盘控制相机移动，并且禁止鼠标控制相机的默认事件 w：向前移动；a：向左移动；s：向后移动；d：向右移动；q：向上移动；e：向下移动
camera.cameraControl();
```

## 相机飞行

```js
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
camera.flyTo({
    destination: [-117.16, 32.71, 15000.0],
    orientation: {
      heading: 175.0,
      pitch: -35.0,
      roll: 0.0,
      up: [],
    },
    duration: 5,
  });
```
