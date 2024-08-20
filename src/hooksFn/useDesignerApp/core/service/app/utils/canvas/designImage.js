import { createEventHook, useImage } from '@vueuse/core';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { getImageSize } from '@/hooksFn/useDesignerApp/core/service/app/utils/image/size';
import { useHelper } from '@/hooksFn/useDesignerApp/core/service/app/utils/helper';
import { createCanvasIds } from '@/hooksFn/useDesignerApp/core/service/app/define';
import { pick } from 'lodash';

/**
 * 创建图片
 * @param param
 */
export async function createDesignImage(param) {
  const { detail, viewWidth, viewHeight, dpi, view } = param;
  const helper = useHelper(view);

  // 获取图片在设计区域的大小
  const imageSize = getImageSize(detail.size, dpi, { width: viewWidth, height: viewHeight });
  const { width, height } = imageSize.size;
  // 获取可用图片地址
  const src = AppUtil.getImageUrl(detail);

  // 加载图片到设计区域
  return useImage({ src, crossorigin: true, width, height }).then((result) => {
    const { isReady, state } = result;
    if (!isReady.value) return;

    // 创建图片节点到canvas
    const _attrs = { image: state.value, width, height };
    const { onSort, onUpdate, attrs } = CreateDesignImageNode(_attrs, helper);

    return {
      attrs,
      onUpdate,
      onSort,
    };
  });
}

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
function CreateDesignImageNode(attrs, helper) {
  const { canvasNodes, setNode, generateBase64Debounce, generateBase64 } = helper;
  const { designGroup } = canvasNodes;
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
