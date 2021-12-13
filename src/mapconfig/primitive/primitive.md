# primitive

## box

```js
let geometry = createPrimitve("box", {
  dimensions: [400000.0, 300000.0, 500000.0],
  modelMatrix: [-105.0, 45.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false
})
```

![box](./displayPrimitive/box.JPG)

## boxoutline

```js
let geometry = createPrimitve("boxOutline", {
  dimensions: [400000.0, 300000.0, 500000.0],
  modelMatrix: [-105.0, 45.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![boxoutline](./displayPrimitive/boxoutline.JPG)

## circle

```js
let geometry = createPrimitve("circle", {
  center: [-75.59777, 40.03883],
  radius: 100000.0
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![circle](./displayPrimitive/circle.JPG)

## circleoutline

```js
let geometry = createPrimitve("circleOutline", {
  center: [-75.59777, 40.03883],
  radius: 100000.0
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![circleoutline](./displayPrimitive/circleoutline.JPG)

## coplanarPolygon

```js
let geometry = createPrimitve("coplanarPolygon", {
  polygonHierarchy: [
    -90.0,
    30.0,
    0.0,
    -90.0,
    30.0,
    300000.0,
    -80.0,
    30.0,
    300000.0,
    -80.0,
    30.0,
    0.0
  ]
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![coplanarPolygon](./displayPrimitive/coplanarPolygon.JPG)

## coplanarPolygonOutline

```js
let geometry = createPrimitve("coplanarPolygonOutline", {
  polygonHierarchy: [
    -90.0,
    30.0,
    0.0,
    -90.0,
    30.0,
    300000.0,
    -80.0,
    30.0,
    300000.0,
    -80.0,
    30.0,
    0.0
  ]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![coplanarPolygonOutline](./displayPrimitive/coplanarPolygonOutline.JPG)

## corridor

```js
let geometry = createPrimitve("corridor", {
  positions: [-72.0, 40.0, -70.0, 35.0, -75.59777, 40.03883],
  width: 100000,
  extrudedHeight: 100000
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![corridor](./displayPrimitive/corridor.JPG)

## corridorOutline

```js
let geometry = createPrimitve("corridorOutline", {
  positions: [-72.0, 40.0, -70.0, 35.0, -75.59777, 40.03883],
  width: 100000,
  extrudedHeight: 100000
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![corridorOutline](./displayPrimitive/corridorOutline.JPG)

## cylinder

```js
let geometry = createPrimitve("cylinder", {
  length: 200000,
  topRadius: 80000,
  bottomRadius: 200000,
  modelMatrix: [-105.0, 45.0]
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![cylinder](./displayPrimitive/cylinder.JPG)

## cylinderOutline

```js
let geometry = createPrimitve("cylinderOutline", {
  length: 200000,
  topRadius: 80000,
  bottomRadius: 200000,
  modelMatrix: [-105.0, 45.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![cylinderOutline](./displayPrimitive/cylinderOutline.JPG)

## ellipse

```js
let geometry = createPrimitve("ellipse", {
  center: [-75.59777, 40.03883],
  semiMajorAxis: 500000.0,
  semiMinorAxis: 300000.0,
  extrudedHeight: 100000
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![ellipse](./displayPrimitive/ellipse.JPG)

## ellipseOutline

```js
let geometry = createPrimitve("ellipseOutline", {
  center: [-75.59777, 40.03883],
  semiMajorAxis: 500000.0,
  semiMinorAxis: 300000.0,
  extrudedHeight: 100000
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![ellipseOutline](./displayPrimitive/ellipseOutline.JPG)

## ellipsoid

```js
let geometry = createPrimitve("ellipsoid", {
  radii: [1000000.0, 500000.0, 500000.0],
  modelMatrix: [-105.0, 45.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![ellipsoid](./displayPrimitive/ellipsoid.JPG)

## ellipsoidOutline

```js
let geometry = createPrimitve("ellipsoidOutline", {
  radii: [1000000.0, 500000.0, 500000.0],
  modelMatrix: [-105.0, 45.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![ellipsoidOutline](./displayPrimitive/ellipsoidOutline.JPG)

## frustum

```js
let geometry = createPrimitve("frustum", {
  origin: [-105.0, 45.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![frustum](./displayPrimitive/frustum.JPG)

## frustumOutline

```js
let geometry = createPrimitve("frustumOutline", {
  origin: [-105.0, 45.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![frustumOutline](./displayPrimitive/frustumOutline.JPG)

## plane

```js
let geometry = createPrimitve("plane", {
  modelMatrix: [-105.0, 45.0],
  long: 100000.0,
  width: 200000.0
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![plane](./displayPrimitive/plane.JPG)

## planeOutline

```js
let geometry = createPrimitve("planeOutline", {
  modelMatrix: [-105.0, 45.0],
  long: 100000.0,
  width: 200000.0
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![planeOutline](./displayPrimitive/planeOutline.JPG)

## polygon

```js
let geometry = createPrimitve("polygon", {
  polygonHierarchy: [
    -72.0,
    40.0,
    -70.0,
    35.0,
    -75.0,
    30.0,
    -70.0,
    30.0,
    -68.0,
    40.0
  ],
  extrudedHeight: 1000000.0
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![polygon](./displayPrimitive/polygon.JPG)

## polygonOutline

```js
let geometry = createPrimitve("polygonOutline", {
  polygonHierarchy: [
    -72.0,
    40.0,
    -70.0,
    35.0,
    -75.0,
    30.0,
    -70.0,
    30.0,
    -68.0,
    40.0
  ],
  extrudedHeight: 1000000.0
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![polygonOutline](./displayPrimitive/polygonOutline.JPG)

## polyline

```js
let geometry = createPrimitve("polyline", {
  positions: [-80.0, 39.0, -74.0, 42.0],
  width: 10.0
});

appearance: new this.Cesium.PolylineColorAppearance({
  translucent: false
})
```

![polyline](./displayPrimitive/polyline.JPG)

## simplePolyline

```js
let geometry = createPrimitve("simplePolyline", {
  positions: [-80.0, 39.0, -74.0, 42.0, -72.0, 40.0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![polyline](./displayPrimitive/polyline.JPG)

## rectangle

```js
let geometry = createPrimitve("rectangle", {
  rectangle: [-80.0, 39.0, -74.0, 42.0],
  extrudedHeight: 1000000.0
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![rectangle](./displayPrimitive/rectangle.JPG)

## rectangleOutline

```js
let geometry = createPrimitve("rectangleOutline", {
  rectangle: [-80.0, 39.0, -74.0, 42.0],
  extrudedHeight: 1000000.0
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![rectangleOutline](./displayPrimitive/rectangleOutline.JPG)

## sphere

```js
let geometry = createPrimitve("sphere", {
  radius: 1.0,
  modelMatrix: [-80.0, 39.0]
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![sphere](./displayPrimitive/sphere.JPG)

## sphereOutline

```js
let geometry = createPrimitve("sphereOutline", {
  radius: 1.0
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![sphereOutline](./displayPrimitive/sphereOutline.JPG)

## wall

```js
let geometry = createPrimitve("wall", {
  positions: [-95.0, 50.0, -85.0, 50.0, -75.0, 50.0],
  maximumHeights: [500000, 1000000, 500000],
  minimumHeights: [0, 500000, 0]
});

appearance: new this.Cesium.EllipsoidSurfaceAppearance({
  material: this.Cesium.Material.fromType("Stripe")
})
```

![wall](./displayPrimitive/wall.JPG)

## wallOutline

```js
let geometry = createPrimitve("wallOutline", {
  positions: [-95.0, 50.0, -85.0, 50.0, -75.0, 50.0],
  maximumHeights: [500000, 1000000, 500000],
  minimumHeights: [0, 500000, 0]
});

appearance: new this.Cesium.PerInstanceColorAppearance({
  flat: true,
  translucent: false,
  renderState: {
    lineWidth: Math.min(
      6.0,
      window.viewer.scene.maximumAliasedLineWidth
    )
  }
})
```

![wallOutline](./displayPrimitive/wallOutline.JPG)

## 3dtile

```js
let primitive = createPrimitve("3dTile", {
  url: "http://localhost:8091/cz/tileset.json"
});
let pri = window.viewer.scene.primitives.add(primitive);
window.viewer.zoomTo(pri);
```

![3dtile](./displayPrimitive/3dtile.JPG)
