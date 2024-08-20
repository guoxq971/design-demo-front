import { createEventHook, useDebounceFn } from '@vueuse/core';
// utils
import Konva from 'konva';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { isObject, isString } from 'lodash';
import { useGlobalApplication } from '@/hooksFn/useDesignerApplication/core/app/application';
import { setNodeClipFunc } from '@/hooksFn/useDesignerApp/core/service/app/util/canvasUtil/canvasClip';

export function createCanvas(view) {
  const modes = useGlobalData().defineData.modes;
  // 容器属性
  const { containerRect } = useGlobalApplication().containerElData;
  const { drawWidth, drawHeight } = containerRect.value;
  // 裁剪函数
  const { setNodeClipFunc } = useClip();

  // 创建canvas
  const canvasNodes = createCanvasNode(view, containerRect.value);
  setNodeClipFunc(canvasNodes.designLayer, { width: drawWidth, height: drawHeight });

  view.canvasNodes = canvasNodes;
  useCanvasHelper(view).setMode(modes.preview);

  // 添加画布监听
  addEventListener(view);

  return {
    canvasNodes,
  };
}

// 添加画布监听
function addEventListener(view) {
  const { modes, canvasConfig } = useGlobalData().defineData;
  const { createCanvasIds } = canvasConfig;
  const { stage, designLayer, staticLayer, bd, transformer, designGroup } = view.canvasNodes;
  const { isDesignNode, isMouseTransformerAnchor, setNode, setMode } = useCanvasHelper(view);

  // 舞台注册监听(click, 切换为预览模式)
  // 【stage】【isDesignNode】【isMouseTransformerAnchor】【setNode】【setMode】
  stage.on('click', (e) => {
    // 获取舞台鼠标位置
    const { x, y } = stage.getPointerPosition();
    // 获取点击的节点
    const targetNode = e.target;
    const parentNode = targetNode.parent;
    // 父级是选中框
    if (parentNode?.getId() === createCanvasIds.transformer) return;
    // 当前是设计
    else if (isDesignNode(targetNode)) return;
    // 判断是否点击了锚点
    else if (isMouseTransformerAnchor(x, y)) return;
    // 选中框目标置空
    setNode();
    // 设置预览模式
    setMode(modes.preview);
  });

  // 舞台注册监听(mousedown, 坐标下选中最上面的设计)
  stage.on('mousedown', (e) => {
    // 获取舞台鼠标位置
    const { x, y } = stage.getPointerPosition();
    // 判断是否点击了锚点
    if (isMouseTransformerAnchor(x, y)) return;
    // 获取当前坐标下的所有节点(设计节点)
    const nodes = designGroup.getChildren().filter((node) => {
      return isDesignNode(node) && node?.intersects({ x, y });
    });
    if (nodes.length) {
      const node = nodes.at(-1);
      // 将node替换,transformer附加到节点
      transformer.attachTo(node);
      // 模拟点击
      node.fire('mousedown', e);
    }
  });
}

