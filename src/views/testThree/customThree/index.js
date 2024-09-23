import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import * as TWEEN from '@tweenjs/tween.js';
import { Message } from 'element-ui';
import { isRef, onBeforeUnmount, ref } from 'vue';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min';
import { useDebounceFn } from '@vueuse/core';

const config = {
  radio: 1,
};
const lightKey = '环境';
const localKey = (name) => `intensity${name}`;
const getLocalNumber = (name, initNum) => {
  // const n = localStorage.getItem(localKey(name));
  // if ([null, undefined].includes(n)) {
  //   localStorage.setItem(localKey(name), initNum.toString());
  //   return Number(initNum);
  // }
  return initNum;
};

// 半球光的颜色
const lightColorKey = (name) => `color1${name}`;
const lightColorKey2 = (name) => `color2${name}`;
function getLocalColor(name, initColor) {
  const color = localStorage.getItem(lightColorKey(name));
  return color || initColor;
}
function getLocalColor2(name, initColor) {
  const color = localStorage.getItem(lightColorKey2(name));
  return color || initColor;
}

export function customThree(
  container,
  options = {
    lightType: '',
  },
) {
  const three = {
    destroy,
    use,
    gui: null,
    pluginList: [],
    // 场景
    scene: null,
    // 相机
    camera: null,
    // 控制器
    controls: null,
    // 渲染器
    renderer: null,
    // 容器
    container: null,
    // 模型
    model: {
      model: null,
      load: null,
    },
    // 灯光 {light, destroy}
    light: [],
    // 动画
    animate: {
      pause: null,
      start: null,
      destroy: null,
    },
  };

  three.container = container;

  // 灯光测试
  // const lightIntensity = getLocalNumber(lightKey, 0.1);
  // const lightIntensity = getLocalNumber(lightKey, 0.17);
  const lightIntensity = getLocalNumber(lightKey, 0.22);
  const lightList = [
    {
      color: 0xffffff,
      color2: 0x00ff00,
      name: '绿色',
      helper: true,
      groundColor: getLocalColor2('绿色', 0x080820),
      // intensity: getLocalNumber('绿色', 8.9),
      // intensity: getLocalNumber('绿色', 0.59),
      intensity: getLocalNumber('绿色', 0.93),
      position: { x: -48.248, y: -109.522, z: 58.944 },
      rotation: { x: 63.47, y: 8.979, z: -34.113 },
      width: 24.858,
      height: 29.83,
    },
    {
      color: 0xffffff,
      color2: 0xff0000,
      groundColor: getLocalColor2('红色', 0x080820),
      name: '红色',
      helper: true,
      // intensity: getLocalNumber('红色', 5),
      // intensity: getLocalNumber('红色', 0.19),
      intensity: getLocalNumber('红色', 0.18),
      position: { x: 99.709, y: -43.377, z: 14.05 },
      rotation: { x: 90, y: 0, z: 65.1 },
      width: 24.858,
      height: 29.83,
    },
    {
      color: 0xffffff,
      color2: 0xffff00,
      name: '黄色',
      helper: true,
      groundColor: getLocalColor2('黄色', 0x080820),
      // intensity: getLocalNumber('黄色', 25),
      // intensity: getLocalNumber('黄色', 0.66),
      intensity: getLocalNumber('黄色', 0.74),
      position: { x: 4.854, y: 111.291, z: 67.47 },
      rotation: { x: -67.439, y: 0, z: 0 },
      width: 24.858,
      height: 29.83,
    },
  ];

  // gui
  three.use(guiPlugin);
  // 渲染器
  three.use(scenePlugin);
  // 灯光平行-测试
  if (options.lightType) {
    lightList.forEach((item) => {
      three.use(light2Plugin, { ...item, lightType: options.lightType });
    });
  }
  // 灯光环境
  three.use(lightPlugin, {
    intensity: lightIntensity,
    helper: false,
  });
  // 灯光环境贴图
  // three.use(lightMapPlugin);
  // 渲染器-需要:容器
  three.use(rendererPlugin);
  // 相机-需要:容器
  three.use(cameraPlugin);
  // 控制器-需要:相机,渲染器
  three.use(controlsPlugin);
  // 动画-需要:渲染器,场景,相机,控制器
  three.use(animatePlugin);
  // 模型
  three.use(modelPlugin);

  // 安装
  function use(plugin, options = {}) {
    const { install, uninstall } = plugin(options);
    three.pluginList.push({ install, uninstall });
    install(three, options);
    return three;
  }

  // 销毁
  function destroy() {
    three.container?.removeChild(three.renderer?.domElement);
    three.pluginList.reverse().forEach((plugin) => plugin.uninstall(three));
    three.renderer = null;
    three.camera = null;
    three.scene = null;
    three.controls = null;
    three.container = null;
    three.light = [];
  }

  return three;
}

