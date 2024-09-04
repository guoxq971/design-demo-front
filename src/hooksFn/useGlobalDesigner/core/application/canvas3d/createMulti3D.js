import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { nextTick } from 'vue';
import { ThreeWithCamera } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/ThreeWithCamera';
import { getMaterialName } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/updateMesh';
import * as THREE from 'three';

/**
 * 创建多角度3D
 * @typedef {import('d').template.createMulti3D} template
 * @param {import('d').template} template
 */
export function createMulti3D(template) {
  if (!template.is3d) {
    console.error('创建多角度3D失败, 不是3D模板');
    return;
  }
  if (!template.detail) {
    console.error('创建多角度3D失败, 模板详情不存在');
    return;
  }
  if (!template.detail['3dAngleList']) {
    console.error('创建多角度3D失败, 3dAngleList不存在');
    return;
  }

  const list = template.detail['3dAngleList'].filter((item) => item.size === template.size);
  if (!list.length) {
    console.error(`创建多角度3D失败, ${template.size}尺码的3dAngleList不存在`);
    return;
  }

  // 取值当前颜色的多角度图列表
  const multiImageList = useDesignerApplication().activeColor.value.multiImageList;

  // 匹配上对应的3d配置
  /**@type {import('d').template.multi3DList}*/
  template.multi3DList = multiImageList
    .map((item) => {
      const d = list.find((a) => item.bgImg.split('_').find((v) => v === a.angleName));
      if (!d) return null;
      const result = {
        config: d,
        colorMultiItem: item,
        three: null,
        loading: false,
        multiId: item.multiId,
        composeId: item.composeId,
        updateMeshObj: {},
      };

      return result;
    })
    .filter(Boolean);
  // console.log('创建多角度3D template.multi3DList', template.multi3DList);

  if (template.multi3DList.length) {
    nextTick(() => {
      template.multi3DList.forEach(
        /**@param{import('d').multi3D}item*/
        (multi3D) => {
          const container = document.getElementById(useDesignerAppConfig().getMultiContainerId(multi3D.colorMultiItem.id));
          multi3D.three = new ThreeWithCamera();
          /**@typedef{import('d').threeTemplateOptions}*/
          const options = {
            path: process.env.VUE_APP_API_BASE_IMG_URL + multi3D.config.glbPath,
            container,
            loadModelBefore: () => (multi3D.loading = true),
            loadModelFinally: () => (multi3D.loading = false),
            loadModelSuccess: (_, meshModelList) => {
              // meshModelList中和view绑定的材质名称一致的mesh
              template.viewList.forEach(
                /**@param {import('d').view} view*/
                (view) => {
                  if (view.textureCanvas) {
                    const mesh = meshModelList.find((mesh) => getMaterialName(mesh) === view.getMaterialName());
                    if (mesh) {
                      // 绑定到材质上
                      const texture = new THREE.CanvasTexture(view.textureCanvas);
                      texture.colorSpace = THREE.SRGBColorSpace;
                      texture.flipY = false;
                      mesh.material.map = texture;
                      mesh.material.needsUpdate = true;

                      // 更细材质
                      const three = multi3D.three;
                      three.renderer.render(three.scene, three.camera);

                      // 注册更新
                      // console.log('注册更新', view.id);
                      multi3D.updateMeshObj[view.id] = () => {
                        mesh.material.map.needsUpdate = true;
                        three.renderer.render(three.scene, three.camera);
                      };
                    }
                  }
                },
              );
            },
          };
          multi3D.three.create(options);
        },
      );
    });
  }
}
