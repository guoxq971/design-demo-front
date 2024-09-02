import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/application/design/imageSize';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { loadImage } from '@/hooksFn/useGlobalDesigner/core/application/design/loadImage';
import { createDesign } from '@/hooksFn/useGlobalDesigner/core/application/design/createDesign';
import { Message } from 'element-ui';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

/**
 * 添加图片
 * @typedef {import('d').view.addImage}
 * @param {import('d').designImageDetail} detail
 * @param {import('d').view} view
 * @param {import('d').addImageOptions} options
 * @returns {Promise<import('d').design>}
 */
export async function addImage(detail, view, options = {}) {
  options = Object.assign(
    {
      isCenter: true,
      isSetMode: true,
      isSet: true,
      isSort: true,
      attrs: {},
      attrsList: [],
    },
    options,
  );
  if (!detail.isBg) {
    if (!imgMax(view)) return Promise.reject('设计图数量限制');
    return await _addImage(detail, view, options);
  } else {
    if (!bgImgMax(view)) return Promise.reject('背景图数量限制');
    const pAll = view.$template.viewList.map((v) => {
      let attrs = options.attrsList.find((a) => a.viewId === v.id);
      // 优先使用view的attrs
      if (!attrs) attrs = options.attrs;
      return _addImage(detail, v, {
        ...options,
        isSetMode: false,
        isSet: false,
        attrs: {
          ...attrs,
          type: useDesignerAppConfig().design_type_background_image,
        },
      });
    });
    await Promise.all(pAll);
    options.isSetMode && view.setMode(useDesignerAppConfig().mode_type_edit);
    if (options.isSet) {
      const design = view.designList.find((d) => d.isBackgroundImage);
      options.isSet && view.setNode(design);
    }
  }
}

/**
 * 背景图限制
 * @param {import('d').view} view
 * @returns {boolean} 是否通过 true:通过 false:不通过
 */
function bgImgMax(view = null) {
  // 设计图数量限制
  for (let i = 0; i < view.$template.viewList.length; i++) {
    const v = view.$template.viewList[i];
    if (v.designList.filter((d) => !d.isBackgroundColor).length >= 5) {
      Message.warning(`每个图层最多5张设计图, 图层${i + 1}已达到最大数量`);
      return false;
    }
  }
  // 背景图唯一限制
  const isSome = view.designList.some((d) => d?.detail?.isBg);
  if (isSome) {
    Message.warning('背景图已存在,只能添加一个背景图');
    return false;
  }
  return true;
}

/**
 * 设计图限制
 * @param {import('d').view} view
 * @returns {boolean} 是否通过 true:通过 false:不通过
 */
function imgMax(view = null) {
  // 设计图数量限制
  if (view.designList.filter((d) => !d.isBackgroundColor).length >= 5) {
    Message.warning('每个图层最多5张设计图');
    return false;
  }
  return true;
}

/**
 * 添加图片
 * @param {import('d').designImageDetail} detail
 * @param {import('d').view} view
 * @param {import('d').addImageOptions} options
 */
async function _addImage(detail, view, options = {}) {
  // 获取父级节点
  const parentNode = detail.isBg ? view.canvasNodes.bgGroup : view.canvasNodes.designGroup;
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
  options.isSort && view.setDesignListIndex();

  return design;
}
