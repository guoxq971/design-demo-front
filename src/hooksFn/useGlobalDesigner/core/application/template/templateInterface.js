import { create3D } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/create3D';
import { getViewByMaterialName } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/updateMesh';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { isRef, nextTick } from 'vue';
import { cloneDeep } from 'lodash';
import { sleep, syncAttrs, unsleep } from '@/hooksFn/useGlobalDesigner/core/application/template/sleep';
import { destroy } from '@/hooksFn/useGlobalDesigner/core/application/template/destroy';
import { renderMulti } from '@/hooksFn/useGlobalDesigner/core/application/template/multi';
import { getSubmitData } from '@/hooksFn/useGlobalDesigner/core/application/template/getSubmitData';
import { createMulti3D } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/createMulti3D';

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
    sizeType: '',
    type: '',
    is3d: false,
    sleep: false,
    config: null,
    viewList: [],
    exportConfig: [],
    isGetExportConfig: false,
    colorList: [],
    sizeList: [],
    multi2DList: [],
    multi3DList: [],
  };
  /**@typedef {import('d').template.destroy}*/
  template.destroy = () => destroy(template);
  /**@typedef {import('d').template.create3D}*/
  template.create3D = () => create3D(template);
  /**@typedef {import('d').template.createMulti3D}*/
  template.createMulti3D = () => createMulti3D(template);
  /**@typedef {import('d').template.getViewByMaterialName}*/
  template.getViewByMaterialName = (materialName) => getViewByMaterialName(materialName, template);
  /**@typedef {import('d').template.sleep}*/
  template.sleep = () => sleep(template);
  /**@typedef {import('d').template.syncAttrs}*/
  template.syncAttrs = () => syncAttrs(template);
  /**@typedef {import('d').template.unsleep}*/
  template.unsleep = () => unsleep(template);
  /**@typedef {import('d').template.renderMulti}*/
  template.renderMulti = () => renderMulti(template);
  /**@typedef {import('d').template.getSubmitData}*/
  template.getSubmitData = (saveType) => getSubmitData(template, saveType);
  /**@typedef {import('d').template.hasDesign}*/
  template.hasDesign = () => template.viewList.some((v) => v.designList.some((d) => d.attrs.visible));

  return template;
}
