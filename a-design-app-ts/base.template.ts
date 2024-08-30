import { design } from './design';

// 模板尺码
export interface size {
  // id
  id: string;
  // 尺码
  size: string;
}

// 模板颜色
export interface color {
  // id
  id: string;
  // 颜色名称
  colorName: string;
}

// 模板视图
export interface view {
  //id
  id: string;
  //视图名称
  name: string;
  //设计列表
  designList: design[];
  //更新2d视图
  update2DCanvas: Function;
}

// 模板
export interface template {
  //id
  id: string;
  //详情
  detail: object;
  //视图列表
  viewList: view[];
  //颜色列表
  colorList: color[];
  //尺码列表
  sizeList: size[];
}
