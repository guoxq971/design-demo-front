// 设计类型
export type design_type_image = 'image';
export type design_type_background_image = 'background-image';
export type design_type_background_color = 'background-color';
export type design_type_text = 'text';
export type design_type = design_type_image | design_type_background_image | design_type_background_color | design_type_text;

// 模式
export type mode_type_preview = 'preview';
export type mode_type_edit = 'edit';
export type mode_type = mode_type_preview | mode_type_edit;

// 模板类型
export type template_type_common = 'common';
export type template_type_refine = 'refine';
export type template_type = template_type_common | template_type_refine;

// 设计最大化类型
export type design_max_type_width = 'width';
export type design_max_type_height = 'height';
export type design_max_type = design_max_type_width | design_max_type_height;
