import { design_type } from './designerAppConfig';

// 设计
export interface design {
  // 设计类型
  type: design_type;
  // 节点
  node: object;
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
  // 缩放
  scale: Function;
  // 最大化
  max: Function;
}
