import Konva from 'konva';
import { useDesignerContainerEl } from '@/hooksFn/useGlobalDesigner/core/contaienr';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 创建canvas
 * @param {import('d').view} view
 * @return {import('d').canvasNodes}
 */
export function createCanvasNode(view) {
  // 绘制-舞台
  const stage = new Konva.Stage({
    container: useDesignerAppConfig().get2dCanvasId(view.id),
    width: useDesignerContainerEl().containerRect.value.stageWidth,
    height: useDesignerContainerEl().containerRect.value.stageHeight,
  });
  // 绘制-设计层 (设计组)
  const designLayer = new Konva.Layer({
    id: useDesignerAppConfig().canvas_nodes_design_layer,
    x: useDesignerContainerEl().containerRect.value.offsetX,
    y: useDesignerContainerEl().containerRect.value.offsetY,
  });
  stage.add(designLayer);
  // 绘制-静态层 (选中框,边框线)
  const staticLayer = new Konva.Layer({
    id: useDesignerAppConfig().canvas_nodes_static_layer,
    x: useDesignerContainerEl().containerRect.value.offsetX,
    y: useDesignerContainerEl().containerRect.value.offsetY,
  });
  stage.add(staticLayer);

  // 静态-边框线
  const bd = new Konva.Rect({
    id: useDesignerAppConfig().canvas_nodes_bd,
    listening: false,
    x: 0,
    y: 0,
    fill: 'transparent',
    stroke: '#7e7e7e',
    dash: [4.5],
    width: useDesignerContainerEl().containerRect.value.drawWidth,
    height: useDesignerContainerEl().containerRect.value.drawHeight,
  });
  staticLayer?.add(bd);
  // 静态-选中框
  const transformer = new Konva.Transformer({
    id: useDesignerAppConfig().canvas_nodes_transformer,
    nodes: [],
    visible: false,
    draggable: false, // 是否可拖拽
    flipEnabled: false, // 允许翻转
    ignoreStroke: false, // 忽略边框 (锚点不会被边框遮挡)
    shouldOverdrawWholeArea: true, // 是否允许绘制超出图形边界的区域
    // 锚点
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    anchorFill: '#ffffff', // 锚点的填充色
    anchorStroke: useDesignerAppConfig().primary_color, // 锚点的边框颜色
    anchorCornerRadius: 2, // 锚点的圆角
    anchorStrokeWidth: 1.5, // 锚点的边框宽度
    anchorSize: 15, // 锚点的大小
    // 旋转
    useSingleNodeRotation: true, // 是否使用单节点旋转
    rotateAnchorOffset: 50, // 旋转按钮的偏移量
    rotateAnchorCursor: 'pointer', // 旋转按钮的光标
    // 边框
    borderStrokeWidth: 1.5, // 边框的宽度
    borderStroke: useDesignerAppConfig().primary_color, // 边框的颜色
    // 缩放
    keepRatio: true, // 保持比例 (缩放时保持比例)
    centeredScaling: true, // 是否启用中心缩放
  });
  staticLayer?.add(transformer);

  // 车线-编辑模式-d
  if (view.printout_d) {
    let d = view.printout_d;
    let dash = [5];
    // 如果是精细设计
    // if (/*isRefine &&*/ is3d) {
    // d = viewInfo?.uvD;
    // dash = [];
    // }

    // 轮廓线 -  (编辑模式, 红色, 轮廓, 超出隐藏)
    const path = new Konva.Path({
      listening: false,
      type: useDesignerAppConfig().canvas_nodes_printout_d,
      x: view.offsetX * useDesignerAppConfig().scale,
      y: view.offsetY * useDesignerAppConfig().scale,
      scaleX: useDesignerAppConfig().scale,
      scaleY: useDesignerAppConfig().scale,
      data: d,
      fill: null,
      stroke: 'red',
      dash: dash,
      strokeWidth: 1.8,
      opacity: 0.7,
      visible: false,
    });
    staticLayer.add(path);
  }
  // 车线-编辑模式-v
  if (view.printout_v) {
    let v = view.printout_v;
    // 如果是精细设计
    // if (isRefine) {
    // v = viewInfo?.uvV;
    // }

    // 车线 - (编辑模式, 红色, 车线)
    const path = new Konva.Path({
      listening: false,
      type: useDesignerAppConfig().canvas_nodes_printout_v,
      x: view.offsetX * useDesignerAppConfig().scale,
      y: view.offsetY * useDesignerAppConfig().scale,
      scaleX: useDesignerAppConfig().scale,
      scaleY: useDesignerAppConfig().scale,
      data: v,
      fill: null,
      stroke: 'red',
      dash: [5],
      strokeWidth: 2,
      opacity: 0.7,
      visible: false,
    });
    staticLayer.add(path);
  }
  // 车线-黑色-绘制区域-如果是精细产品不需要(轮廓线黑色)
  if (/*!isRefine*/ true) {
    // 轮廓线 - (编辑模式, 黑色, 产品边框)
    const step = 2;
    const step2 = step / 2;
    const w = view.print_width + step;
    const h = view.print_height + step;
    // data 的值为 this.print.width和this.print.height 组成的矩形加上step的值
    const data = `M${-step2},${-step2} L${w - step2},${-step2} L${w - step2},${h - step2} L${-step2},${h - step2} Z`;
    const path = new Konva.Path({
      listening: false,
      type: useDesignerAppConfig().canvas_nodes_draw_area,
      x: view.offsetX * useDesignerAppConfig().scale,
      y: view.offsetY * useDesignerAppConfig().scale,
      scaleX: useDesignerAppConfig().scale,
      scaleY: useDesignerAppConfig().scale,
      data: data,
      fill: null,
      stroke: '#000',
      dash: [4],
      strokeWidth: 1.2,
      opacity: 0.7,
      visible: false,
    });
    staticLayer.add(path);
  }

  // 设计层-组
  const designGroup = new Konva.Group({
    id: useDesignerAppConfig().canvas_nodes_design_group,
    x: view.offsetX * useDesignerAppConfig().scale,
    y: view.offsetY * useDesignerAppConfig().scale,
    scaleX: useDesignerAppConfig().scale,
    scaleY: useDesignerAppConfig().scale,
  });
  // 背景图层-组
  const bgGroup = new Konva.Group({
    id: useDesignerAppConfig().canvas_nodes_bg_group,
    x: view.offsetX * useDesignerAppConfig().scale,
    y: view.offsetY * useDesignerAppConfig().scale,
    scaleX: useDesignerAppConfig().scale,
    scaleY: useDesignerAppConfig().scale,
  });
  // 背景色层-组
  const bgcGroup = new Konva.Group({
    id: useDesignerAppConfig().canvas_nodes_bgc_group,
    x: view.offsetX * useDesignerAppConfig().scale,
    y: view.offsetY * useDesignerAppConfig().scale,
    scaleX: useDesignerAppConfig().scale,
    scaleY: useDesignerAppConfig().scale,
  });
  designLayer.add(bgcGroup);
  designLayer?.add(bgGroup);
  designLayer?.add(designGroup);

  return {
    stage,
    designLayer,
    staticLayer,
    bd,
    transformer,
    designGroup,
    bgGroup,
    bgcGroup,
  };
}

