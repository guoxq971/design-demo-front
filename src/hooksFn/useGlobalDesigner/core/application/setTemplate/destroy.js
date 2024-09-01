/**
 * 销毁视图
 * @param {import('d').view} view
 */
export function destroyView(view) {
  // 销毁canvas
  view?.designList.forEach((design) => destroyNode(design.node));
  if (view.canvasNodes) {
    Object.keys(view.canvasNodes).forEach((key) => destroyNode(view.canvasNodes[key]));
  }
}

/**
 * 销毁节点
 * @param {Konva.Node} node
 */
function destroyNode(node) {
  node?.destroy();
}
