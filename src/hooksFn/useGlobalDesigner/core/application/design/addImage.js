import { cloneDeep } from 'lodash';
import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/application/design/imageSize';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useImage } from '@vueuse/core';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

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
      isSet: true,
      attrs: {},
    },
    options,
  );

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
  view.setMode(useDesignerAppConfig().mode_type_edit);
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
        });
      }
      // 图片|文字
      else {
        design.node.visible(!visible);
        design.cancelActive();
        design.attrs.visible = !visible;
        view.setDesignListIndex();
      }
    },
    moveToTop: () => {
      design?.node.moveToTop();
      view.setDesignListIndex();
    },
    moveToBottom: () => {
      design?.node.moveToBottom();
      view.setDesignListIndex();
    },
    moveUp: () => {
      design?.node.moveUp();
      view.setDesignListIndex();
    },
    moveDown: () => {
      design?.node.moveDown();
      view.setDesignListIndex();
    },
    remove: () => {
      // 背景图
      if (design.isBackgroundImage) {
        view.$template.viewList.forEach((v) => {
          v.designList.forEach((d) => {
            if (d.isBackgroundImage) {
              design.cancelActive();
              design?.node.destroy();
              v.removeDesign(d);
            }
          });
          v.setDesignListIndex();
        });
      }
      // 背景色
      else if (design.isBackgroundColor) {
        view.$template.viewList.forEach((v) => {
          v.designList.forEach((d) => {
            if (d.isBackgroundColor) {
              design.cancelActive();
              design?.node.destroy();
              v.removeDesign(d);
            }
          });
          v.setDesignListIndex();
        });
      }
      // 图片|文字
      else {
        design.cancelActive();
        design?.node.destroy();
        view.removeDesign(design);
        view.setDesignListIndex();
      }
    },
    center: () => {
      design?.node.x(view.width / 2);
      design?.node.y(view.height / 2);
    },
    centerX: () => {
      design?.node.x(view.width / 2);
    },
    centerY: () => {
      design?.node.y(view.height / 2);
    },
    scale: (n) => {
      design?.node.scaleX(n);
      design?.node.scaleY(n);
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
    },
    rotation: (n = 5) => {
      // 翻转状态
      design?.node.rotation(n);
    },
    rotationLeft: (n = 5) => {
      // 翻转状态
      design?.node.rotation(design.node.rotation() - n);
    },
    rotationRight: (n = 5) => {
      // 翻转状态
      design?.node.rotation(design.node.rotation() + n);
    },
    rotationReset: () => {
      design?.node.rotation(0);
    },
    flipX: () => {
      design?.node.scaleX(design.node.scaleX() * -1);
    },
    flipY: () => {
      design?.node.scaleY(design.node.scaleY() * -1);
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

/**
 * 加载图片
 * @param {string} src
 * @param {string|number} width
 * @param {string|number} height
 * @returns {Promise<HTMLImageElement>}
 */
async function loadImage(src, width, height) {
  // 加载图片
  const result = await useImage({ src, crossorigin: true, width, height });
  if (!result.isReady.value) return Promise.reject('图片加载失败1');
  if (!result.state.value) return Promise.reject('图片加载失败2');
  return result.state.value;
}

/**
 * 最大化操作的缩放比例
 * @param {import('d').design_max_type} type width:宽度 height:高度
 * @param {{width:number,height:number}} inch
 * @param {import('d').view} view
 * @param {{width:number,height:number}} imageDOMSize
 */
export function getScaleMax(type = useDesignerAppConfig().design_max_type_width, inch, view, imageDOMSize) {
  const iSize = inch;
  const pSize = view;
  const l = iSize.width / pSize.width; // l:设计图宽/打印区宽
  const p = iSize.height / pSize.height; // p:设计图高/打印区高
  let u;
  // 没有d是非全幅，铺满不能出现红线
  if (view?.print_d) {
    u = Math.min(l, p); // 取较小值
  } else {
    u = Math.max(l, p); // 取较大值[改]
  }
  if (useDesignerAppConfig().design_max_type_width === type) u = l;
  if (useDesignerAppConfig().design_max_type_height === type) u = p;
  if (u < 1) u = 1;

  // 最大化后的宽高
  const width = iSize.width / u;
  const height = iSize.height / u;

  // imageDom是当前使用的DOM的宽高可能是小图的宽高
  const scaleX = width / imageDOMSize.width;
  const scaleY = height / imageDOMSize.height;

  return {
    scaleX: scaleX,
    scaleY: scaleY,
  };
}
