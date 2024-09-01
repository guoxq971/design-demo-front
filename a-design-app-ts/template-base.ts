import { attrs, design } from './design';
import { printArea, printoutArea, templateDetail } from './template-detail';
import { mode_type, template_type } from './designerAppConfig';
import { templateConfig, templateRefineConfig } from './template-config';
import Konva from 'konva';
import { designImageDetail } from './design-image-detail';

// 模板尺码
export interface size {
  // id
  id: string;
  // 尺码
  size: string;
  // 尺码类型
  sizeType: string;
}

// 颜色视图
export interface colorView {
  id: string;
  // 产品图
  texture: string;
  // 背景图
  image: string;
}

// 模板颜色
export interface color {
  // id
  id: string;
  // 颜色名称
  colorName: string;
  // 颜色编码 (逗号隔开, 可能是多个)
  colorCode: string;
  // 颜色编码列表
  colorCodeList: string[];
  // 视图图片列表
  viewImageList: colorView[];
  // 多角度图片列表
  multiImageList: {
    // 排序id
    multiId: string;
    // 组合id
    composeId: string;
    // 多角度id multiId
    id: string;
    // 背景图 image
    bgImg: string;
    // 设计图 (渲染接口的图)
    designImg: string;
    // 产品图
    prodImg: string;
    // 多角度item
    multiItem: object;
    // 没用到
    noShow: boolean;
  }[];
}

// 视图canvas节点
export interface canvasNodes {
  stage: Konva.Stage;
  designLayer: Konva.Layer;
  staticLayer: Konva.Layer;
  bd: Konva.Rect;
  transformer: Konva.Transformer;
  designGroup: Konva.Group;
  bgGroup: Konva.Group;
  bgcGroup: Konva.Group;
}

// 添加设计的选项
export interface addImageOptions {
  // 是否居中
  isCenter?: boolean;
  // 是否选中
  isSet?: boolean;
  // 自定义属性
  attrs?: attrs;
}

// 模板视图
export interface view {
  //id
  id: string;
  //视图名称
  name: string;
  //设计列表
  designList: design[];
  // 视图canvas节点
  canvasNodes: canvasNodes;
  //更新2d视图
  update2DCanvas: Function;
  // 创建2d视图
  create2DCanvas: () => {};
  // 设置节点
  setNode: (design: design) => {};
  // 设置模式
  setMode: (mode: mode_type) => {};
  // 清空设计
  clearDesign: () => {};
  // 设置所有设计index
  setDesignListIndex: Function;
  // 删除设计
  removeDesign: (design: design) => {};
  // 切换模板类型销毁数据
  destroy: () => {};
  // 添加图片
  addImage: (detail: designImageDetail, options: addImageOptions) => {};
  // 视图的父级模板
  $template: template;

  // 视图距离500x500左上角的偏移量
  offsetX: string;
  offsetY: string;
  // print
  print: printArea;
  // printout
  printout: printoutArea;
  // 视图宽度
  width: string;
  // 视图高度
  height: string;
  printout_d: string;
  printout_v: string;
  print_d: string;
  print_width: string;
  print_height: string;
}

// 模板
export interface template {
  //id
  id: string;
  // 模板号
  templateNo: string;
  // 模板类型
  type: template_type;
  // 模板尺码
  size: string;
  // 3d是否可用
  is3d: boolean;
  //详情
  detail: templateDetail;
  // 配置
  config: templateConfig | templateRefineConfig;
  //视图列表
  viewList: view[];
  //颜色列表
  colorList: color[];
  //尺码列表
  sizeList: size[];
}
