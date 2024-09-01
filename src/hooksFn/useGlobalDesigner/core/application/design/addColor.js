import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { createDesign } from '@/hooksFn/useGlobalDesigner/core/application/design/createDesign';

/**
 * 添加设计-颜色
 * @param {string} color
 * @param {import('d').view} view
 */
export function addColor(color, view) {
  // 判断是否已经存在
  const isSome = view.designList.some((design) => design.isBackgroundColor);

  if (isSome) {
    view.$template.viewList.forEach((v) => {
      const design = v.designList.find((d) => d.isBackgroundColor);
      if (design) {
        design.node.fill(color);
        design.attrs.fill = color;
      }
      v.update2DCanvasDebounce();
    });
    // 设置模式
    view.setMode(useDesignerAppConfig().mode_type_edit);
  } else {
    view.$template.viewList.forEach((v) => {
      _addColor(color, v);
      v.update2DCanvasDebounce();
    });
    // 设置模式
    view.setMode(useDesignerAppConfig().mode_type_edit);
  }
}

/**
 * 添加设计-颜色
 * @param {string} color
 * @param {import('d').view} view
 */
function _addColor(color, view) {
  const parent = view.canvasNodes.bgcGroup;
  /**@type {import('d').design.node} 创建节点*/
  const node = new Konva.Rect({
    draggable: false,
    x: 0,
    y: 0,
    width: view.width,
    height: view.height,
    fill: color,
    visible: true,
    type: useDesignerAppConfig().design_type_background_color,
    uuid: AppUtil.uuid(),
  });
  // 创建设计
  const design = createDesign(node, view);
  // 添加到父节点
  parent.add(node);
  // 添加到view
  view.designList.push(design);
  // 触发更新canvas
  view.update2DCanvasDebounce();
  // 设置index
  view.setDesignListIndex();
}
