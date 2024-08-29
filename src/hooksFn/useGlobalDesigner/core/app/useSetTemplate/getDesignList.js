import { computed } from 'vue';

// 获取视图的设计列表
export function getDesignList(view) {
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
