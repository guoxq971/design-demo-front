/**
 * 销毁模板
 * @param {import('d').template} template
 */
export function destroy(template) {
  template.viewList.forEach((view) => {
    /**@typedef {import('d').view.destroy}*/
    view.destroy();
  });
  template.three?.destroy();
}