// 场景
function scenePlugin() {
  function install(three) {
    three.scene = new THREE.Scene();
  }

  function uninstall(three) {
    three.scene = null;
  }

  return {
    install,
    uninstall,
  };
}

// 灯光平面
function light2Plugin(options = {}) {
  const _options = Object.assign(
    {
      color: 0xffffff,
      color2: 0xffffff,
      groundColor: 0x080820,
      intensity: 0.28,
      position: { x: 1, y: 1, z: 1 },
      rotation: { x: 1, y: 1, z: 1 },
      name: lightKey,
      helper: false,
      lightType: 'DirectionalLight',
    },
    options,
  );
  let light;
  let helper;
  // 平面光
  if (_options.lightType === 'DirectionalLight') {
    light = new THREE.DirectionalLight(_options.color, _options.intensity);
    if (_options.helper) {
      helper = new THREE.DirectionalLightHelper(light, 3, _options.color2);
    }
  }
  // 点光
  else if (_options.lightType === 'PointLight') {
    light = new THREE.PointLight(_options.color, _options.intensity, 100);
    if (_options.helper) {
      helper = new THREE.PointLightHelper(light, 3, _options.color2);
    }
  }
  // 聚光灯
  else if (_options.lightType === 'SpotLight') {
    light = new THREE.SpotLight(_options.color, _options.intensity);
    if (_options.helper) {
      helper = new THREE.SpotLightHelper(light);
    }
  }
  // 半球光
  else if (_options.lightType === 'HemisphereLight') {
    light = new THREE.HemisphereLight(_options.color, _options.groundColor, _options.intensity);
    if (_options.helper) {
      helper = new THREE.HemisphereLightHelper(light, 3);
    }
  }
  // 平面光
  else if (_options.lightType === 'RectAreaLight') {
    light = new THREE.RectAreaLight(_options.color, _options.intensity, _options.width / 10, _options.height / 10);
    light.lookAt(0, 0, 0);
    if (_options.helper) {
      helper = new RectAreaLightHelper(light);
    }
  }
  // light.position.set(_options.position.x / 10, _options.position.y / 10, _options.position.z / 10);
  // light.rotation.set(_options.rotation.x, _options.rotation.y, _options.rotation.z);
  const n = 10;
  // const n2 = 360;
  light.position.set(_options.position.x / n, _options.position.z / n, (_options.position.y * -1) / n);
  light.rotation.set(_options.rotation.x, _options.rotation.z, _options.rotation.y * -1);
  light.lookAt(0, 0, 0);

  function install(three) {
    if (!three.scene) {
      throw new Error('请先安装场景');
    }

    three.scene.add(light);
    helper && three.scene.add(helper);
    three.light.push({
      name: _options.name,
      light,
      destroy: () => {
        light.dispose();
        helper?.dispose();
        three.scene.remove(light);
      },
    });

    three.gui?.addLightRotation(light, _options.name);
    three.gui?.addLightIntensity(light, _options.name);
    if (_options.lightType === 'HemisphereLight') {
      three.gui?.addLightColor(light, _options.name);
      console.log(light);
    }
  }

  function uninstall(three) {
    const i = three.light.findIndex((item) => item.light === light);
    if (i > -1) {
      three.light[i].destroy();
      three.light.splice(i, 1);
    }
  }

  return {
    install,
    uninstall,
  };
}

// 灯光环境
function lightPlugin(options = {}) {
  const _options = Object.assign(
    {
      // 黄色
      color: 0xffffff,
      color2: 0xffff00,
      name: '环境',
      intensity: 0.28,
      helper: false,
    },
    options,
  );

  const light = new THREE.AmbientLight(_options.color, _options.intensity);
  function install(three) {
    if (!three.scene) {
      throw new Error('请先安装场景');
    }

    three.scene.add(light);
    three.light.push({
      light,
      destroy: () => {
        light.dispose();
        three.scene.remove(light);
      },
    });

    three.gui?.addLightIntensity(light, _options.name);
  }

  function uninstall(three) {
    const i = three.light.findIndex((item) => item.light === light);
    if (i > -1) {
      three.light[i].destroy();
      three.light.splice(i, 1);
    }
  }

  return {
    install,
    uninstall,
  };
}

// 灯光环境贴图
function lightMapPlugin() {
  function install(three) {
    if (!three.scene) {
      throw new Error('请先安装场景');
    }
    const texture = new THREE.TextureLoader().load('/img.png');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    three.scene.environment = texture;

    three.light.push({
      light: null,
      destroy: () => {
        texture.dispose();
        three.scene.environment = null;
      },
    });
  }

  function uninstall(three) {
    three.scene.environment?.dispose();
    three.scene.environment = null;
  }

  return {
    install,
    uninstall,
  };
}

