import { nextTick, set } from 'vue';
import { createEventHook, useDebounceFn } from '@vueuse/core';
// utils
import { useCanvasHelper } from '@/hooksFn/useDesignerApplication/core/app/utils/utils';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';

export function CreateText(param, view) {
  // 判断是否存在,存在就直接修改
  if (isExistWithUpdate(view, param)) return;
  // 不存在就创建节点
  const { onUpdate, onSort, node } = createTextNodeToCanvas(view, param);
  // 创建vue数据
  const vueData = createVueData(view, node);
  // 更新时同步生成base64(防抖)
  setSync(onUpdate, onSort, view, vueData);
  // 排序
  useCanvasHelper(view).sortDesignList(view.designList);

  // 判断是否存在,存在就直接修改
  function isExistWithUpdate(view, param) {
    param = getParam(param);
    const targetNode = findTextNode(view, param.uuid);
    if (targetNode) {
      targetNode.setAttrs({
        text: param.text,
        fill: param.fill,
      });
      setTimeout(() => {
        targetNode.setAttrs({
          width: targetNode.width(),
          height: targetNode.height(),
        });
      });
      return true;
    }
    return false;
  }
  // 查找文字节点
  function findTextNode(view, uuid) {
    const helper = useCanvasHelper(view);
    return helper.getDesignChildren().find((item) => item.attrs.uuid === uuid);
  }
  // 创建文字节点
  function createTextNodeToCanvas(view, param) {
    param = getParam(param);
    const helper = useCanvasHelper(view);
    const { designs } = useGlobalData().defineData;
    const { createCanvasIds } = useGlobalData().defineData.canvasConfig;
    const { designGroup } = helper.canvasNodes;
    let node = new Konva.Text({
      draggable: true,
      x: 0,
      y: 0,
      fill: param.fill,
      text: param.text,
      visible: true,
      type: designs.text,
      uuid: AppUtil.uuid(),
    });
    // 设置文字的宽高
    setTimeout(() => {
      node.setAttrs({
        width: node.width(),
        height: node.height(),
      });
    });
    // 创建节点属性代理
    const nodeProxy = createdNodeProxy(node);
    node = nodeProxy.node;
    // 添加到canvas
    designGroup.add(node);
    // 注册监听事件
    node.on('mousedown', () => helper.setNode(node));
    // 设置选中
    helper.setNode(node);
    // 生成base64
    helper.generateBase64Debounce();
    return {
      onUpdate: nodeProxy.onUpdate,
      onSort: nodeProxy.onSort,
      node: node,
    };
  }
  /**
   * 创建节点属性代理
   * @param node
   * @returns {{node: Object, onSort: EventHookOn<*>, onUpdate: EventHookOn<*>}}
   */
  function createdNodeProxy(node) {
    // 代理属性
    const watch_attrs_fields = ['x', 'y', 'rotation', 'scaleX', 'scaleY', 'visible', 'text', 'fill'];
    const attrs_fields = [...watch_attrs_fields, 'uuid'];

    // 设计发生变化
    const attrsProxy = AppUtil.createObjectProsy(node.attrs, attrs_fields);
    node.attrs = attrsProxy.proxy;
    // 设计排序发生变化
    const sortProxy = AppUtil.createObjectProsy(node, 'index');
    node = sortProxy.proxy;

    return {
      onUpdate: attrsProxy.onUpdate,
      onSort: sortProxy.onUpdate,
      node: node,
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
      type: designs.text,
      text: node.attrs.text,
      fill: node.attrs.fill,
    };
    view.designList.push(vueData);
    return vueData;
  }
  // 设置同步
  function setSync(onUpdate, onSort, view, vueData) {
    const helper = useCanvasHelper(view);
    const { DEBOUNCE_TIME } = useGlobalData().defineData;
    onUpdate(({ key, value }) => {
      //生成base64
      helper.generateBase64Debounce();
      //同步数据
      useDebounceFn(() => set(vueData, key, value), DEBOUNCE_TIME)();
    });
    onSort(() => helper.sortDesignList(view.designList));
  }
}

export function getParam(param = {}) {
  param = Object.assign(
    {
      text: '',
      fill: '',
      uuid: '',
    },
    param,
  );

  return {
    ...param,
    text: param.text,
    fill: param.fill,
    uuid: param.uuid,
  };
}
