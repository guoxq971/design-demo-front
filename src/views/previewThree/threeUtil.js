import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

// 加速射线检测 (模型操作上操作不会卡顿)
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath('/draco/');
// dracoLoader.setDecoderConfig({ type: 'js' });
// const loader = new GLTFLoader();
// loader.setDRACOLoader(dracoLoader);

// const fileLoaderMap = {
//   hdr: new RGBELoader(),
//   exr: new EXRLoader(),
//   img: new THREE.TextureLoader(),
// };

/**
 * 加载模型
 */
export function loadModel(path, loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      path,
      function(gltf) {
        // 遍历模型
        gltf.scene.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            // 构建包围盒(加速射线检测)
            child.geometry.computeBoundsTree({
              strategy: 0, // 划分策略 CENTER(中间)-0 | AVERAGE(平均)-1 | SAH-2
              maxDepth: 40, // 最大树深度
              maxLeafTris: 1, // 最大叶子节点数量
              verbose: true, // 是否打印日志
              useSharedArrayBuffer: false, // 是否使用SharedArrayBuffer
              setBoundingBox: true, // 是否设置包围盒
              onProgress: null, // 进度回调
              indirect: false, // 是否使用indirect buffer
            });

            // 构建包围盒(加速射线检测)
            // child.geometry.computeBoundsTree();

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
        console.error(error);
        reject(error);
      },
    );
  });
}

/**
 * 加载场景贴图
 */
export function loadHdr(path, loader) {
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

/**
 1. dedicated worker
 2. 模型的释放（物体geometry, 材质material, 纹理texture）
 */
