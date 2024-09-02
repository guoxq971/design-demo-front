import { cloneDeep } from 'lodash';
import { nextTick } from 'vue';

/**
 * 同步属性
 * @typedef {import('d').view.syncAttrs}
 * @param {import('d').view} view
 */
export function syncViewAttrs(view) {
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
    // 文字
    design.attrs.fontSize = design.node.attrs.fontSize;
    design.attrs.fontFamily = design.node.attrs.fontFamily;
    design.attrs.fontItalic = design.node.attrs.fontItalic;
    design.attrs.fontWeight = design.node.attrs.fontWeight;
    design.attrs.textDecoration = design.node.attrs.textDecoration;
    design.attrs.text = design.node.attrs.text;
    if (design.isBackgroundImage) design.attrs.zIndex = -1;
    else if (design.isBackgroundColor) design.attrs.zIndex = -2;
    else design.attrs.zIndex = design.node.index;
  });
}
/**
 * 同步属性
 * @typedef {import('d').template.syncAttrs}
 * @param {import('d').template} template
 */
export function syncAttrs(template) {
  // 销毁2d
  template.viewList.forEach((view) => {
    // 保留2d设计数据
    view.syncAttrs();
  });
}

/**
 * 休眠
 * @typedef {import('d').template.sleep}
 * @param {import('d').template} template
 */
export function sleep(template) {
  template.isSleep = true;
  // 清除2dCanvas,3dCanvas,3dMesh,3dTexture;保存2d设计数据
  // 保留2d设计数据
  syncAttrs(template);
  // 销毁2d
  template.viewList.forEach((view) => {
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
}

/**
 * 恢复休眠
 * @typedef {import('d').template.unsleep}
 * @param {import('d').template} template
 */
export async function unsleep(template) {
  template.isSleep = false;
  // 2d
  /**@type {import('d').design[]}*/
  const bgImageList = [];
  let bgColor = '';
  for (const view of template.viewList) {
    // 2d设计
    const _designList = cloneDeep(view.designList);
    view.designList = [];
    // 设计图|文字
    for (const _design of _designList) {
      if (_design.isImage || _design.isText) {
        await view.addImage(_design.detail, {
          isCenter: false,
          isSet: false,
          isSetMode: false,
          isSort: false,
          attrs: _design.attrs,
        });
      }
    }
    // 背景图
    const bgImage = _designList.find((d) => d.isBackgroundImage);
    if (bgImage) bgImageList.push(bgImage);
    bgColor = _designList.find((d) => d.isBackgroundColor)?.attrs.fill;

    // 重置vue的视图排序
    nextTick(() => {
      view.designList.forEach((d, i) => {
        const oldDesign = _designList.find((old) => old.attrs.uuid === d.attrs.uuid);
        if (oldDesign) {
          d.node.zIndex(oldDesign.attrs.zIndex);
        }
      });
    });
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
}
