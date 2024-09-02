/**
 * 销毁模板
 * @typedef {import('d').template.destroy}
 * @param {import('d').template} template
 */
export function destroy(template) {
  template.viewList.forEach((view) => {
    /**@typedef {import('d').view.destroy}*/
    view.destroy();
  });
  template.three?.destroy();
  template.multi3DList.forEach((multi3D) => {
    multi3D.updateMeshObj = {};
    multi3D.three?.destroy();
  });
}
