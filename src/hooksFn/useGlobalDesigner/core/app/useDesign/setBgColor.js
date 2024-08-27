import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';

export function setBgColor(color, view) {
  const { designs } = useGlobalDesigner().app.config;
  // 判断是否存在,存在就直接修改
  const isSome = view.canvasNodes.bgcGroup.children.some((item) => item.attrs.type === designs.bgColor);
  if (isSome) {
    useGlobalDesigner().app.activeTemplate.value.viewList.forEach((view) => {
      view.canvasNodes.bgcGroup.children.forEach((item) => {
        item.attrs.type === designs.bgColor && item.fill(color);
      });
    });
  } else {
    let node = new Konva.Rect({
      draggable: false,
      x: 0,
      y: 0,
      width: view.width,
      height: view.height,
      fill: color,
      visible: true,
      type: designs.bgColor,
      uuid: AppUtil.uuid(),
    });
    // 创建节点属性代理
    const tool = useGlobalDesigner().app.tool(view);
    const watch_attrs = ['fill', 'visible'];
    const attrsProxy = AppUtil.createObjectProsy(node.attrs, watch_attrs);
    node.attrs = attrsProxy.proxy;
    attrsProxy.onUpdate(() => tool.generateBase64Debounce());
    // 添加到canvas
    view.canvasNodes.bgcGroup.add(node);
    // 生成base64
    tool.generateBase64Debounce();
  }
}
