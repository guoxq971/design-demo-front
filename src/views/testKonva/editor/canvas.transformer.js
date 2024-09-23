import Konva from 'konva';

class CanvasTransformer {
  constructor(editor, view) {
    this.editor = editor;
    this.view = view;
    this.transformer = null;

    // this.execute();
  }

  execute() {
    const stage = this.view.stage;
    const staticLayer = this.view.staticLayer;
    const primary_color = '#fc6b20';

    const transformer = new Konva.Transformer({
      nodes: [],
      visible: false,
      draggable: false, // 是否可拖拽
      flipEnabled: false, // 允许翻转
      ignoreStroke: false, // 忽略边框 (锚点不会被边框遮挡)
      shouldOverdrawWholeArea: true, // 是否允许绘制超出图形边界的区域
      // 锚点
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      anchorFill: '#ffffff', // 锚点的填充色
      anchorStroke: primary_color, // 锚点的边框颜色
      anchorCornerRadius: 2, // 锚点的圆角
      anchorStrokeWidth: 1.5, // 锚点的边框宽度
      anchorSize: 15, // 锚点的大小
      // 旋转
      useSingleNodeRotation: true, // 是否使用单节点旋转
      rotateAnchorOffset: 50, // 旋转按钮的偏移量
      rotateAnchorCursor: 'pointer', // 旋转按钮的光标
      // 边框
      borderDash: [4], // 边框的虚线
      borderStrokeWidth: 2, // 边框的宽度
      borderStroke: primary_color, // 边框的颜色
      // 缩放
      keepRatio: true, // 保持比例 (缩放时保持比例)
      centeredScaling: true, // 是否启用中心缩放
    });
    staticLayer.add(transformer);

    this.transformer = transformer;
    this.view.transformer = this;
  }

  select(node) {
    const transformer = this.transformer;
    transformer.nodes([node]);
    transformer.visible(true);
  }

  deselect() {
    const transformer = this.transformer;
    transformer.nodes([]);
    transformer.visible(false);
  }
}

export { CanvasTransformer };
