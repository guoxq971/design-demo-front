import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

/**
 * 设置节点选中
 * @typedef {import('d').view.setNode}
 * @param {import('d').design} design
 * @param {import('d').view} view
 */
export function setNode(design, view) {
  // 没有传,就是清空
  if (!design) {
    view.canvasNodes.transformer.nodes([]);
    view.canvasNodes.transformer.visible(false);
    if (useDesignerApplication().activeViewId.value === view.id) {
      useDesignerApplication().activeDesignId.value = '';
    }
    return;
  }
  // 设置选中,并显示transformer
  view.canvasNodes.transformer.nodes([design.node]);
  view.canvasNodes.transformer.visible(true);
  useDesignerApplication().activeDesignId.value = design.attrs.uuid;
  // 其他的视图取消选中
  view.$template.viewList.forEach((v) => {
    if (v.id !== view.id) {
      v.setNode(null);
    }
  });
}