// 创建canvas
function createCanvasNode(view, containerRect) {
  // 全局配置
  const { defineData } = useGlobalData();
  const { canvasConfig, PRIMARY_COLOR } = defineData;
  const { canvasDefine, createCanvasIds, getCanvasContainerId } = canvasConfig;
  // 舞台容器
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

// 裁剪函数
function useClip() {
  // 设置节点的裁剪函数
  function setNodeClipFunc(node, path = null) {
    if (path === null) {
      node.clipFunc(null);
      return;
    }
    let _tempPathNode = null;
    if (path instanceof Konva.Path) {
      _tempPathNode = path;
    } else if (isString(path)) {
      _tempPathNode = new Konva.Path({ data: path });
    } else if (isObject(path)) {
      path = getPathData(path.width, path.height, path.gap);
      _tempPathNode = new Konva.Path({ data: path });
    }

    node.clipFunc((ctx) => clipFunc(ctx, _tempPathNode));
    _tempPathNode?.destroy();
  }

  // 获取path
  function getPathData(width, height, gap = 0) {
    const step = gap || 0;
    const step2 = gap === 0 ? 0 : step / gap;
    const w = width + step;
    const h = height + step;
    // data 的值为 this.print.width和this.print.height 组成的矩形加上step的值
    const data = `M${-step2},${-step2} L${w - step2},${-step2} L${w - step2},${h - step2} L${-step2},${h - step2} Z`;
    return data;
  }

  /**
   * 裁剪函数
   * @param {CanvasRenderingContext2D} ctx ctx
   * @param {Konva.Path} konvaPath konvaPath
   * */
  function clipFunc(ctx, konvaPath) {
    // console.log('裁剪函数 konvaPath', konvaPath);
    if (!konvaPath && !konvaPath?.dataArray) {
      return;
    }
    if (konvaPath?.dataArray?.length === 0) {
      return;
    }
    const list = konvaPath.dataArray;
    _drawSvgPath(ctx, list);
  }
  function _drawSvgPath(ctx, pathData) {
    // ctx 颜色透明
    ctx.strokeStyle = 'rgba(0,0,0,0)';
    // ctx.strokeStyle = 'red';
    ctx.beginPath();

    for (const segment of pathData) {
      const command = segment.command;
      const points = segment.points;

      if (command === 'M') {
        ctx.moveTo(points[0], points[1]);
      } else if (command === 'L') {
        ctx.lineTo(points[0], points[1]);
      } else if (command === 'C') {
        ctx.bezierCurveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
      } else if (command === 'z') {
        ctx.closePath();
      }
    }

    ctx.stroke();
  }

  return {
    setNodeClipFunc,
  };
}

// canvas帮助函数
export function useCanvasHelper(view) {
  // 容器属性
  const { containerRect } = useGlobalApplication().containerElData;
  const { drawWidth, drawHeight } = containerRect;
  // 全局配置
  const { defineData } = useGlobalData();
  const { canvasConfig, modes, PRIMARY_COLOR } = defineData;
  const { canvasDefine, createCanvasIds, getCanvasContainerId } = canvasConfig;
  // 视图
  const { canvasNodes, d_2d, printout, width, height } = view;
  // 节点
  const { stage, designLayer, staticLayer, bd, transformer, designGroup } = canvasNodes;

  /**
   * 判断是否为设计节点
   * @param {Konva.Node} node
   * @returns {boolean}
   */
  function isDesignNode(node) {
    return node?.getName() === createCanvasIds.design;
  }

  /**
   * 判断是否为鼠标变换锚点
   * @param x
   * @param y
   * @returns {boolean}
   */
  function isMouseTransformerAnchor(x, y) {
    return transformer.getChildren((node) => node.getName().indexOf('anchor') > -1).some((node) => node?.intersects({ x, y }));
  }

  /**
   * 选中节点 【transformer】
   * @param node
   */
  function setNode(node = null) {
    const nodes = node ? [node] : [];
    const visible = !!node;
    transformer.nodes(nodes);
    transformer.visible(visible);
  }

  /**
   * 设置模式
   * @param mode
   */
  function setMode(mode) {
    const targetNode = designGroup;
    switch (mode) {
      // 预览模式
      case modes.preview:
        if (d_2d) {
          setNodeClipFunc(targetNode, d_2d);
        } else {
          setNodeClipFunc(targetNode, null);
        }
        break;
      // 编辑模式
      case modes.edit:
        if (printout) {
          setNodeClipFunc(targetNode, { width: width, height: height, gap: 2 });
        } else {
          setNodeClipFunc(targetNode, null);
        }
        break;
    }
  }

  /**
   * 查找节点
   * @param {*} uuid
   * @returns
   */
  function findNode(uuid) {
    return designGroup.findOne((node) => node.attrs.uuid === uuid);
  }

  /**
   * 节点是否选中
   * @param {*} uuid
   */
  function hasCheckNode(uuid = null) {
    return transformer.nodes().some((node) => node?.attrs?.uuid === uuid);
  }

  /**
   * 生成base64
   */
  const generateBase64 = createGenerateBase64(canvasNodes, view);

  /**
   * 获取视图下所有设计节点
   * @returns
   */
  function getDesignChildren() {
    return designGroup.getChildren();
  }

  return {
    canvasNodes: canvasNodes,
    generateBase64: generateBase64.generateBase64,
    generateBase64Debounce: generateBase64.generateBase64Debounce,
    isDesignNode,
    isMouseTransformerAnchor,
    setNode,
    setMode,
    findNode,
    hasCheckNode,
    getDesignChildren,
  };
}

// 生成base64
function createGenerateBase64(canvasNodes, view) {
  const { bd, designLayer } = canvasNodes;
  // 全局配置
  const { defineData } = useGlobalData();
  const { canvasConfig, DEBOUNCE_TIME } = defineData;
  const { canvasDefine } = canvasConfig;

  // 设计区域画布宽度, 距离左上的偏移量
  const drawWidth = bd.width();
  const drawHeight = bd.height();
  const offsetX = designLayer.x();
  const offsetY = designLayer.y();

  // 生成预览图【view】【designLayer】【drawWidth】【drawHeight】【offsetX】【offsetY】
  function generateBase64(pixelRatio = canvasDefine.previewPixelRatio) {
    if (view.base64) {
      view.base64 = null;
    }
    view.base64 = designLayer?.toDataURL({
      x: offsetX,
      y: offsetY,
      width: drawWidth,
      height: drawHeight,
      pixelRatio: pixelRatio,
    });
    // console.log('生成预览图', view.base64);
  }

  // 防抖生成base64
  const generateBase64Result = createEventHook();
  generateBase64Result.on(useDebounceFn(() => generateBase64(), DEBOUNCE_TIME));

  return {
    generateBase64Debounce: generateBase64Result.trigger,
    generateBase64,
  };
}
