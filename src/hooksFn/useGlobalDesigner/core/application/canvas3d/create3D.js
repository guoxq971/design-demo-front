import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { CreateThree } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/createThree';
import { getMaterialName, updateMesh } from './updateMesh';
import { useDebounceFn } from '@vueuse/core';
import * as THREE from 'three';
import { registerMouseEvent } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/registerMouseEvent';

/**
 * 创建3D
 * @typedef {import('d').template.create3D}
 * @param {import('d').template} template
 */
export function create3D(template) {
  if (!template.is3d) {
    return;
  }
  const container = document.getElementById(useDesignerAppConfig().three_container_id);
  if (!container) {
    console.error('3d容器不存在');
    return;
  }
  const options = {
    path: process.env.VUE_APP_API_BASE_IMG_URL + template.config.glbPath,
    container: container,
    loadModelBefore: () => (useDesignerApplication().threeLoading.value = true),
    loadModelFinally: () => (useDesignerApplication().threeLoading.value = false),
    loadModelSuccess: (model, meshModelList) => {
      // 绑定材质
      bindMaterials(template, meshModelList);
      // 显示模型
      setTimeout(() => model && (model.visible = true), 0);
      // 绑定事件
      template.three.destroyMouse = registerMouseEvent(template.three.renderer.domElement);
    },
  };
  template.three = new CreateThree();
  template.three.create(options);
}

/**
 * 绑定材质
 * @param {import('d').template} template
 * @param {THREE.Mesh[]} meshModelList
 */
async function bindMaterials(template, meshModelList) {
  // 初始化更新
  meshModelList.forEach((mesh) => {
    const materialName = getMaterialName(mesh);
    const view = template.getViewByMaterialName(materialName);
    if (view) view.mesh.value = mesh;
    updateMesh(mesh, view, template);
  });

  // 给view注册更新材质事件
  template.viewList.forEach((view) => {
    /**@type {import('d').update3DCanvas}*/
    view.update3DCanvas = () => updateMesh(view.mesh.value, view, template);
    /**@type {import('d').update3DCanvasDebounce}*/
    view.update3DCanvasDebounce = useDebounceFn(view.update3DCanvas, 100);
  });
}
