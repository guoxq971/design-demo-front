import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { Message } from 'element-ui';
import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/app/useDesign/imageSize';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useImage } from '@vueuse/core';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { nextTick } from 'vue';

/**
 * 设置设计图
 * @param detail
 * @param view
 * @param {setImageOptions} options
 * @returns {Promise<{node}>}
 */
export async function setImage(detail, view, options = {}) {
  // 获取数据
  view = view ? view : useGlobalDesigner().app.activeView.value;
  const { parentNode, width, height, src } = getData(detail, view);
  const tool = useGlobalDesigner().app.tool(view);
  // 加载图片
  const result = await loadImage(src, width, height);
  // 创建节点
  let node = createdNode(result.state.value, width, height, detail);
  // 节点代理
  node = setProxy(node);
  // 添加到设计组
  parentNode?.add(node);
  // 注册监听事件
  node.on('mousedown', () => tool.setNode(node));
  // 设置选中
  if (detail.isBg) {
    if (view.id === useGlobalDesigner().app.activeViewId) {
      tool.setNode(node);
    }
  } else {
    tool.setNode(node);
  }
  // 居中
  if (options.isCenter) {
    tool.centerXY({ node });
  }

  // 生成base64
  if (detail.isBg) {
    nextTick(() => tool.generateBase64Fn());
  } else {
    tool.generateBase64Debounce();
  }

  return {
    node,
  };

  // 获取数据
  function getData(detail, view) {
    // 模板dpi
    const dpi = useGlobalDesigner().app.activeTemplate.value.detail.dpi;
    const parentNode = detail.isBg ? view.canvasNodes.bgGroup : view.canvasNodes.designGroup;
    // 获取设计区域大小，可用图片地址
    const { width, height } = getImageSize(detail.size, dpi, { width: view.width, height: view.height }).size;
    // 获取可用图片地址
    const src = AppUtil.getImageUrl(detail);

    return {
      dpi,
      view,
      parentNode,
      width,
      height,
      src,
    };
  }
  // 加载图片
  async function loadImage(src, width, height) {
    // 加载图片
    const result = await useImage({ src, crossorigin: true, width, height });
    if (!result.isReady.value) return Promise.reject('图片加载失败');
    return result;
  }
  // 创建节点
  function createdNode(image, width, height, detail) {
    const type = detail.isBg ? useGlobalData().defineData.designs.bgImage : useGlobalData().defineData.designs.image;
    return new Konva.Image({
      draggable: true,
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      visible: true,
      viewId: view.id,
      uuid: AppUtil.uuid(),
      offsetX: width / 2,
      offsetY: height / 2,
      type: type,
      detail,
      image: image,
      width: width,
      height: height,
      ...options.attrs,
    });
  }
  // 设置代理
  function setProxy(node) {
    // 节点代理
    const nodeAttrsResult = AppUtil.createObjectProsy(node.attrs, ['x', 'y', 'scaleX', 'scaleY', 'visible', 'rotation']);
    node.attrs = nodeAttrsResult.proxy;
    const nodeResult = AppUtil.createObjectProsy(node, 'index');
    node = nodeResult.proxy;
    nodeAttrsResult.onUpdate(() => {
      tool.generateBase64Debounce();
    });
    nodeResult.onUpdate(() => {
      tool.generateBase64Debounce();
    });
    return node;
  }
}
