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
  view.update2DCanvas();
  // 设置模式
  options.isSetMode && view.setMode(useDesignerAppConfig().mode_type_edit);
  // 设置index
  view.setDesignListIndex();
}

/**
 * 创建设计
 * @param {import('d').design.node} node
 * @param {import('d').view} view
 * @return {design}
 */
function createDesign(node, view) {
  /**@type {import('d').design} 创建节点*/
  const design = {
    type: node.attrs.type,
    node: node,
    attrs: {
      uuid: node.attrs.uuid,
      fill: node.attrs.fill,
      detail: node.attrs.detail,
    },
    detail: node.attrs.detail,
    $view: view,
    $template: view.$template,
    collect: async () => {
      // 文字和背景色没有这个功能
      if (design.isText || design.isBackgroundColor) return;

      if (!node.attrs.detail.isBg) {
        if (useGlobalDesigner().collectImage.isCollect(node.attrs.detail)) {
          await useGlobalDesigner().collectImage.collectCancel(node.attrs.detail);
        } else {
          await useGlobalDesigner().collectImage.collect(node.attrs.detail);
        }
        useGlobalDesigner().collectImage.getList();
      } else {
        if (useGlobalDesigner().collectBgImage.isCollect(node.attrs.detail)) {
          await useGlobalDesigner().collectBgImage.collectCancel(node.attrs.detail);
        } else {
          await useGlobalDesigner().collectBgImage.collect(node.attrs.detail);
        }
        useGlobalDesigner().collectBgImage.getList();
      }
    },
    isCollect: () => {
      return useGlobalDesigner().collectImage.isCollect(node.attrs.detail);
    },
    visible: () => {
      const visible = node.visible();
      // 背景图
      if (design.isBackgroundImage) {
        view.$template.viewList.forEach((v) => {
          v.designList.forEach((d) => {
            if (d.isBackgroundImage) {
              d.node.visible(!visible);
              d.cancelActive();
              d.attrs.visible = !visible;
            }
          });
          v.setDesignListIndex();
          v.update2DCanvasDebounce();
        });
      }
      // 背景色
      else if (design.isBackgroundColor) {
        view.$template.viewList.forEach((v) => {
          v.designList.forEach((d) => {
            if (d.isBackgroundColor) {
              d.node.visible(!visible);
              d.cancelActive();
              d.attrs.visible = !visible;
            }
          });
          v.setDesignListIndex();
          v.update2DCanvasDebounce();
        });
      }
      // 图片|文字
      else {
        design.node.visible(!visible);
        design.cancelActive();
        design.attrs.visible = !visible;
        view.setDesignListIndex();
        view.update2DCanvasDebounce();
      }
    },
    moveToTop: () => {
      design?.node.moveToTop();
      view.setDesignListIndex();
      view.update2DCanvasDebounce();
    },
    moveToBottom: () => {
      design?.node.moveToBottom();
      view.setDesignListIndex();
      view.update2DCanvasDebounce();
    },
    moveUp: () => {
      design?.node.moveUp();
      view.setDesignListIndex();
      view.update2DCanvasDebounce();
    },
    moveDown: () => {
      design?.node.moveDown();
      view.setDesignListIndex();
      view.update2DCanvasDebounce();
    },
    remove: () => {
      // 背景图
      if (design.isBackgroundImage) {
        view.$template.viewList.forEach((v) => {
          v.designList.forEach((d) => {
            if (d.isBackgroundImage) {
              d.cancelActive();
              d?.node.destroy();
              v.removeDesign(d);
            }
          });
          v.setDesignListIndex();
          v.update2DCanvasDebounce();
        });
      }
      // 背景色
      else if (design.isBackgroundColor) {
        view.$template.viewList.forEach((v) => {
          v.designList.forEach((d) => {
            if (d.isBackgroundColor) {
              d.cancelActive();
              d?.node.destroy();
              v.removeDesign(d);
            }
          });
          v.setDesignListIndex();
          v.update2DCanvasDebounce();
        });
      }
      // 图片|文字
      else {
        design.cancelActive();
        design?.node.destroy();
        view.removeDesign(design);
        view.setDesignListIndex();
        view.update2DCanvasDebounce();
      }
    },
    center: () => {
      design?.node.x(view.width / 2);
      design?.node.y(view.height / 2);
      view.update2DCanvasDebounce();
    },
    centerX: () => {
      design?.node.x(view.width / 2);
      view.update2DCanvasDebounce();
    },
    centerY: () => {
      design?.node.y(view.height / 2);
      view.update2DCanvasDebounce();
    },
    scale: (n) => {
      design?.node.scaleX(n);
      design?.node.scaleY(n);
      view.update2DCanvasDebounce();
    },
    scaleUp: () => {
      // 翻转状态
      const flipX = design.node.scaleX() < 0 ? -1 : 1;
      const flipY = design.node.scaleY() < 0 ? -1 : 1;
      // 缩放
      const x = Math.abs(design.node.scaleX() + 0.01 * flipX);
      const y = Math.abs(design.node.scaleY() + 0.01 * flipY);
      design?.node.setAttrs({
        scaleX: x * flipX,
        scaleY: y * flipY,
      });
      view.update2DCanvasDebounce();
    },
    scaleDown: () => {
      // 翻转状态
      const flipX = design.node.scaleX() < 0 ? -1 : 1;
      const flipY = design.node.scaleY() < 0 ? -1 : 1;
      // 缩放
      const x = Math.abs(design.node.scaleX() - 0.01 * flipX);
      const y = Math.abs(design.node.scaleY() - 0.01 * flipY);
      design?.node.setAttrs({
        scaleX: x * flipX,
        scaleY: y * flipY,
      });
      view.update2DCanvasDebounce();
    },
    rotation: (n = 5) => {
      design?.node.rotation(n);
      view.update2DCanvasDebounce();
    },
    rotationLeft: (n = 5) => {
      design?.node.rotation(design.node.rotation() - n);
      view.update2DCanvasDebounce();
    },
    rotationRight: (n = 5) => {
      design?.node.rotation(design.node.rotation() + n);
      view.update2DCanvasDebounce();
    },
    rotationReset: () => {
      design?.node.rotation(0);
      view.update2DCanvasDebounce();
    },
    flipX: () => {
      design?.node.scaleX(design.node.scaleX() * -1);
      view.update2DCanvasDebounce();
    },
    flipY: () => {
      design?.node.scaleY(design.node.scaleY() * -1);
      view.update2DCanvasDebounce();
    },
    copy: () => {
      const detail = design.detail;
      /**@type {import('d').addImageOptions}*/
      const options = {
        isCenter: false,
        isSet: true,
        attrs: {
          //
          x: design.node.x() + 10,
          y: design.node.y() + 10,
          rotation: design.node.rotation(),
          scaleX: design.node.scaleX(),
          scaleY: design.node.scaleY(),
          visible: design.node.visible(),
          width: design.node.width(),
          height: design.node.height(),
        },
      };
      view.addImage(detail, options);
      view.setDesignListIndex();
    },
    max: (type = useDesignerAppConfig().design_max_type_width) => {
      // 获取图片基于模板的尺寸
      const detailSize = design.detail.size;
      const dpi = view.$template.detail.dpi;
      const printSize = { width: view.width, height: view.height };
      const inch = getImageSize(detailSize, dpi, printSize).inch;
      // 获取最大缩放比例
      const nodeWidth = design.node.width();
      const nodeHeight = design.node.height();
      const maxScale = getScaleMax(type, inch, view, { width: nodeWidth, height: nodeHeight });
      // 获取图片翻转状态
      const flipX = design.node.scaleX() < 0 ? -1 : 1;
      const flipY = design.node.scaleY() < 0 ? -1 : 1;
      // 最大化
      design.node.setAttrs({
        scaleX: maxScale.scaleX * flipX,
        scaleY: maxScale.scaleY * flipY,
      });
      // 0度
      design.node.rotation(0);
      // 居中
      design.node.setAttrs({
        x: view.width / 2,
        y: view.height / 2,
      });
      view.update2DCanvasDebounce();
    },
    hasActive: () => {
      return useDesignerApplication().activeDesignId.value === design.attrs.uuid;
    },
    cancelActive: () => {
      if (design.hasActive()) {
        view.setNode(null);
      }
    },
    isImage: node.attrs.type === useDesignerAppConfig().design_type_image,
    isText: node.attrs.type === useDesignerAppConfig().design_type_text,
    isBackgroundImage: node.attrs.type === useDesignerAppConfig().design_type_background_image,
    isBackgroundColor: node.attrs.type === useDesignerAppConfig().design_type_background_color,
  };

  return design;
}
