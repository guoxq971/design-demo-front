import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { setNodeClipFunc } from '@/hooksFn/useGlobalDesigner/core/app/useCanvas/canvasClip';

/**
 * 设置视图模式
 * @param {import('../../../../../../d').mode_type} mode 视图模式
 * @param {import('../../../../../../d').view} view 视图
 */
export function setMode(mode, view) {
  // 设置裁剪
  const targetNodes = [view.canvasNodes.designGroup, view.canvasNodes.bgcGroup, view.canvasNodes.bgGroup];
  switch (mode) {
    case useDesignerAppConfig().mode_type_preview:
      if (view.print_d) {
        targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, view.print_d));
      } else {
        targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, null));
      }
      break;
    case useDesignerAppConfig().mode_type_edit:
      // 如果是全幅产品
      if (view.printout) {
        // setNodeClipFunc(targetNode, { width: width, height: height, gap: 2 });
        targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, null));
      } else {
        if (view.print_d) {
          targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, view.print_d));
        } else {
          targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, null));
        }
      }
      break;
  }

  // 设置车线
  const design_printout_d = view.canvasNodes.staticLayer.findOne((node) => node.attrs.type === useDesignerAppConfig().canvas_nodes_printout_d);
  const design_printout_v = view.canvasNodes.staticLayer.findOne((node) => node.attrs.type === useDesignerAppConfig().canvas_nodes_printout_v);
  const design_draw_black = view.canvasNodes.staticLayer.findOne((node) => node.attrs.type === useDesignerAppConfig().canvas_nodes_draw_area);
  switch (mode) {
    // 预览模式
    case useDesignerAppConfig().mode_type_preview:
      design_printout_d?.visible(false);
      design_printout_v?.visible(false);
      design_draw_black?.visible(false);
      break;
    // 编辑模式
    case useDesignerAppConfig().mode_type_edit:
      design_printout_d?.visible(true);
      design_printout_v?.visible(true);
      design_draw_black?.visible(true);
      break;
  }

  // 3d
  if (view.$template.is3d) {
    switch (mode) {
      // 预览模式
      case useDesignerAppConfig().mode_type_preview:
        view.$template.three.animateFlag = true;
        break;
      // 编辑模式
      case useDesignerAppConfig().mode_type_edit:
        view.$template.three.animateFlag = false;
        break;
    }
  }

  // 设置模式
  useDesignerApplication().mode.value = mode;
}
