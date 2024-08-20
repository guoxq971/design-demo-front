import Konva from 'konva';
import { canvasDefine, createCanvasIds, getCanvasContainerId, PRIMARY_COLOR } from '@/hooksFn/useDesignerApp/core/service/app/define';

export function createCanvasNode(view, containerRect) {
  const { stageWidth, stageHeight, drawWidth, drawHeight, offsetX, offsetY } = containerRect;
  // 绘制-舞台
  const stage = new Konva.Stage({
    container: getCanvasContainerId(view.id),
    width: stageWidth,
    height: stageHeight,
  });
  // 绘制-设计层 (设计组)
  const designLayer = new Konva.Layer({
    id: createCanvasIds.design_layer,
    x: offsetX,
    y: offsetY,
  });
  stage.add(designLayer);
  // 绘制-静态层 (选中框,边框线)
  const staticLayer = new Konva.Layer({
    id: createCanvasIds.static_layer,
    x: offsetX,
    y: offsetY,
  });
  stage.add(staticLayer);

  // 静态-边框线
  const bd = new Konva.Rect({
    id: createCanvasIds.bd,
    listening: false,
    x: 0,
    y: 0,
    fill: 'transparent',
    stroke: '#7e7e7e',
    dash: [4.5],
    width: drawWidth,
    height: drawHeight,
  });
  staticLayer?.add(bd);
  // 静态-选中框
  const transformer = new Konva.Transformer({
    id: createCanvasIds.transformer,
    nodes: [],
    visible: false,
    draggable: false, // 是否可拖拽
    flipEnabled: false, // 允许翻转
    ignoreStroke: false, // 忽略边框 (锚点不会被边框遮挡)
    shouldOverdrawWholeArea: true, // 是否允许绘制超出图形边界的区域
    // 锚点
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    anchorFill: '#ffffff', // 锚点的填充色
    anchorStroke: PRIMARY_COLOR, // 锚点的边框颜色
    anchorCornerRadius: 2, // 锚点的圆角
    anchorStrokeWidth: 1.5, // 锚点的边框宽度
    anchorSize: 15, // 锚点的大小
    // 旋转
    useSingleNodeRotation: true, // 是否使用单节点旋转
    rotateAnchorOffset: 50, // 旋转按钮的偏移量
    rotateAnchorCursor: 'pointer', // 旋转按钮的光标
    // 边框
    borderStrokeWidth: 1.5, // 边框的宽度
    borderStroke: PRIMARY_COLOR, // 边框的颜色
    // 缩放
    keepRatio: true, // 保持比例 (缩放时保持比例)
    centeredScaling: true, // 是否启用中心缩放
  });
  staticLayer?.add(transformer);

  // 设计层-组
  const designGroup = new Konva.Group({
    id: createCanvasIds.design_group,
    x: view.offsetX * canvasDefine.scale,
    y: view.offsetY * canvasDefine.scale,
    scaleX: canvasDefine.scale,
    scaleY: canvasDefine.scale,
  });
  designLayer?.add(designGroup);

  return {
    stage,
    designLayer,
    staticLayer,
    bd,
    transformer,
    designGroup,
  };
}
