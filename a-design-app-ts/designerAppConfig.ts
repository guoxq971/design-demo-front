// 设计类型
export type design_type_image = 'image';
export type design_type_background_image = 'background-image';
export type design_type_background_color = 'background-color';
export type design_type_text = 'text';
export type design_type =
  | design_type_image
  | design_type_background_image
  | design_type_background_color;
