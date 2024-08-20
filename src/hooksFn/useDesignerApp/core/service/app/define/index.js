// 舞台容器id(用于捕获坐标)
export const canvasContainerId = 'canvas-container';
// 产品图容器id（用于捕获坐标）
export const canvasImgContainerId = 'canvas-img-container';

// canvas容器
export function getCanvasContainerId(id) {
  return 'canvasContainerId' + id;
}

// 默认颜色
export const PRIMARY_COLOR = '#fc6b20';

// 画布ID
export const createCanvasIds = {
  // 边框线
  bd: 'canvas-bd',
  // 选中框
  transformer: 'canvas-transformer',
  // 静态层
  static_layer: 'canvas-static-layer',
  // 设计层
  design_layer: 'canvas-design-layer',
  // 设计-组
  design_group: 'canvas-design-group',
  // 设计标识
  design: 'canvas-design',
};

// 画布宽高
const CANVAS_SIZE = 600;
const canvas_SIZE_ORG = 500;
const PREVIEW_CANVAS_SIZE = 90;
export const canvasDefine = {
  // 大图分辨率
  bigPixelRatio: 1500 / CANVAS_SIZE,
  // 预览图分辨率
  previewPixelRatio: (PREVIEW_CANVAS_SIZE / CANVAS_SIZE) * 2,
  // 画布宽高
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
  size: CANVAS_SIZE,
  // 画布与原设计区域比例
  scale: CANVAS_SIZE / canvas_SIZE_ORG,
};

// 代理的防抖时间
export const DEBOUNCE_TIME = 100;

// 设计类型
export const designs = {
  image: 'image',
  bgImage: 'bgImage',
  bgColor: 'bgColor',
  text: 'text',
};

// 模式
export const modes = {
  preview: 'preview',
  edit: 'edit',
};

// 模版类型
export const templates = {
  common: 'common',
  refine: 'refine',
};
