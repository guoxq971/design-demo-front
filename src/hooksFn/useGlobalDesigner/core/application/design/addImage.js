import { cloneDeep } from 'lodash';
import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/application/design/imageSize';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useImage } from '@vueuse/core';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { getScaleMax } from '@/hooksFn/useGlobalDesigner/core/application/design/scaleMax';
import { loadImage } from '@/hooksFn/useGlobalDesigner/core/application/design/loadImage';
import { nextTick } from 'vue';
import { createDesign } from '@/hooksFn/useGlobalDesigner/core/application/design/createDesign';

/**
 * 添加图片
 * @typedef {import('d').view.addImage}
 * @param {import('d').designImageDetail} detail
 * @param {import('d').view} view
 * @param {import('d').addImageOptions} options
 */
export async function addImage(detail, view, options = {}) {
  options = Object.assign(
    {
      isCenter: true,
      isSetMode: true,
      isSet: true,
      attrs: {},
    },
    options,
  );
  if (!detail.isBg) {
    _addImage(detail, view, options);
  } else {
    const pAll = view.$template.viewList.map((v) => {
      return _addImage(detail, v, {
        ...options,
        isSetMode: false,
        isSet: false,
        attrs: {
          ...options.attrs,
          type: useDesignerAppConfig().design_type_background_image,
        },
      });
    });
    Promise.all(pAll).then((_) => {
      options.isSetMode && view.setMode(useDesignerAppConfig().mode_type_edit);
      if (options.isSet) {
        const design = view.designList.find((d) => d.isBackgroundImage);
        options.isSet && view.setNode(design);
      }
    });
  }
}

/**
 * 添加图片
 * @param {import('d').designImageDetail} detail
 * @param {import('d').view} view
 * @param {import('d').addImageOptions} options
 */
async function _addImage(detail, view, options = {}) {
  // 获取父级节点
  const parentNode = view.canvasNodes.designGroup;
  // 获取图片解析后的尺寸
  const imageSize = getImageSize(detail.size, view.$template.detail.dpi, view);
  const { width, height } = imageSize.size;
  // 获取可用图片地址
  const src = AppUtil.getImageUrl(detail);
  // 加载图片
  const image = await loadImage(src, width, height);
  /**@type {import('d').design.node} 创建节点*/
  const node = new Konva.Image({
    draggable: true,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    visible: true,
    image: image,
    width: width,
    height: height,
    viewId: view.id,
    uuid: AppUtil.uuid(),
    offsetX: width / 2,
    offsetY: height / 2,
    type: useDesignerAppConfig().design_type_image,
    detail,
    ...options.attrs,
  });
  // 创建节点
  const design = createDesign(node, view);
  // 添加到父节点
  parentNode.add(node);
  // 添加到view
  view.designList.push(design);
  // 注册监听事件
  node.on('mousedown', () => {
    view.setNode(design);
    view.setMode(useDesignerAppConfig().mode_type_edit);
  });
  // 设置选中
  options.isSet && view.setNode(design);
  // 居中
  options.isCenter && design.center();
  // 触发更新canvas
  view.update2DCanvasDebounce();
  // 设置模式
  options.isSetMode && view.setMode(useDesignerAppConfig().mode_type_edit);
  // 设置index
  view.setDesignListIndex();
}
