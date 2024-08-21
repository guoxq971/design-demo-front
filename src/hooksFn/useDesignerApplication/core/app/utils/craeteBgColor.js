import { set } from 'vue';
import { createEventHook, useDebounceFn } from '@vueuse/core';
// utils
import { useCanvasHelper } from '@/hooksFn/useDesignerApplication/core/app/utils/utils';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';

export function createBgColor(color, view) {
  // 判断是否存在,存在就直接修改
  if (isExistWithUpdate(view, color)) return;
  // 不存在就创建节点
  const { onUpdate, node } = createBgColorNodeToCanvas(view, color);
  // 创建vue数据
  const vueData = createVueData(view, node);
  // 更新时同步生成base64(防抖)
  setSync(onUpdate, view, vueData);
  // 排序
  useCanvasHelper(view).sortDesignList(view.designList);

  // 判断是否存在,存在就直接修改
  function isExistWithUpdate(view, color) {
    const bgColorNode = findBgColorNode(view);
    if (bgColorNode) {
      bgColorNode.fill(color);
      return true;
    }
    return false;
  }
  // 查找背景色节点
  function findBgColorNode(view) {
    const helper = useCanvasHelper(view);
    const { designs } = useGlobalData().defineData;
    return helper.getDesignChildren().find((item) => item.attrs.type === designs.bgColor);
  }
  // 创建背景色节点
  function createBgColorNodeToCanvas(view, color) {
    const helper = useCanvasHelper(view);
    const { designs } = useGlobalData().defineData;
    const { createCanvasIds } = useGlobalData().defineData.canvasConfig;
    const { canvasNodes, generateBase64Debounce } = helper;
    const { bgcGroup } = canvasNodes;
    const node = new Konva.Rect({
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
    const watch_attrs = ['fill', 'visible'];
    const attrsProxy = AppUtil.createObjectProsy(node.attrs, watch_attrs);
    node.attrs = attrsProxy.proxy;
    // 添加到canvas
    bgcGroup.add(node);
    generateBase64Debounce();
    return {
      onUpdate: attrsProxy.onUpdate,
      node,
    };
  }
  // 创建vue数据
  function createVueData(view, node) {
    const { designs } = useGlobalData().defineData;
    const vueData = {
      x: 0,
      y: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      visible: node.attrs.visible,
      uuid: node.attrs.uuid,
      viewId: view.id,
      isBgColor: 1,
      type: designs.bgColor,
      fill: node.attrs.fill,
    };
    view.designList.push(vueData);
    return vueData;
  }
  // 设置同步
  function setSync(onUpdate, view, vueData) {
    const helper = useCanvasHelper(view);
    const { DEBOUNCE_TIME } = useGlobalData().defineData;
    onUpdate(({ key, value }) => {
      helper.generateBase64Debounce();
      useDebounceFn(() => set(vueData, key, value), DEBOUNCE_TIME)();
    });
  }
}
