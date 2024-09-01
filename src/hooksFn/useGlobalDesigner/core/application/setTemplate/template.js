import { create3D } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/create3D';
import { getViewByMaterialName } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/updateMesh';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { isRef, nextTick } from 'vue';

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
  template.sleep = () => {
    template.isSleep = true;
    // 清除2dCanvas,3dCanvas,3dMesh,3dTexture;保存2d设计数据
    // 销毁2d
    template.viewList.forEach((view) => {
      // 保留2d设计数据
      view.designList.forEach((design) => {
        design.attrs.x = design.node.x();
        design.attrs.y = design.node.y();
        design.attrs.width = design.node.width();
        design.attrs.height = design.node.height();
        design.attrs.rotation = design.node.rotation();
        design.attrs.scaleX = design.node.scaleX();
        design.attrs.scaleY = design.node.scaleY();
        design.attrs.fill = design.node.attrs.fill;
        design.attrs.visible = design.node.attrs.visible;
        design.attrs.viewId = view.id;
        design.attrs.uuid = design.node.attrs.uuid;
        if (design.isBackgroundImage) design.attrs.zIndex = -1;
        else if (design.isBackgroundColor) design.attrs.zIndex = -2;
        else design.attrs.zIndex = design.node.index;
      });
      // 销毁2d设计节点
      view?.designList.forEach((design) => {
        design?.node?.destroy();
        design.node = null;
      });

      // 销毁2d canvas节点
      if (view.canvasNodes) {
        Object.keys(view.canvasNodes).forEach((key) => view.canvasNodes[key]?.destroy());
      }
      view.canvasNodes = null;

      // 销毁3d
      view?.textureCanvas?.remove();
      view.textureCanvas = null;
    });
    // 销毁3d
    template.three?.destroy();
    template.three = null;
  };
  /**@typedef {import('d').template.unsleep}*/
  template.unsleep = async () => {
    template.isSleep = false;
    // 2d
    /**@type {import('d').design[]}*/
    const bgImageList = [];
    let bgColor = '';
    for (const view of template.viewList) {
      // 2d设计
      const _designList = view.designList;
      _designList.reverse();
      view.designList = [];
      // 设计图|文字
      for (const design of _designList) {
        if (design.isImage || design.isText) {
          await view.addImage(design.detail, {
            isCenter: false,
            isSet: false,
            isSetMode: false,
            isSort: false,
            attrs: design.attrs,
          });
        }
      }
      // 背景图
      const bgImage = _designList.find((d) => d.isBackgroundImage);
      if (bgImage) bgImageList.push(bgImage);
      bgColor = _designList.find((d) => d.isBackgroundColor)?.attrs.fill;
    }
    // 背景色
    if (bgColor) template.viewList[0].addColor(bgColor);
    // 背景图
    if (bgImageList.length) {
      const attrsList = bgImageList.map((bgImage) => bgImage.attrs);
      await template.viewList[0].addImage(bgImageList[0].detail, {
        isCenter: false,
        isSet: false,
        isSetMode: false,
        isSort: false,
        attrsList,
      });
    }
  };

  return template;
}
