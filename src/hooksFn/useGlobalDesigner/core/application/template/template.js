import { create3D } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/create3D';
import { getViewByMaterialName } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/updateMesh';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { isRef, nextTick } from 'vue';
import { cloneDeep } from 'lodash';
import { sleep, unsleep } from '@/hooksFn/useGlobalDesigner/core/application/template/sleep';

/**
 * 获取模板的基础数据
 * @returns {import('d').template}
 * */
export function getTemplateInterface() {
  /**@type {import('d').template}*/
  const template = {
    uuid: AppUtil.uuid(),
    id: '',
    templateNo: '',
    detail: null,
    size: '',
    type: '',
    is3d: false,
    sleep: false,
    config: null,
    viewList: [],
    colorList: [],
    sizeList: [],
  };
  /**@typedef {import('d').template.destroy}*/
  template.destroy = () => {
    template.viewList.forEach((view) => {
      /**@typedef {import('d').view.destroy}*/
      view.destroy();
    });
    template.three?.destroy();
  };
  /**@typedef {import('d').template.create3D}*/
  template.create3D = () => create3D(template);
  /**@typedef {import('d').template.getViewByMaterialName}*/
  template.getViewByMaterialName = (materialName) => getViewByMaterialName(materialName, template);
  /**@typedef {import('d').template.sleep}*/
  template.sleep = () => sleep(template);
  /**@typedef {import('d').template.unsleep}*/
  template.unsleep = () => unsleep(template);

  return template;
}
