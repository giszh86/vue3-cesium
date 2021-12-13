# CesiumWallBillboard加载示例展示

## CesiumWallBillboard

```js
let cesiumWallBillboard = new this.Cesium.CesiumWallBillboard({
  viewer: window.viewer,
  center: {
    // 广告牌中心点
    longitude: 118.05741,
    latitude: 24.630362,
    height: 80
  },
  width: 150, // 广告牌宽度
  height: 50, // 广告牌高度
  rotate: 180, // 正北顺时针角度
  content: `
    <style>
      .border-box{padding: 5px;width:calc(100% - 14px);height:calc(100% - 14px);background: rgba(1, 19, 67, 0.4);border: 2px solid rgb(0, 161, 255);border-radius: 8px;font-size: 12px;color: white;}
      .border-box::before {position: absolute;top: -2px;bottom: -2px;left: 2px;width: calc(100% - 4px);content: "";border-top: 2px solid rgb(1, 104, 134);border-bottom: 2px solid rgb(1, 104, 134);z-index: 0;}
      .border-box::after {position: absolute;top: 2px;right: -2px;left: -2px;height: calc(100% - 4px);content: "";border-right: 2px solid rgb(1, 104, 134);border-left: 2px solid rgb(1, 104, 134);z-index: 0;}
    </style>
    <div class="border-box">
    <div>"BSM":"370100000000091188",</div>
    <div>"CG":"3",</div>
    <div>"CODE":"370100",</div>
    <div>"CS":"15",</div>
    <div>"LG":"45",</div>
    <div>"NAME":"楼房91188",</div>
    <div>"UID":"bc2e4443-2fbb-11ea-9cec-380025e8e3aa",</div>
    <div>"id":"91188"</div>
    </div>`
});
    setInterval(() => {
      window.viewer.entities.remove(cesiumWallBillboard._entities);
    }, 4000);
```

![CesiumWallBillboard](./displayCesiumWallBillboard/CesiumWallBillboard.JPG)
