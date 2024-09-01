import { createGlobalState } from '@vueuse/core';

// 配置
export const useDesignerAppConfig = createGlobalState(() => {
  /*************--设计类型--start***************/
  /**@type {import('d').design_type_image}*/
  const design_type_image = 'image';
  /**@type {import('d').design_type_background_image}*/
  const design_type_background_image = 'background-image';
  /**@type {import('d').design_type_background_color}*/
  const design_type_background_color = 'background-color';
  /**@type {import('d').design_type_text}*/
  const design_type_text = 'text';
  /*************--设计类型--end***************/

  /***********--模式--start*************/
  /**@type {import('d').mode_type_preview}*/
  const mode_type_preview = 'preview';
  /**@type {import('d').mode_type_edit}*/
  const mode_type_edit = 'edit';
  /***********--模式--end*************/

  /***********--模板类型--start*************/
  /**@type {import('d').template_type_common}*/
  const template_type_common = 'common';
  /**@type {import('d').template_type_refine}*/
  const template_type_refine = 'refine';
  /***********--模板类型--end*************/

  /***********--画布配置--start*************/
  // 实际画布大小
  const canvas_size = 600;
  // 画布原始大小
  const canvas_size_org = 500;
  // 预览画布大小
  const preview_canvas_size = 90;
  // 3d canvas大小
  const three_canvas_size = 1200;
  // 画布与原设计区域比例
  const scale = canvas_size / canvas_size_org;
  // 舞台容器id
  const get2dCanvasId = (viewId) => `canvas2dContainerId${viewId}`;
  // 预览图容器id
  const getPreviewContainerId = (viewId) => `preview_canvas_${viewId}`;
  // 预览画布的canvas pixel ratio
  const preview_canvas_pixel_ratio = preview_canvas_size / canvas_size;
  /***********--画布配置--end*************/

  /***********--画布节点--start*************/
  // 边框
  const canvas_nodes_bd = 'canvas_nodes_bd';
  // 选中框
  const canvas_nodes_transformer = 'canvas_nodes_transformer';
  // 静态层
  const canvas_nodes_static_layer = 'canvas_nodes_static_layer';
  // 设计层
  const canvas_nodes_design_layer = 'canvas_nodes_design_layer';
  // 设计组
  const canvas_nodes_design_group = 'canvas_nodes_design_group';
  // 背景组
  const canvas_nodes_bg_group = 'canvas_nodes_bg_group';
  // 背景色组
  const canvas_nodes_bgc_group = 'canvas_nodes_bgc_group';
  // 车线 printout d
  const canvas_nodes_printout_d = 'canvas_nodes_printout_d';
  // 车线 printout v
  const canvas_nodes_printout_v = 'canvas_nodes_printout_v';
  // 车线-黑色-绘制区域
  const canvas_nodes_draw_area = 'canvas_nodes_draw_area';
  /***********--画布节点--end*************/

  /***********--设计-最大化类型--start*************/
  /**@type {import('d').design_max_type_width}*/
  const design_max_type_width = 'width';
  /**@type {import('d').design_max_type_height}*/
  const design_max_type_height = 'height';
  /***********--设计-最大化类型--end*************/

  // 默认颜色
  const primary_color = '#fc6b20';

  return {
    // 设计-最大化类型
    design_max_type_width,
    design_max_type_height,
    // 画布配置
    canvas_size,
    canvas_size_org,
    preview_canvas_size,
    three_canvas_size,
    preview_canvas_pixel_ratio,
    scale,
    get2dCanvasId,
    getPreviewContainerId,
    // canvas节点
    canvas_nodes_bd,
    canvas_nodes_transformer,
    canvas_nodes_static_layer,
    canvas_nodes_design_layer,
    canvas_nodes_design_group,
    canvas_nodes_bg_group,
    canvas_nodes_bgc_group,
    canvas_nodes_printout_d,
    canvas_nodes_printout_v,
    canvas_nodes_draw_area,
    // 默认颜色
    primary_color,
    // 设计类型
    design_type_image,
    design_type_background_image,
    design_type_background_color,
    design_type_text,
    // 模式
    mode_type_preview,
    mode_type_edit,
    // 模板类型
    template_type_common,
    template_type_refine,
  };
});
