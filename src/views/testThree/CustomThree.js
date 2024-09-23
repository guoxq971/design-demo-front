import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as TWEEN from '@tweenjs/tween.js';
import { isRef } from 'vue';

// 创建自定义three
export async function createCustomThree(options = {}) {
  options = Object.assign(
    {
      // 容器 string | HTMLElement | Ref
      container: null,
    },
    options,
  );

  if (!options.container) {
    console.error('容器不能为空');
    return;
  }

  const obj = {
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
    // 灯光
    light: [],
    // 灯光贴图
    lightMap: {
      texture: null,
      destroy: null,
    },
    // 模型
    model: null,
    // 加载模型
    loadModel: (options = {}) => loadModel(obj, options),
    // 动画
    animate: {
      open: null,
      close: null,
      animate: null,
      start: null,
      destroy: null,
    },
  };

  //容器-可选
  obj.container = useContainer(options.container);
  //场景-固定
  obj.scene = useScene();
  //渲染器-固定
  obj.renderer = useRenderer(obj.container);
  //相机-可选
  obj.camera = useCamera({ width: obj.container.clientWidth, height: obj.container.clientHeight });
  //灯光-可选
  const ambientLight = useLight();
  obj.light.push(ambientLight);
  obj.scene.add(ambientLight);
  //灯光贴图-可选
  obj.lightMap = await useLightMap(obj.scene);
  //模型-可选
  //控制器-可选
  obj.controls = useControls(obj.camera, obj.renderer);
  //动画-可选
  obj.animate = useAnimate(obj);

  return obj;
}

// 容器
function useContainer(container) {
  let result = null;
  if (typeof container === 'string') {
    result = document.getElementById(container);
  } else if (container instanceof HTMLElement) {
    result = container;
  } else if (isRef(container) && container.value instanceof HTMLElement) {
    result = container.value;
  } else {
    //抛出错误
    console.error('容器错误');
  }

  return result;
}

// 场景
function useScene() {
  const scene = new THREE.Scene();

  return scene;
}

// 渲染器
function useRenderer(container) {
  const renderer = new THREE.WebGLRenderer({
    // 开启抗锯齿
    antialias: true,
    // 是否保留缓直到手动清除或被覆盖
    preserveDrawingBuffer: true,
    // 支持透明度
    alpha: true,
  });
  // 输出颜色空间
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // 背景透明
  renderer.setClearColor(0xffffff, 0);
  // 设置大小
  renderer.setSize(container.clientHeight, container.clientHeight);
  // 添加到容器
  container.appendChild(renderer.domElement);

  return renderer;
}

// 相机
function useCamera(options = {}) {
  options = Object.assign(
    {
      // 宽高
      width: window.innerWidth,
      height: window.innerHeight,
      // 相机位置
      position: {
        x: 0.2441494280198129,
        y: 6.984721641900398,
        z: 19.279703086558378,
      },
      // 焦距
      focal: 100,
    },
    options,
  );
  const camera = new THREE.PerspectiveCamera(75, options.width / options.height, 0.1, 1000);
  // 相机的位置
  camera.position.set(options.position.x, options.position.y, options.position.z);
  // 焦距
  camera.setFocalLength(options.focal);

  return camera;
}

// 控制器
function useControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  return controls;
}

// 灯光
function useLight(options = {}) {
  options = Object.assign(
    {
      // 灯光强度
      intensity: 0.41,
    },
    options,
  );
  const light = new THREE.AmbientLight(0xffffff, options.intensity);

  return light;
}

// 灯光贴图
async function useLightMap(scene) {
  const hdr = '/img.png';
  const hdrLoader = new THREE.TextureLoader();
  // eslint-disable-next-line no-unused-vars
  return new Promise(async (resolve, reject) => {
    try {
      const texture = await loadHdr(hdr, hdrLoader);
      if (scene) {
        scene.environment = texture;
      }

      function destroy() {
        texture.dispose();
      }

      resolve({
        texture,
        destroy,
      });
    } catch (e) {
      console.error('加载灯光贴图出现错误', e);
      reject(e);
    }
  });

  /**
   * 加载场景贴图
   */
  function loadHdr(path, loader) {
    // 类型
    let fileType = path.split('.').pop();
    if (['jpg', 'png', 'jpeg', 'gif', 'bmp', 'tga', 'svg'].includes(fileType)) {
      fileType = 'img';
    }
    return new Promise((resolve, reject) => {
      // 加载贴图
      // fileLoaderMap[fileType]?.load(
      loader.load(
        path,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          // three.scene.environment = texture;
          // three.scene.background = texture; // 背景贴图
          // three.scene.backgroundIntensity = 1; // 背景强度
          // three.scene.backgroundBlurriness = 0; // 背景模糊度
          // texture.dispose();
          resolve(texture);
        },
        // 加载
        () => {},
        (err) => {
          // alert('文件错误');
          // console.error(err);
          reject(err);
        },
      );
    });
  }
}

// 动画
function useAnimate(options = {}) {
  options = Object.assign(
    {
      controls: null,
      renderer: null,
      scene: null,
      camera: null,
    },
    options,
  );
  let rid = null;
  let animateFlag = true;

  function animate(time) {
    rid = requestAnimationFrame(animate);
    if (animateFlag) {
      TWEEN.update(time);
      options.controls.update();
      options.renderer.render(options.scene, options.camera);
    }
  }

  function open() {
    animateFlag = true;
  }

  function close() {
    animateFlag = false;
  }

  function start() {
    animate();
  }

  // animate();

  function destroy() {
    // 停止动画
    rid && cancelAnimationFrame(rid);
  }

  return {
    rid,
    animateFlag,
    animate,
    open,
    close,
    destroy,
    start,
  };
}

// 加载模型
function loadModel(three, options = {}) {
  const _options = Object.assign(
    {
      // 路径
      path: '',
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
    loadModel(_options.path, loader)
      .then((m) => {
        // m.visible = false;
        three.model = m;
        three.scene.add(m);
        const meshList = [];
        m.traverse((child) => {
          if (child.isMesh) {
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
        reject(false);
        // this.destroy();
      })
      .finally(() => {
        // opt.loadModelFinally && opt.loadModelFinally();
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
