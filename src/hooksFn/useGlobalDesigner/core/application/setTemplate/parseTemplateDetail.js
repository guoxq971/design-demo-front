import { create2dCanvas } from '@/hooksFn/useGlobalDesigner/core/application/create2dCanvas';
import { parseMulti } from '@/hooksFn/useGlobalDesigner/core/application/setTemplate/parseMulti';
import { setMode } from '@/hooksFn/useGlobalDesigner/core/application/viewUtil/setMode';
import { getTemplateInterface } from '@/hooksFn/useGlobalDesigner/core/application/setTemplate/template';
import { destroyView } from '@/hooksFn/useGlobalDesigner/core/application/setTemplate/destroy';
import { addImage } from '@/hooksFn/useGlobalDesigner/core/application/design/addImage';
import { setNode } from '@/hooksFn/useGlobalDesigner/core/application/viewUtil/setNode';
import { nextTick } from 'vue';
import { update2DCanvas } from '@/hooksFn/useGlobalDesigner/core/application/viewUtil/updateCanvas';
import { useDebounceFn } from '@vueuse/core';
import { addColor } from '@/hooksFn/useGlobalDesigner/core/application/design/addColor';

/**
 * 解析模板详情
 * @param {import('d').templateDetail} detail
 * @returns {import('d').template}
 */
export function parseTemplateDetail(detail) {
  const template = getTemplateInterface();
  template.id = detail.id;
  template.templateNo = detail.templateNo;
  template.detail = detail;

  template.viewList = detail.views.map((view) => {
    const print = detail.printAreas.find((e) => e.defaultView.id === view.id);
    const printout = detail.pointoutPrintAreas.find((e) => e.defaultView.id === view.id);

    const update2DCanvasDebounce = useDebounceFn(() => update2DCanvas(v), 100);
    /**@typedef {import('d').view}*/
    const v = {
      id: view.id,
      name: view.name,
      /**@type {import('d').design[]}*/
      designList: [],
      // 视图的父级模板
      $template: template,
      // 方法
      destroy: () => destroyView(v),
      /**@typedef {import('d').view.clearDesign}*/
      clearDesign: () => {
        v.designList.forEach((design) => design.remove());
        v.update2DCanvasDebounce();
      },
      /**@typedef {import('d').view.seNode}*/
      setNode: (design) => setNode(design, v),
      /**@typedef {import('d').view.setMode}*/
      setMode: (mode) => setMode(mode, v),
      /**@typedef {import('d').view.addImage}*/
      addImage: (detail, options = {}) => addImage(detail, v, options),
      /**@typedef {import('d').view.addColor}*/
      addColor: (color) => addColor(color, v),
      /**@typedef {import('d').view.removeDesign}*/
      removeDesign: (design) => {
        const index = v.designList.findIndex((d) => d === design);
        if (index > -1) {
          v.designList.splice(index, 1);
        }
      },
      /**@typedef {import('d').view.setDesignListIndex}*/
      setDesignListIndex: () => {
        nextTick(() => {
          v.designList.forEach((d, i) => (d.attrs.zIndex = d.node.index));
          v.designList.sort((a, b) => b.attrs.zIndex - a.attrs.zIndex);
        });
      },
      /**@typedef {import('d').view.update2DCanvas}*/
      update2DCanvas: () => update2DCanvas(v),
      /**@typedef {import('d').view.update2DCanvasDebounce}*/
      update2DCanvasDebounce: () => update2DCanvasDebounce(),
      create2DCanvas: () => create2dCanvas(v),

      // 基础属性
      print: print,
      printout: printout,
      offsetX: view.viewMaps[0].offset.x,
      offsetY: view.viewMaps[0].offset.y,
      width: print?.boundary?.size?.width,
      height: print?.boundary?.size?.height,
      printout_d: printout?.soft?.d,
      printout_v: printout?.soft?.v,
      print_d: print?.boundary?.soft?.content?.svg?.path?.d,
      print_width: print?.boundary?.size?.width,
      print_height: print?.boundary?.size?.height,
    };

    return v;
  });

  template.colorList = detail.appearances.map((color) => {
    return {
      id: color.id,
      colorName: color.name,
      colorCode: color.colors[0].value,
      colorCodeList: color.colors[0].value.split(','),
      viewImageList: color.views.map((view) => {
        return {
          id: view.id,
          texture: view.texture,
          image: view.image,
        };
      }),
      multiImageList: parseMulti(color),
    };
  });

  template.sizeList = detail.sizes.map((size) => {
    return {
      id: size.id,
      size: size.name,
      sizeType: size.sizeType,
    };
  });

  return template;
}
