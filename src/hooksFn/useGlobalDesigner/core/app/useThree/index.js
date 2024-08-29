import { getMaterialName, getMeshByViewId, getViewByMaterialName, updateMesh } from '@/hooksFn/useGlobalDesigner/core/app/useThree/updateMesh';
import { useDebounceFn } from '@vueuse/core';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { registerMouseEvent } from '@/hooksFn/useGlobalDesigner/core/app/useThree/registerMouseEvent';
import { CreateThree } from '@/hooksFn/useGlobalDesigner/core/app/useThree/CreateThree';

/**
 * 创建3d
 * @param {Template} template
 */
export function createTemplateThree(template) {
  const app = useGlobalDesigner().app;
  const options = {
    path: process.env.VUE_APP_API_BASE_IMG_URL + template.config.glbPath,
    container: document.getElementById('three-container'),
    loadModelBefore: () => (app.threeLoading.value = true),
    loadModelFinally: () => (app.threeLoading.value = false),
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
 * @param {Template} template
 * @param {THREE.Mesh[]} meshModelList
 */
async function bindMaterials(template, meshModelList) {
  meshModelList.forEach((mesh) => {
    const materialName = getMaterialName(mesh);
    updateMesh(mesh, getViewByMaterialName(materialName), template);
  });

  // 注册更新材质事件
  function update(viewId) {
    const mesh = getMeshByViewId(viewId, meshModelList);
    const view = ['string', 'number'].includes(typeof viewId) ? getViewByMaterialName(getMaterialName(mesh)) : viewId;
    updateMesh(mesh, view, template);
  }
  const fn = useDebounceFn((o) => {
    if (!o.isAll) {
      update(o.viewId);
    } else {
      template.viewList.forEach((view) => {
        update(view.id);
      });
    }
  }, 100);
  useGlobalDesigner().app.watchBase64Event.on((o) => fn(o));
}