/**
 * 舞台监听
 * @param {import('d').view} view
 */
export function addWatchStage(view) {
  // 舞台注册监听(click, 切换为预览模式)
  // 【stage】【isDesignNode】【isMouseTransformerAnchor】【setNode】【setMode】
  view.canvasNodes.stage.on('click', (e) => {
    // 获取舞台鼠标位置
    const { x, y } = view.canvasNodes.stage.getPointerPosition();
    // 获取点击的节点
    const targetNode = e.target;
    const parentNode = targetNode.parent;
    // 父级是选中框
    if (parentNode?.getId() === useDesignerAppConfig().canvas_nodes_transformer) return;
    // 当前是设计
    else if (isDesignNode(targetNode)) return;
    // 判断是否点击了锚点
    else if (isMouseTransformerAnchor(x, y)) return;
    // 选中框目标置空
    view.setNode();
    // 设置预览模式
    view.setMode(useDesignerAppConfig().mode_type_preview);
  });

  // 舞台注册监听(mousedown, 坐标下选中最上面的设计)
  view.canvasNodes.stage.on('mousedown', (e) => {
    // 获取舞台鼠标位置
    const { x, y } = view.canvasNodes.stage.getPointerPosition();
    // 判断是否点击了锚点
    if (isMouseTransformerAnchor(x, y)) return;
    // 获取当前坐标下的所有节点(设计节点)
    const nodes = getDesignChildren().filter((node) => {
      return isDesignNode(node) && node?.intersects({ x, y });
    });
    if (nodes.length > 1) {
      const node = nodes.at(-1);
      // 将node替换,transformer附加到节点
      view.canvasNodes.transformer.attachTo(node);
      // 模拟点击
      node.fire('mousedown', e);
    }
  });

  // 获取设计图子节点
  function getDesignChildren() {
    const { designGroup, bgGroup, bgcGroup } = view.canvasNodes;
    return [...bgcGroup.getChildren(), ...bgGroup.getChildren(), ...designGroup.getChildren()];
  }

  /**
   * 判断是否为鼠标变换锚点
   * @param x
   * @param y
   * @returns {boolean}
   */
  function isMouseTransformerAnchor(x, y) {
    return view.canvasNodes.transformer.getChildren((node) => node.getName().indexOf('anchor') > -1).some((node) => node?.intersects({ x, y }));
  }

  /**
   * 判断是否为设计节点
   * @param {Konva.Node} node
   * @returns {boolean}
   */
  function isDesignNode(node) {
    return [useDesignerAppConfig().design_type_background_image, useDesignerAppConfig().design_type_image, useDesignerAppConfig().design_type_text].includes(node?.attrs.type);
  }
}
