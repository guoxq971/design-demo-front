import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import * as THREE from 'three';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useDesignerContainerEl } from '@/hooksFn/useGlobalDesigner/core/contaienr';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

/**
 * 获取模型材质名称
 * @param {THREE.Mesh} mesh
 * @returns {string}
 */
export function getMaterialName(mesh) {
  return mesh.name.split('.')[0];
}

/**
 * 初始化mesh
 * @param {THREE.Mesh} mesh
 * @param {import('d').view} view
 * @param {import('d').template} template
 */
export function updateMesh(mesh, view = null, template = null) {
  // console.log('updateMesh', mesh, view, template);
  const materialName = getMaterialName(mesh);
  const color = getThreeMeshColorByMaterialName(materialName, template);

  let textureCanvas = view?.textureCanvas;
  let designCanvas = view?.canvasNodes.designLayer;

  // 如果没有textureCanvas, 创建一个(默认只有底色)
  if (!textureCanvas) {
    textureCanvas = document.createElement('canvas');
    // 绑定到vue数据上
    if (view) {
      view.textureCanvas = textureCanvas;
    }
    const width = useDesignerAppConfig().three_canvas_size;
    const height = useDesignerAppConfig().three_canvas_size;
    textureCanvas.width = width;
    textureCanvas.height = height;
    const ctx = textureCanvas.getContext('2d');
    // 底色
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    // 绑定到材质上
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    mesh.material.map = texture;
    mesh.material.needsUpdate = true;
  }

  // 如果画布存在, 则绘制到画布上
  if (designCanvas) {
    // 设计区域画布宽度, 距离左上的偏移量
    const { containerRect } = useDesignerContainerEl();
    designCanvas = view.canvasNodes.designLayer._toKonvaCanvas({
      width: containerRect.value.drawWidth,
      height: containerRect.value.drawHeight,
      x: containerRect.value.offsetX,
      y: containerRect.value.offsetY,
      pixelRatio: useDesignerAppConfig().three_canvas_pixel_ratio,
    });
    const ctx = textureCanvas.getContext('2d');
    // 清空画布
    ctx.clearRect(0, 0, designCanvas.width, designCanvas.height);
    // 底色
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, designCanvas.width, designCanvas.height);
    // 设计
    ctx.drawImage(designCanvas._canvas, 0, 0);
    // 设置更新
    mesh.material.map.needsUpdate = true;
  }

  // 更新材质
  if (textureCanvas) {
    const three = template.three;
    three.renderer.render(three.scene, three.camera);
  }
}

/**
 * 获取模型材质的底色
 * @param {string} materialName
 * @param {import('d').template} template
 * @returns {string}
 */
export function getThreeMeshColorByMaterialName(materialName, template) {
  const activeColor = useDesignerApplication().activeColor.value;
  if (activeColor) {
    const colorConfigList = template.config.colorList;
    const colorConfig = colorConfigList.find((item) => item.colorName === activeColor.colorName);
    const colorCode = colorConfig?.list.find((item) => item.materialName === materialName)?.colorCode;
    if (colorCode) {
      return colorCode;
    }
  }
  return '#ffffff';
}

/**
 * 获取视图
 * @param {string} materialName
 * @param {import('d').template} template
 * @returns {import('d').view}
 */
export function getViewByMaterialName(materialName, template) {
  if (!template.is3d) return null;
  const viewList = template.viewList;
  const viewConfigList = template.config.viewList;
  const viewConfig = viewConfigList.find((item) => item.materialName === materialName);
  const view = viewList?.find((item) => item.id === String(viewConfig.viewId));
  return view;
}
