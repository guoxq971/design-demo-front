import { createEventHook, useImage } from '@vueuse/core';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { pick } from 'lodash';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { useHelper } from '@/hooksFn/useDesignerApp/core/service/app/utils/helper';

export function createImage(detail, view, templateDpi) {
  const { getImageSize } = useImageSize();
  // 获取图片在设计区域的大小
  const imageSize = getImageSize(detail.size, templateDpi, { width: view.width, height: view.height });
  const { width, height } = imageSize.size;
  // 获取可用图片地址
  const src = AppUtil.getImageUrl(detail);
  const { CreateDesignImageNode } = useCrateDesignImageNode(view);

  // 加载图片到设计区域
  return useImage({ src, crossorigin: true, width, height }).then((result) => {
    const { isReady, state } = result;
    if (!isReady.value) return;

    // 创建图片节点到canvas
    const _attrs = { image: state.value, width, height };
    const { onSort, onUpdate, attrs } = CreateDesignImageNode(_attrs);

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
function useCrateDesignImageNode(view) {
  const helper = useHelper(view);

  /**
   * 创建设计图片节点
   * @param attrs
   * @returns {{onSort: function, onUpdate: function, attrs: object}}
   */
  function CreateDesignImageNode(attrs) {
    const { createCanvasIds } = useGlobalData().defineData.canvasConfig;
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

  return {
    CreateDesignImageNode,
  };
}

// 设计图尺寸
function useImageSize() {
  /**
   * 图片尺码换算
   * @param {object} imageSize 图片的宽高 {width,height}
   * @param {number} prodDpi dpi
   * @param {object} printSize 打印区域的宽高 {width,height}
   */
  function getImageSize(imageSize, prodDpi, printSize) {
    const inch = inchToPx(imageSize, prodDpi);
    return printAreaToImageRatio(inch, printSize);
  }

  /**
   * px转换为mm
   * @param {object} size 尺寸 {width,height}
   * @param {number} dpi dpi
   * @returns {width:number,height:number} 宽高
   * */
  function inchToPx(size, dpi) {
    // const dpi = getters.activeProd.detail.dpi; // 当前产品的dpi
    //全局的
    // px -> mm
    let a = function(size, dpi) {
      return (25.4 * size) / dpi;
    };
    return {
      height: a(size.height, dpi),
      width: a(size.width, dpi),
    };
  }

  /**
   * 获取图片在打印区域的比例
   * @param {object} imageSize 图片的宽高
   * @param {object} printAreaSize 打印区域的宽高
   * */
  function printAreaToImageRatio(imageSize, printAreaSize) {
    // 宽高的比例
    let widthRatio = '';
    let heightRatio = '';
    if (imageSize.width > printAreaSize.width) {
      widthRatio = printAreaSize.width / imageSize.width;
    } else {
      widthRatio = 1;
    }
    if (imageSize.height * widthRatio > printAreaSize.height) {
      heightRatio = printAreaSize.height / (imageSize.height * widthRatio);
    } else {
      heightRatio = 1;
    }
    return {
      inch: imageSize,
      widthRatio: widthRatio,
      heightRatio: heightRatio,
      ratio: {
        value: widthRatio * heightRatio,
        width: widthRatio,
        height: heightRatio,
      },
      size: {
        width: imageSize.width * widthRatio * heightRatio,
        height: imageSize.height * widthRatio * heightRatio,
      },
    };
  }

  return {
    getImageSize,
  };
}
