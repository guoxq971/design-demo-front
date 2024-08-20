import { createGenerateBase64 } from '@/hooksFn/useDesignerApp/core/service/app/utils/canvas/generateBase64';

// 帮助函数
export function useHelper(view) {
  const canvasNodes = view.canvasNodes;

  const { transformer, designGroup } = canvasNodes;

  function setNode(node = null) {
    const nodes = node ? [node] : [];
    const visible = !!node;
    transformer.nodes(nodes);
    transformer.visible(visible);
  }

  /**
   * 获取视图下所有设计节点
   * @returns
   */
  function getDesignChildren() {
    return designGroup.getChildren();
  }

  const generate = createGenerateBase64(canvasNodes, view);

  return {
    canvasNodes,
    setNode,
    getDesignChildren,
    generateBase64Debounce: generate.generateBase64Debounce,
    generateBase64: generate.generateBase64,
  };
}
