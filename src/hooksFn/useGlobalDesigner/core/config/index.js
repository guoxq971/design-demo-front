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
  // 工厂用的画布大小
  const factory_canvas_size = 4060;
  // 画布与原设计区域比例
  const scale = canvas_size / canvas_size_org;
  // 舞台容器id
  const get2dCanvasId = (viewId) => `canvas2dContainerId${viewId}`;
  // 预览图容器id
  const getPreviewContainerId = (viewId) => `preview_canvas_${viewId}`;
  // 多角度容器id
  const getMultiContainerId = (id) => `multi_container_${id}`;
  // 预览画布的canvas pixel ratio
  const preview_canvas_pixel_ratio = preview_canvas_size / canvas_size;
  // three画布的canvas pixel ratio
  const three_canvas_pixel_ratio = three_canvas_size / canvas_size;
  // 文字转图的 pixel ratio
  const text_to_image_pixel_ratio = factory_canvas_size / canvas_size_org;
  // three 容器id
  const three_container_id = 'threeContainerId';
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

  /***********--保存模板--start*************/
  /**@type {import('d').save_template_type_save}*/
  const save_template_type_save = '0';
  /**@type {import('d').save_template_type_color}*/
  const save_template_type_color = '1';
  /**@type {import('d').save_template_type_org}*/
  const save_template_type_org = '2';
  /**@type {import('d').save_template_type_render}*/
  const save_template_type_render = '3';
  /***********--保存模板--end*************/

  /***********--提交设计类型--start*************/
  /**@type {import('d').submit_design_type_design}*/
  const submit_design_type_design = 'design';
  /**@type {import('d').submit_design_type_background_color}*/
  const submit_design_type_background_color = 'backgroundColor';
  /***********--提交设计类型--start*************/

  /***********--模板来源--start*************/
  /**@type {import('d').template_source_type_self}*/
  const template_source_type_self = '1';
  /**@type {import('d').template_source_type_out}*/
  const template_source_type_out = '0';
  /***********--模板来源--end*************/

  /***********--文字--start*************/
  /**@type {import('d').font_weight_type_bold}*/
  const font_weight_type_bold = 'bold';
  /**@type {import('d').font_weight_type_none}*/
  const font_weight_type_none = 'normal';
  /**@type {import('d').font_italic_type_italic}*/
  const font_italic_type_italic = 'italic';
  /**@type {import('d').font_italic_type_none}*/
  const font_italic_type_none = 'normal';
  /**@type {import('d').font_decoration_type_underline}*/
  const font_decoration_type_underline = 'underline';
  /**@type {import('d').font_decoration_type_none}*/
  const font_decoration_type_none = 'none';
  /***********--文字--end*************/

  // 默认颜色
  const primary_color = '#fc6b20';
  // 颜色列表
  const default_color_list = [
    //
    '#E01F21',
    '#FA6402',
    '#F7B502',
    '#06D072',
    '#0099FF',
    '#9DC1FF',
    '#005CFF',
    '#000000',
    '#757575',
    '#B9B9B9',
    '#665544',
    '#750233',
    '#817E68',
    '#FFFFFF',
  ];

  return {
    // 颜色列表
    default_color_list,
    // 文字
    font_weight_type_bold,
    font_weight_type_none,
    font_italic_type_italic,
    font_italic_type_none,
    font_decoration_type_underline,
    font_decoration_type_none,
    // 提交设计类型
    submit_design_type_design,
    submit_design_type_background_color,
    // 模板来源
    template_source_type_self,
    template_source_type_out,
    // 保存模板
    save_template_type_save,
    save_template_type_color,
    save_template_type_org,
    save_template_type_render,
    // 设计-最大化类型
    design_max_type_width,
    design_max_type_height,
    // 画布配置
    canvas_size,
    canvas_size_org,
    preview_canvas_size,
    three_canvas_size,
    preview_canvas_pixel_ratio,
    three_canvas_pixel_ratio,
    text_to_image_pixel_ratio,
    scale,
    three_container_id,
    get2dCanvasId,
    getPreviewContainerId,
    getMultiContainerId,
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