// 渲染器
function rendererPlugin() {
  function install(three) {
    if (!three.container) {
      throw new Error('请先安装容器');
    }

    three.renderer = new THREE.WebGLRenderer({
      // 开启抗锯齿
      antialias: true,
      // 是否保留缓直到手动清除或被覆盖
      preserveDrawingBuffer: true,
      // 支持透明度
      alpha: true,
    });
    // 输出颜色空间
    // three.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // 背景透明
    three.renderer.setClearColor(0xffffff, 0);
    // 设置大小
    three.renderer.setSize(three.container.clientHeight, three.container.clientHeight);
    // 添加到容器
    three.container.appendChild(three.renderer.domElement);
  }

  function uninstall(three) {
    three.renderer?.dispose();
    three.renderer = null;
  }

  return {
    install,
    uninstall,
  };
}

// 相机
function cameraPlugin() {
  function install(three) {
    if (!three.container) {
      throw new Error('请先安装容器');
    }

    three.camera = new THREE.PerspectiveCamera(75, three.container.clientWidth / three.container.clientHeight, 0.1, 1000);
    // 相机的位置
    const cameraPosition = { x: 10, y: 10, z: 10 };
    // const cameraPosition = { x: -0.17555055293848368, y: 8.481830155644753, z: 21.0797620847989 };
    three.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    console.log(three.camera);

    const axesHelper = new THREE.AxesHelper(50);
    three.scene.add(axesHelper);

    // 焦距
    three.camera.setFocalLength(100);
  }

  function uninstall(three) {
    three.camera = null;
  }

  return {
    install,
    uninstall,
  };
}

// 控制器
function controlsPlugin() {
  function install(three) {
    if (!three.camera) {
      throw new Error('请先安装相机');
    }
    if (!three.renderer) {
      throw new Error('请先安装渲染器');
    }

    three.controls = new OrbitControls(three.camera, three.renderer.domElement);
  }

  function uninstall(three) {
    three.controls?.dispose();
    three.controls = null;
  }

  return {
    install,
    uninstall,
  };
}

// 动画
function animatePlugin() {
  function install(three) {
    if (!three.renderer) {
      throw new Error('请先安装渲染器');
    }
    if (!three.scene) {
      throw new Error('请先安装场景');
    }
    if (!three.camera) {
      throw new Error('请先安装相机');
    }
    if (!three.controls) {
      throw new Error('请先安装控制器');
    }

    let rid;
    function animate() {
      rid = requestAnimationFrame(animate);
      TWEEN.update();
      three.controls.update();
      three.renderer.render(three.scene, three.camera);
    }

    three.animate.start = animate;
    three.animate.pause = () => rid && cancelAnimationFrame(rid);
    three.animate.destroy = () => rid && cancelAnimationFrame(rid);
  }

  function uninstall(three) {
    three.animate.destroy();
  }

  return {
    install,
    uninstall,
  };
}

// 模型
function modelPlugin() {
  function install(three) {
    if (!three.scene) {
      throw new Error('请先安装场景');
    }

    three.model.load = async (options) => {
      const { model, meshList } = await loadModel(options);
      three.scene.add(model);
      three.model.model = model;
    };
  }

  function uninstall(three) {
    three.scene.traverse((child) => {
      if (child.material) {
        Object.keys(child.material).forEach((key) => {
          if (child.material[key]?.isTexture) {
            child.material[key].dispose();
          }
        });
        child.material.dispose();
      }
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.type === 'Mesh') {
        three.scene.remove(child);
        child?.clear();
      }
      child = null;
    });
    three.model.model = null;
  }

  return {
    install,
    uninstall,
  };
}

