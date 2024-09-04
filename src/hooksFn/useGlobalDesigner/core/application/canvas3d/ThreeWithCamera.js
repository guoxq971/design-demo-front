import * as THREE from 'three';
import { loadHdr, loadModel } from './threeUtil';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { nextTick } from 'vue';

export class ThreeWithCamera {
  rid;
  container;
  scene;
  camera;
  /**@type THREE.WebGLRenderer*/
  renderer;
  light;
  texture;
  model;
  controls;
  dracoLoader;
  loader;
  hdrLoader;
  animate;

  /**
   * 创建
   * @param opt.path {string} 模型路径
   * @param opt.container {HTMLElement} three的容器
   * @param opt.loadModelBefore {(function|null)=} 模型加载前
   * @param opt.loadModelSuccess {(function|null)=} 模型加载成功
   * @param opt.loadModelFinally {(function|null)=} 模型加载完成
   * @returns {Promise<void>}
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
        lightIntensity: 0.41, //灯光强度
        createType: '', //创建类型
      },
      opt,
    );

    // 容器
    this.container = opt.container || document.getElementById(opt.id);

    // 场景
    this.scene = new THREE.Scene();

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 开启抗锯齿
      preserveDrawingBuffer: true, // 是否保留缓直到手动清除或被覆盖
      alpha: true, // 支持透明度
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; // 输出颜色空间
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.setSize(this.container.clientHeight, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);

    // 灯光
    this.light = new THREE.AmbientLight(0xffffff, opt.lightIntensity);
    this.scene.add(this.light);
    this.hdrLoader = new THREE.TextureLoader();
    loadHdr(opt.hdr, this.hdrLoader).then((t) => {
      nextTick(() => {
        this.texture = t;
        if (this.scene) {
          this.scene.environment = t;
        }
      });
    });

    // 模型
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('/draco/');
    this.dracoLoader.setDecoderConfig({ type: 'js' });
    this.loader = new GLTFLoader();
    this.loader.setDRACOLoader(this.dracoLoader);
    // 模型回调--加载前
    opt.loadModelBefore && opt.loadModelBefore();
    return loadModel(opt.path, this.loader)
      .then((m) => {
        if (!m) {
          console.error('模型加载失败1');
          return Promise.reject('模型加载失败1, 未找到模型');
        }
        const model = m?.children?.find((e) => e.isGroup || e.type === 'Mesh');
        if (!model) {
          console.error('模型加载失败2');
          return Promise.reject('模型加载失败2, 未找到模型');
        }
        const camera = m?.children?.find((e) => e.isCamera);
        if (!camera) {
          console.error('模型加载失败3');
          return Promise.reject('模型加载失败3, 未找到相机');
        }
        this.model = model;
        this.camera = camera;

        this.scene.add(this.camera);
        this.scene.add(this.model);
        const meshList = [];
        this.model.traverse((child) => {
          if (child.isMesh) {
            meshList.push(child);
          }
        });
        // console.log('鞋带相机的模型加成成功');
        // 更新
        // this.renderer.render(this.scene, this.camera);
        // 模型回调--加载成功
        opt.loadModelSuccess && opt.loadModelSuccess(this.model, meshList, this);
        // console.log('模型加载成功 this.model', this.model);
        // 销毁解压器
        setTimeout(() => {
          this.disposeDracoLoader();
        }, 500);
      })
      .catch((e) => {
        this.destroy();
        console.error('创建带相机的模型加载失败', e);
        return Promise.reject('创建带相机的模型加载失败');
      })
      .finally(() => {
        opt.loadModelFinally && opt.loadModelFinally();
      });
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

  /**
   * 获取截图
   */
  exportBase64() {
    if (!this.renderer) return '';
    return this.renderer.domElement.toDataURL();
  }
}
