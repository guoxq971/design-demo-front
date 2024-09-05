import { design_max_type, design_type } from './designerAppConfig';
import { designImageDetail } from './design-image-detail';
import Konva from 'konva';
import { template, textOptions, view } from './template-base';

export interface attrs extends textOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  visible: boolean;
  draggable: boolean;
  uuid: string;
  fill: string;
  text: string;
  viewId: string;
  offsetX: number;
  offsetY: number;
  type: design_type;
  detail: designImageDetail;
  zIndex: number;
}

// 设计-图
export interface designImage extends Konva.Image {
  attrs: attrs;
}
// 设计-文
export interface designText extends Konva.Text {
  attrs: attrs;
}

// 设计
export interface design {
  // 设计类型
  type: design_type;
  // 节点
  node: designImage | designText;
  // 属性
  attrs: attrs;
  // 详情
  detail: designImageDetail;
  // 视图
  $view: view;
  // 模板
  $template: template;
  // 收藏
  collect: Function;
  // 是否收藏
  isCollect: Function;
  // 显示隐藏
  visible: Function;
  // 置顶
  moveToTop: Function;
  // 置底
  moveToBottom: Function;
  // 上移
  moveUp: Function;
  // 下移
  moveDown: Function;
  // 删除
  remove: Function;
  // 居中
  center: Function;
  // 居中x
  centerX: Function;
  // 居中y
  centerY: Function;
  // 缩放
  scale: Function;
  // 缩放-放大
  scaleUp: Function;
  // 缩放-缩小
  scaleDown: Function;
  // 旋转
  rotation: (num: number) => {};
  // 旋转-左
  rotationLeft: (num: number) => {};
  // 旋转-右
  rotationRight: (num: number) => {};
  // 重置旋转
  rotationReset: Function;
  // 翻转x
  flipX: Function;
  // 翻转y
  flipY: Function;
  // 复制
  copy: Function;
  // 最大化
  max: (type: design_max_type) => {};
  // 是否激活
  hasActive(): boolean;
  // 是否碰撞
  hasCollide(): boolean;
  // 如果是激活项则取消激活
  cancelActive: Function;
  // 是否图
  isImage: boolean;
  // 是否背景图
  isBackgroundImage: boolean;
  // 是否背景色
  isBackgroundColor: boolean;
  // 是否文本
  isText: boolean;
}
