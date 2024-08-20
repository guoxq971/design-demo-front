import Konva from 'konva';
import { createCanvasIds } from '@/hooksFn/useDesignerApp/core/service/app/define';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { createEventHook } from '@vueuse/core';
import { pick } from 'lodash';

// 创建节点,
// 注册监听事件,
// 设置选中,
// 生成base64,
// 创建节点属性代理
// 更新时同步生成base64(防抖)
/**
 * 创建设计图片节点
 * @param attrs
 * @param helper
 * @returns {{onSort: function, onUpdate: function, attrs: object}}
 */
export function CreateDesignImageNode(attrs, helper) {
  const { canvasNode, setNode, generateBase64Debounce, generateBase64 } = helper;
  const { designGroup } = canvasNode;
  const _node = new Konva.Image({
    name: createCanvasIds.design,
    draggable: true,
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    visible: true,
    uuid: AppUtil.uuid(),
    ...attrs,
  });
  // 创建节点属性代理
  const { onUpdate, onSort, node } = createdNodeProxy(_node);
  // 更新时同步生成base64(防抖)
  onUpdate(() => generateBase64Debounce());
  onSort(() => generateBase64Debounce());

  // 添加到设计组
  designGroup?.add(node);

  // 注册监听事件
  node.on('mousedown', () => setNode(node));
  // 设置选中
  setNode(node);
  // 生成base64
  generateBase64();

  // 创建属性
  const _attrs = getCloneNodeAttrs(node);
  return {
    onUpdate,
    onSort,
    attrs: _attrs,
  };
}

// 克隆节点属性
function getCloneNodeAttrs(node) {
  return pick(node.attrs, ATTRS_FIELDS);
}

const WATCH_ATTRS_FIELDS = ['x', 'y', 'rotation', 'scaleX', 'scaleY', 'visible'];
const ATTRS_FIELDS = [...WATCH_ATTRS_FIELDS, 'uuid'];

/**
 * 设置设计代理
 * @param _node
 * @returns {{node: object, onSort: function, onUpdate: function}}
 */
function createdNodeProxy(_node) {
  const attrsResult = createEventHook();
  const sortResult = createEventHook();
  // 设计发生变化
  _node.attrs = new Proxy(_node.attrs, {
    set(target, key, value) {
      if (ATTRS_FIELDS.includes(key) && target[key] !== value) attrsResult.trigger({ key, value });
      target[key] = value;
      return true;
    },
  });
  // 设计排序发生变化
  _node = new Proxy(_node, {
    set(target, key, value) {
      if (key === 'index' && target[key] !== value) sortResult.trigger({ key, value });
      target[key] = value;
      return true;
    },
  });
  return {
    onUpdate: attrsResult.on,
    onSort: sortResult.on,
    node: _node,
  };
}
