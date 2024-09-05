import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/application/design/imageSize';
import { getScaleMax } from '@/hooksFn/useGlobalDesigner/core/application/design/scaleMax';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { isCollide, overRed } from '@/hooksFn/useGlobalDesigner/core/application/design/collide';

/**
 * 创建设计
 * @param {import('d').design.node} node
 * @param {import('d').view} view
 * @return {design}
 */
export function createDesign(node, view) {
  /**@type {import('d').design} 创建节点*/
  const design = {
    type: node.attrs.type,
    node: node,
    attrs: {
      x: node.attrs.x || 0,
      y: node.attrs.y || 0,
      width: node.attrs.width,
      height: node.attrs.height,
      scaleX: node.attrs.scaleX || 1,
      scaleY: node.attrs.scaleY || 1,
      rotation: node.attrs.rotation || 0,
      visible: node.attrs.visible,
      draggable: node.attrs.draggable,
      uuid: node.attrs.uuid || '',
      fill: node.attrs.fill || '',
      text: node.attrs.text || '',
      viewId: view.id,
      offsetX: node.attrs.offsetX || 0,
      offsetY: node.attrs.offsetY || 0,
      type: node.attrs.type,
      detail: node.attrs.detail,
      zIndex: node.attrs.zIndex || 0,
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
        await useGlobalDesigner().collectImage.getList();
      } else {
        if (useGlobalDesigner().collectBgImage.isCollect(node.attrs.detail)) {
          await useGlobalDesigner().collectBgImage.collectCancel(node.attrs.detail);
        } else {
          await useGlobalDesigner().collectBgImage.collect(node.attrs.detail);
        }
        await useGlobalDesigner().collectBgImage.getList();
      }
    },
    hasCollide: () => isCollide(design),
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
      overRed(view);
    },
    centerX: () => {
      design?.node.x(view.width / 2);
      view.update2DCanvasDebounce();
      overRed(view);
    },
    centerY: () => {
      design?.node.y(view.height / 2);
      view.update2DCanvasDebounce();
      overRed(view);
    },
    scale: (n) => {
      design?.node.scaleX(n);
      design?.node.scaleY(n);
      view.update2DCanvasDebounce();
      overRed(view);
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
      overRed(view);
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
      overRed(view);
    },
    rotation: (n = 5) => {
      design?.node.rotation(n);
      view.update2DCanvasDebounce();
      overRed(view);
    },
    rotationLeft: (n = 5) => {
      design?.node.rotation(design.node.rotation() - n);
      view.update2DCanvasDebounce();
      overRed(view);
    },
    rotationRight: (n = 5) => {
      design?.node.rotation(design.node.rotation() + n);
      view.update2DCanvasDebounce();
      overRed(view);
    },
    rotationReset: () => {
      design?.node.rotation(0);
      view.update2DCanvasDebounce();
      overRed(view);
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
      overRed(view);
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
