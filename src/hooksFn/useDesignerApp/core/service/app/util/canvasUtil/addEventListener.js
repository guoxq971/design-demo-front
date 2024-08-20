import { createCanvasIds, modes } from '@/hooksFn/useDesignerApp/core/service/app/define';

export function addEventListener(canvasNode, helper) {
  const { stage, designLayer, staticLayer, bd, transformer, designGroup } = canvasNode;
  const { isDesignNode, isMouseTransformerAnchor, setNode, setMode } = helper;

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
