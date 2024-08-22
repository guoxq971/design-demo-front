import { createEventHook, useDebounceFn, useImage } from '@vueuse/core';
import { set } from 'vue';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { isString, pick } from 'lodash';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { useCanvasHelper } from '@/hooksFn/useDesignerApplication/core/app/utils/utils';

export async function createImage(detail, view, templateDpi) {
  // 获取设计区域大小，可用图片地址
  const { width, height, src } = getData(detail, view, templateDpi);
  // 创建图片节点到canvas,并创建节点属性代理
  const { onUpdate, onSort, node } = await createImageNodeToCanvas(view, width, height, src, detail.isBg);
  // 创建vue数据
  const vueData = createVueData(view, detail, node);
  // 更新时同步
  setSync(onUpdate, onSort, view, vueData);
  // 排序
  useCanvasHelper(view).sortDesignList(view.designList);

  // 获取图片在设计区域的大小, 获取可用图片地址
  function getData(detail, view, templateDpi) {
    const { getImageSize } = useImageSize();
    // 获取图片在设计区域的大小
    const imageSize = getImageSize(detail.size, templateDpi, { width: view.width, height: view.height });
    const { width, height } = imageSize.size;
    // 获取可用图片地址
    const src = AppUtil.getImageUrl(detail);

    return {
      width,
      height,
      src,
    };
  }
  // 创建节点到canvas
  async function createImageNodeToCanvas(view, width, height, src, isBg) {
    // 加载图片
    const result = await useImage({ src, crossorigin: true, width, height });
    if (!result.isReady.value) return Promise.reject('图片加载失败');

    const helper = useCanvasHelper(view);
    const canvasNodes = view.canvasNodes;
    const { designs } = useGlobalData().defineData;
    const { createCanvasIds } = useGlobalData().defineData.canvasConfig;
    const parent = isBg ? canvasNodes.bgGroup : canvasNodes.designGroup;

    let node = new Konva.Image({
      draggable: true,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      visible: true,
      uuid: AppUtil.uuid(),
      type: isBg ? designs.bgImage : designs.image,
      image: result.state.value,
      width: width,
      height: height,
    });
    // 创建节点属性代理
    const nodeProxy = createdNodeProxy(node);
    node = nodeProxy.node;
    // 添加到设计组
    parent?.add(node);
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
    const watch_attrs_fields = ['x', 'y', 'rotation', 'scaleX', 'scaleY', 'visible'];
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
  // 创建添加vue数据
  function createVueData(view, detail, node) {
    const { designs, DEBOUNCE_TIME } = useGlobalData().defineData;
    const isBg = detail.isBg;
    const type = isBg ? designs.bgImage : designs.image;
    const url = AppUtil.getImageUrl(detail);
    const previewUrl = isBg ? detail.designImg : detail.previewImg;
    const name = isBg ? detail.imageName : detail.name;
    const vueData = {
      x: node.attrs.x,
      y: node.attrs.y,
      rotation: node.attrs.rotation,
      scaleX: node.attrs.scaleX,
      scaleY: node.attrs.scaleY,
      visible: node.attrs.visible,
      uuid: node.attrs.uuid,
      viewId: view.id,
      detail: detail,
      type: type, //设计类型
      url: url, //节点使用的图片地址
      previewUrl: previewUrl, //预览图地址
      name: name, //图片名称
    };
    view.designList.push(vueData);
    return vueData;
  }
  // 设置同步
  function setSync(onUpdate, onSort, view, vueData) {
    const { DEBOUNCE_TIME } = useGlobalData().defineData;
    // 更新时同步
    const helper = useCanvasHelper(view);
    onUpdate(({ key, value }) => {
      //生成base64
      helper.generateBase64Debounce();
      //同步数据
      useDebounceFn(() => vueData && set(vueData, key, value), DEBOUNCE_TIME)();
    });
    onSort(() => helper.sortDesignList(view.designList));
  }
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
