import * as THREE from 'three';
import { loadHdr, loadModel } from './threeUtil';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as TWEEN from '@tweenjs/tween.js';

// 相机焦距
export const THREE_CAMERA_FOCAL_LENGTH = 50;
function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class Test {
  fnUid = getUuid();
  rid;
  container;
  scene;
  camera;
  renderer;
  light;
  texture;
  model;
  controls;
  dracoLoader;
  loader;
  hdrLoader;
  animate;
  animateFlag = true;

  /**
   * 创建
   * @param opt.path {string} 模型路径
   * @param opt.container {HTMLElement} three的容器
   * @param {number} [opt.lightIntensity=0.28] 灯光强度
   * @param opt.loadModelBefore {function|null} 模型加载前
   * @param opt.loadModelSuccess {function|null} 模型加载成功
   * @param opt.loadModelFinally {function|null} 模型加载完成
   */
  create(opt) {
    opt = Object.assign(
      {
        path: '/3D-2267.glb', //模型路径
        container: null, //容器
        loadModelBefore: null,
        loadModelSuccess: null,
        loadModelFinally: null,

        hdr: '/img.png', //hdr路径
        id: '', //容器id
        lightIntensity: 0.28, //灯光强度
        createType: '', //创建类型
      },
      opt,
    );
    // console.log('灯光', opt.lightIntensity);
    // 容器
    this.container = opt.container || document.getElementById(opt.id);

    // 场景
    this.scene = new THREE.Scene();

    // 相机
    this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
    // 相机的位置
    let cameraPosition = { x: -1, y: 2, z: -4.5 };
    // 默认值放大3倍
    cameraPosition.x *= 3;
    cameraPosition.y *= 3;
    cameraPosition.z *= 3;
    this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    this.camera.setFocalLength(THREE_CAMERA_FOCAL_LENGTH);

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 开启抗锯齿
      powerPreference: 'high-performance', // 提高性能
      precision: 'highp', // 高精度渲染
      alpha: true, // 支持透明度
      // preserveDrawingBuffer: true, // 是否保留缓直到手动清除或被覆盖
    });
    // 背景透明
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(this.container.clientHeight, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // 控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // 灯光
    this.light = new THREE.AmbientLight(0xffffff, opt.lightIntensity);
    this.scene.add(this.light);
    this.hdrLoader = new THREE.TextureLoader();
    loadHdr(opt.hdr, this.hdrLoader).then((t) => {
      this.texture = t;
      if (this.scene) {
        this.scene.environment = t;
      }
    });

    // 模型
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('/draco/');
    this.dracoLoader.setDecoderConfig({ type: 'js' });
    this.loader = new GLTFLoader();
    this.loader.setDRACOLoader(this.dracoLoader);
    opt.loadModelBefore && opt.loadModelBefore();
    loadModel(opt.path, this.loader)
      .then((m) => {
        m.visible = false;
        this.model = m;
        this.scene.add(m);
        const meshList = [];
        m.traverse((child) => {
          if (child.isMesh) {
            meshList.push(child);
          }
        });
        opt.loadModelSuccess && opt.loadModelSuccess(m, meshList, this);
        // 销毁解压器
        setTimeout(() => {
          this.disposeDracoLoader();
        }, 500);
      })
      .catch((err) => {
        console.error('e', err);
        this.destroy();
      })
      .finally(() => {
        opt.loadModelFinally && opt.loadModelFinally();
      });

    // 动画
    const that = this;
    this.animate = function(time) {
      that.rid = requestAnimationFrame(that.animate);
      if (that.animateFlag) {
        TWEEN.update(time);
        that.controls.update();
        that.renderer.render(that.scene, that.camera);
      }
    };
    this.animate();
  }

  /**
   * 销毁3d
   */
  destroy() {
    if (!this.scene) return;
    // 停止动画
    this.rid && cancelAnimationFrame(this.rid);

    // 移除dom元素
    this.container?.removeChild(this.renderer.domElement);

    // 销毁hdr
    this.texture?.dispose();
    this.scene.environment?.dispose();
    this.scene.background?.dispose();
    this.scene.environment = null;
    this.scene.background = null;
    this.texture = null;

    // 销毁模型
    this.scene.traverse((child) => {
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
        this.scene.remove(child);
        child?.clear();
      }
      child = null;
    });

    // 清除渲染器相关资源
    this.renderer.forceContextLoss();
    this.renderer.context = null;
    this.renderer.domElement = null;

    // 释放解压器内存
    this.dracoLoader?.dispose();

    // 销毁灯光
    this.light?.dispose();

    this.scene.clear();
    this.renderer.dispose();
    THREE.Cache.clear();

    // 变量置空，释放内存，垃圾回收
    Object.keys(this).forEach((key) => {
      this[key] = null;
    });
    // this = null;
  }

  /**
   * 销毁解压器
   */
  disposeDracoLoader() {
    this.dracoLoader?.dispose();
  }
}
