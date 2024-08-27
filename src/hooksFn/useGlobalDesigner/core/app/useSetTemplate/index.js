import { computed, nextTick } from 'vue';
// utils
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { parseTemplate } from './parseTemplateDeatil';
import { useCanvas } from '../useCanvas';

export function useSetTemplate(detail) {
  const app = useGlobalDesigner().app;
  const template = parseTemplate(detail);

  template.viewList.forEach((view) => {
    view.base64 = ''; // 预览图
    view.canvasNodes = null; // canvas节点
    // 设计列表
    view.designList = getDesignList(view);
  });

  // 数据初始化
  app.templateList.value = [];
  app.templateList.value.push(template);
  app.activeTemplateId.value = detail.id;
  app.activeViewId.value = template.viewList[0].id;
  app.activeColorId.value = template.colorList[0].id;
  app.activeSizeId.value = template.sizeList[0].id;
  console.log('app', app);

  // 创建模板
  nextTick(() => {
    template.viewList.forEach((view) => {
      view.canvasNodes = useCanvas().create(view);
    });
  });
}

// 获取视图的设计列表
function getDesignList(view) {
  return computed(() => {
    if (view.canvasNodes) {
      const designList = view.canvasNodes.designGroup.getChildren().toReversed();
      const bgcList = view.canvasNodes.bgcGroup.getChildren().toReversed();
      const bgList = view.canvasNodes.bgGroup.getChildren().toReversed();
      return [...designList, ...bgList, ...bgcList].map((node) => {
        return {
          detail: node.attrs?.detail,
          fill: node.attrs.fill,
          type: node.attrs.type,
          x: node.attrs.x,
          y: node.attrs.y,
          scaleX: node.attrs.scaleX,
          scaleY: node.attrs.scaleY,
          rotation: node.attrs.rotation,
          visible: node.attrs.visible,
          uuid: node.attrs.uuid,
          node,
        };
      });
    }
    return [];
  });
}