// 加载模型
function loadModel(options = {}) {
  const _options = Object.assign(
    {
      // 路径
      path: '',
      loading: ref(false),
      roughness: false,
    },
    options,
  );

  return new Promise((resolve, reject) => {
    // 模型
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    // opt.loadModelBefore && opt.loadModelBefore();
    _options.loading.value = true;
    loadModel(_options.path, loader)
      .then((m) => {
        // m.visible = false;
        // three.model = m;
        // three.scene.add(m);
        const meshList = [];
        m.traverse((child) => {
          if (child.isMesh) {
            if (_options.roughness) {
              if (child.material?.roughness < 0.45) {
                console.log('roughness-old', child.name, child.material?.roughness);
                child.material.roughness = 0.45;
                // console.log('roughness-new', child.name, child.material?.roughness);
              }
            }
            meshList.push(child);
          }
        });
        // opt.loadModelSuccess && opt.loadModelSuccess(m, meshList, this);
        resolve({ model: m, meshList: meshList });
        // 销毁解压器
        setTimeout(() => {
          dracoLoader?.dispose();
          // loader?.dispose();
        }, 500);
      })
      .catch((err) => {
        console.error('加载模型出现错误 e', err);
        Message.warning('加载模型出现错误');
        dracoLoader?.dispose();
        reject(false);
        // this.destroy();
      })
      .finally(() => {
        // opt.loadModelFinally && opt.loadModelFinally();
        _options.loading.value = false;
      });
  });

  // 加载模型
  function loadModel(path, loader) {
    return new Promise((resolve, reject) => {
      loader.load(
        path,
        function(gltf) {
          // 遍历模型
          gltf.scene.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              // // 构建包围盒(加速射线检测)
              // child.geometry.computeBoundsTree({
              //   strategy: 0, // 划分策略 CENTER(中间)-0 | AVERAGE(平均)-1 | SAH-2
              //   maxDepth: 40, // 最大树深度
              //   maxLeafTris: 1, // 最大叶子节点数量
              //   verbose: true, // 是否打印日志
              //   useSharedArrayBuffer: false, // 是否使用SharedArrayBuffer
              //   setBoundingBox: true, // 是否设置包围盒
              //   onProgress: null, // 进度回调
              //   indirect: false, // 是否使用indirect buffer
              // });

              // 材质名称赋值给子对象
              child.name = child.material.name;
            }
          });

          resolve(gltf.scene);
        },
        (xhr) => {
          // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function(error) {
          console.error('加载模型出现错误', error);
          reject(error);
        },
      );
    });
  }
}

// gui
function guiPlugin() {
  function install(three) {
    const gui = new GUI();
    const map = {};
    gui
      .add(config, 'radio', -5, 5)
      .step(0.001)
      .name('radio')
      .onChange((value) => {
        three.light.forEach((item) => {
          if (!map[item.name]) map[item.name] = item.light.intensity;
          item.light.intensity = map[item.name] * value;
        });
      });
    three.gui = {
      gui: gui,
      addLightRotation: (light, name) => {
        if (Reflect.has(light, 'width')) {
          // gui
          //   ?.add(light, 'power', -100, 100)
          //   .step(0.01)
          //   .name(`power${name}`)
          //   .onChange((value) => {
          //     // 缓存本地
          //     // localStorage.setItem(`width${name}`, value);
          //     light.power = value;
          //   });
          // gui
          //   ?.add(light, 'width', -100, 100)
          //   .step(0.01)
          //   .name(`width${name}`)
          //   .onChange((value) => {
          //     // 缓存本地
          //     // localStorage.setItem(`width${name}`, value);
          //     light.width = value;
          //   });
          // gui
          //   ?.add(light, 'height', -100, 100)
          //   .step(0.01)
          //   .name(`height${name}`)
          //   .onChange((value) => {
          //     // 缓存本地
          //     // localStorage.setItem(`height${name}`, value);
          //     light.height = value;
          //   });
        }
        // gui
        //   ?.add(light.rotation, 'x', -100, 100)
        //   .step(0.01)
        //   .name(`rotation.x${name}`)
        //   .onChange((value) => {
        //     // 缓存本地
        //     localStorage.setItem(`rotation.x${name}`, value);
        //     light.rotation.x = value;
        //   });
        // gui
        //   ?.add(light.rotation, 'y', -100, 100)
        //   .step(0.01)
        //   .name(`rotation.y${name}`)
        //   .onChange((value) => {
        //     // 缓存本地
        //     localStorage.setItem(`rotation.y${name}`, value);
        //     light.rotation.y = value;
        //   });
        // gui
        //   ?.add(light.rotation, 'z', -100, 100)
        //   .step(0.01)
        //   .name(`rotation.z${name}`)
        //   .onChange((value) => {
        //     // 缓存本地
        //     localStorage.setItem(`rotation.z${name}`, value);
        //     light.rotation.z = value;
        //   });
      },
      addLightIntensity: (light, name) => {
        gui
          ?.add(light, 'intensity', -50, 50)
          .step(0.01)
          .name(`intensity${name}`)
          .onChange((value) => {
            // 缓存本地
            // localStorage.setItem(`intensity${name}`, value);
            light.intensity = value * config.radio;
          });
      },
      // 半球光的颜色
      addLightColor: (light, name) => {
        gui
          ?.addColor(light, 'color')
          .name(`color1${name}`)
          .onChange((value) => {
            console.log('value', value);
            // 缓存本地
            localStorage.setItem(`color1${name}`, value);
            light.color.set(value);
          });
        gui
          ?.addColor(light, 'groundColor')
          .name(`color2${name}`)
          .onChange((value) => {
            // 缓存本地
            localStorage.setItem(`color2${name}`, value);
            light.color.set(value);
          });
      },
    };
  }

  function uninstall(three) {
    // 销毁之前的gui
    three.gui?.gui?.destroy();

    three.gui = null;
  }

  return {
    install,
    uninstall,
  };
}
