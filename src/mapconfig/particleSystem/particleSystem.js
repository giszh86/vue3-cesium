const Cesium = require("cesium/Cesium");

/**
 * @description: 创建粒子系统
 * @param {Object} options 参数
 * @param {Boolean} options.show 是否显示
 * @param {ParticleEmitter} options.emitter 粒子发射器 BoxEmitter  CircleEmitter  ConeEmitter  SphereEmitter
 * @param {Cesium.Matrix4} options.modelMatrix 将粒子系统从模型转换为世界坐标
 * @param {Cesium.Matrix4} options.emitterModelMatrix 在粒子系统的局部坐标系中变换粒子系统发射器
 * @param {Number} options.emissionRate 粒子发射器速率
 * @param {Array} options.bursts 粒子爆发阵列，周期性地发射粒子爆发 new Cesium.ParticleBurst(options)
 * @param {Boolean} options.loop 粒子系统完成后是否循环爆发
 * @param {Number} options.scale 粒子存在时比例
 * @param {Number} options.startScale 粒子出现时的初始比例
 * @param {Number} options.endScale 粒子消失时比例
 * @param {Color} options.color 粒子颜色
 * @param {Color} options.startColor 粒子出现时颜色
 * @param {Color} options.endColor 粒子消失时的颜色
 * @param {Object} options.image 指定图片
 * @param {Cesium.Cartesian2} options.imageSize 粒子大小,如果设置，覆盖最小imagesize和最大imagesize输入
 * @param {Cesium.Cartesian2} options.minimumImageSize 设置最小宽高
 * @param {Cesium.Cartesian2} options.maximumImageSize 设置最大宽高,通过minimumImageSize和maximumImageSize随机粒子大小尺寸
 * @param {Boolean} options.sizeInMeters 设置大小是否以米为单位
 * @param {Number} options.speed 粒子速度,如果设置，则使用此值覆盖最小速度和最大速度输入
 * @param {Number} options.minimumSpeed 最小速度
 * @param {Number} options.maximumSpeed 最大速度
 * @param {Number} options.lifetime 粒子系统释放粒子的时间,
 * @param {Number} options.particleLife 粒子存在时间
 * @param {Number} options.minimumParticleLife 粒子最小存在时间
 * @param {Number} options.maximumParticleLife 粒子最大存在时间
 * @param {Function} options.updateCallback
 * @return {*} particleSystem
 */
function particleSystem(options = undefined) {
  if (!options) {
    throw new Error("请传入参数");
  }
  let particleSystem;
  particleSystem = new Cesium.ParticleSystem({
    show: options.show || true,
    emitter: options.emitter || new Cesium.CircleEmitter(0.5),
    modelMatrix: options.modelMatrix || Cesium.Matrix4.IDENTITY,
    emitterModelMatrix: options.emitterModelMatrix || Cesium.Matrix4.IDENTITY,
    emissionRate: options.emissionRate || 5,
    bursts: options.bursts || [],
    loop: options.loop || true,
    scale: options.scale,
    startScale: options.startScale,
    endScale: options.endScale,
    color: options.color,
    startColor: options.startColor,
    endColor: options.endColor,
    image: options.image,
    imageSize: options.imageSize,
    minimumImageSize: options.minimumImageSize,
    maximumImageSize: options.maximumImageSize,
    sizeInMeters: options.sizeInMeters,
    speed: options.speed,
    minimumSpeed: options.minimumSpeed,
    maximumSpeed: options.maximumSpeed,
    lifetime: options.lifetime || 16.0,
    particleLife: options.particleLife,
    minimumParticleLife: options.minimumParticleLife,
    maximumParticleLife: options.maximumParticleLife,
    updateCallback: options.updateCallback
  });
  return particleSystem;
}

export default particleSystem;
