/**
 * 销毁模板
 * @typedef {import('d').template.destroy}
 * @param {import('d').template} template
 */
export function destroy(template) {
  // 销毁视图
  template.viewList.forEach((view) => {
    /**@typedef {import('d').view.destroy}*/
    view.destroy();
  });
  // 销毁模板3d
  template.three?.destroy();
  // 销毁多角度3d
  template.multi3DList.forEach((multi3D) => {
    multi3D.updateMeshObj = {};
    multi3D.three?.destroy();
  });
}

/**
 * 销毁视图
 * @typedef {import('d').view.destroy}
 * @param {import('d').view} view
 */
export function destroyView(view) {
  // 销毁canvas
  view?.designList.forEach((design) => {
    destroyNode(design.node);
    design.node = null;
  });
  if (view.canvasNodes) {
    Object.keys(view.canvasNodes).forEach((key) => destroyNode(view.canvasNodes[key]));
  }
  view.designList = [];
  // 销毁3d
  view?.textureCanvas?.remove();
  view.textureCanvas = null;
  view.canvasNodes = null;
}

/**
 * 销毁节点
 * @param {Konva.Node} node
 */
function destroyNode(node) {
  node?.destroy();
}
