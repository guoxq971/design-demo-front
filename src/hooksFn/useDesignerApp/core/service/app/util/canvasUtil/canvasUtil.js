import { useContainerUtil } from '@/hooksFn/useDesignerApp/core/service/app/util/useContainerUtil';
import { createCanvasNode } from '@/hooksFn/useDesignerApp/core/service/app/util/canvasUtil/createCanvasNode';
import { addEventListener } from '@/hooksFn/useDesignerApp/core/service/app/util/canvasUtil/addEventListener';
import { createCanvasIds, modes } from '@/hooksFn/useDesignerApp/core/service/app/define';
import { setNodeClipFunc } from '@/hooksFn/useDesignerApp/core/service/app/util/canvasUtil/canvasClip';
import { createGenerateBase64 } from '@/hooksFn/useDesignerApp/core/service/app/util/canvasUtil/generateBase64';

export class CanvasUtil {
  /**
   * 创建canvas
   * @param {object} param.view
   */
  static createCanvas(param) {
    const { view } = param;

    // 解析数据得到画布尺寸
    const containerRect = useContainerUtil();
    const { stageWidth, stageHeight, drawWidth, drawHeight, offsetX, offsetY } = containerRect;

    // 创建舞台
    const canvasNode = createCanvasNode(view, containerRect);
    const { stage, designLayer, staticLayer, bd, transformer, designGroup } = canvasNode;
    setNodeClipFunc(designLayer, { width: drawWidth, height: drawHeight });

    // 辅助函数 (helper中应该有个destroy销毁所有数据,清空内存)
    const helper = createCanvasHelper(canvasNode, view);

    // 监听事件
    addEventListener(canvasNode, helper);

    // 默认为预览模式
    helper.setMode(modes.preview);

    return {
      helper,
    };
  }
}

/**
 * 创建画布辅助函数
 * @param canvasNode
 * @param view
 */
function createCanvasHelper(canvasNode, view) {
  const { stage, designLayer, staticLayer, bd, transformer, designGroup } = canvasNode;

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
        if (view.d_2d) {
          setNodeClipFunc(targetNode, view.d_2d);
        } else {
          setNodeClipFunc(targetNode, null);
        }
        break;
      // 编辑模式
      case modes.edit:
        if (view.printout) {
          setNodeClipFunc(targetNode, { width: view.width, height: view.height, gap: 2 });
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
  const generateBase64 = createGenerateBase64(canvasNode, view);

  /**
   * 获取视图下所有设计节点
   * @returns
   */
  function getDesignChildren() {
    return designGroup.getChildren();
  }

  return {
    canvasNode,
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
