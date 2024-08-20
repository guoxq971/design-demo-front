import { createEventHook, useDebounceFn, useElementBounding } from '@vueuse/core';
import { ref, computed, isRef, nextTick, shallowRef, set } from 'vue';
// utils
import { TemplateUtil } from '@/hooksFn/useDesignerApp/core/service/app/util/templateUtil';
import { createCanvasNode } from '@/hooksFn/useDesignerApp/core/service/app/utils/canvas/createNode';
import { setNodeClipFunc } from '@/hooksFn/useDesignerApp/core/service/app/utils/canvas/clip';
import { createDesignImage } from '@/hooksFn/useDesignerApp/core/service/app/utils/canvas/designImage';
import { createGenerateBase64 } from '@/hooksFn/useDesignerApp/core/service/app/utils/canvas/generateBase64';
import { useHelper } from '@/hooksFn/useDesignerApp/core/service/app/utils/helper';
import { DEBOUNCE_TIME, designs } from '@/hooksFn/useDesignerApp/core/service/app/define';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';

export function useAppService() {
  // 容器坐标
  const { setContainerEl, getContainerElRect, onContainerInit } = useContainerEl();
  // canvas
  const { createCanvas } = useCanvas();
  // 模板
  const { templateList, activeTemplateId, activeTemplate, setTemplate, onTemplateInit, onCreateCanvas } = useTemplate(getContainerElRect);
  // 模板初始化
  onTemplateInit((template) => {
    activeViewId.value = template.viewList[0].id;
    activeColorId.value = template.colorList[0].id;
    activeSizeId.value = template.sizeList[0].id;
  });
  // 创建canvas
  onCreateCanvas((template) => {
    nextTick(() => {
      const rect = getContainerElRect();
      template.viewList.forEach((view) => {
        const { canvasNodes } = createCanvas(view, rect);
        view.canvasNodes = shallowRef(canvasNodes);
        view.helper = useHelper(view);
      });
    });
  });
  // 视图
  const { activeViewId, activeView, setViewId, activeViewDesignList, activeViewDesignListReverse } = useView(activeTemplate);
  // 尺码
  const { activeSizeId, activeSize, setSizeId } = useSize(activeView);
  // 颜色
  const { activeColorId, activeColor, setColorId, getViewImageByActiveColor } = useColor(activeTemplate);
  // 设计
  const { activeDesignId, addDesignImage: _addDesignImage } = useDesign();
  // 添加设计图
  async function addDesignImage(detail) {
    const helper = useHelper(activeView.value);
    // 创建canvas节点
    const { attrs, onUpdate, onSort } = await createDesignImage({
      detail,
      viewWidth: activeView.value.width,
      viewHeight: activeView.value.height,
      dpi: activeTemplate.value.detail.dpi,
      // helper: useHelper(activeView.value),
      view: activeView.value,
    });
    // 创建view.designList的design数据
    attrs['type'] = designs.image; //类型
    attrs['url'] = AppUtil.getImageUrl(detail); //节点使用的图片地址
    attrs['previewUrl'] = detail.previewImg; //预览图地址
    attrs['name'] = detail.name; //图片名称
    attrs['detail'] = detail; //图片详情
    attrs['viewId'] = activeViewId.value;
    attrs['templateId'] = activeTemplateId.value;
    activeView.value.designList.push(attrs);
    // 设计更新时,同步设计属性
    onUpdate(useDebounceFn(({ key, value }) => attrs && set(attrs, key, value), DEBOUNCE_TIME));
    // 设计排序时,同步下标
    onSort(() => {
      const idxMap = new Map();
      helper.getDesignChildren().forEach((node, i) => idxMap.set(node.attrs.uuid, i));
      // designList 根据zIndex排序
      activeView.value.designList.sort((a, b) => idxMap.get(a.uuid) - idxMap.get(b.uuid));
    });
  }

  return {
    // 容器坐标
    setContainerEl,
    getContainerElRect,
    onContainerInit,
    // 模板
    templateList,
    activeTemplateId,
    activeTemplate,
    setTemplate,
    // 视图
    activeViewId,
    activeView,
    setViewId,
    activeViewDesignList,
    activeViewDesignListReverse,
    // 尺码
    activeSizeId,
    activeSize,
    setSizeId,
    // 颜色
    activeColorId,
    getViewImageByActiveColor,
    activeColor,
    setColorId,
    // 设计
    activeDesignId,
    addDesignImage,
  };
}

// 模板
function useTemplate() {
  const templateList = ref([]); //模板列表
  const activeTemplateId = ref(''); //模板id
  const activeTemplate = computed(() => templateList.value?.find((item) => item.detail.id === activeTemplateId.value));

  // 钩子
  const initEvent = createEventHook();
  const createCanvasEvent = createEventHook();

  /**
   * 设置模板
   * @param {object} detail 模板详情
   */
  function setTemplate(detail) {
    // 解析模板详情
    const template = TemplateUtil.parseTemplate(detail);
    const { viewList, colorList, sizeList } = template;
    viewList.forEach((view) => {
      view.base64 = ''; // 预览图
      view.designList = []; // 设计列表
      view.canvasNodes = null; // canvas节点
      view.helper = null; // 工具
    });
    templateList.value = [];
    templateList.value.push(template);
    activeTemplateId.value = detail.id;
    // 初始化成功
    initEvent.trigger(template);
    // 创建canvas
    createCanvasEvent.trigger(template);
  }

  return {
    templateList,
    activeTemplateId,
    activeTemplate,
    setTemplate,
    onTemplateInit: initEvent.on,
    onCreateCanvas: createCanvasEvent.on,
  };
}

// 视图
function useView(template) {
  template = isRef(template) ? template : ref(template);
  //视图id
  const activeViewId = ref('');
  const activeView = computed(() => template.value?.viewList?.find((item) => item.id === activeViewId.value));
  // 设计列表(激活的)
  const activeViewDesignList = computed(() => activeView.value?.designList || []);
  // 翻转 activeViewDesignList
  const activeViewDesignListReverse = computed(() => activeViewDesignList.value.slice().reverse());

  function setViewId(viewId) {
    activeViewId.value = viewId;
  }
  return {
    activeViewId,
    activeView,
    setViewId,
    activeViewDesignList,
    activeViewDesignListReverse,
  };
}

// 尺码
function useSize(template) {
  template = isRef(template) ? template : ref(template);
  const activeSizeId = ref(''); //尺寸id
  const activeSize = computed(() => template.value?.sizeList?.find((item) => item.id === activeSizeId.value));
  // 切换尺码
  function setSizeId(sizeId) {
    activeSizeId.value = sizeId;
  }
  return {
    activeSizeId,
    activeSize,
    setSizeId,
  };
}

// 颜色
function useColor(template) {
  template = isRef(template) ? template : ref(template);
  const activeColorId = ref(''); //颜色id
  const activeColor = computed(() => template.value?.colorList?.find((item) => item.id === activeColorId.value));

  // 展示视图图片根据颜色
  const getViewImageByActiveColor = computed(() => {
    return (viewId) => {
      const result = activeColor.value?.views.find((item) => item.id === viewId);

      return {
        image: result?.image,
        texture: result?.texture,
      };
    };
  });

  // 切换颜色
  function setColorId(colorId) {
    activeColorId.value = colorId;
  }

  return {
    activeColorId,
    activeColor,
    setColorId,
    getViewImageByActiveColor,
  };
}

// 设计
function useDesign() {
  // 当前激活的设计id
  const activeDesignId = ref('');

  return {
    activeDesignId,
  };
}

// 容器坐标
function useContainerEl() {
  // canvas容器(konva舞台)
  const canvasElRef = ref(null);
  // img(产品图)
  const imgElRef = ref(null);

  // 钩子
  const containerEvent = createEventHook();

  // 设置容器
  function setContainerEl(_canvasElRef, _imgElRef) {
    canvasElRef.value = _canvasElRef;
    imgElRef.value = _imgElRef;

    nextTick(() => {
      containerEvent.trigger(getContainerElRect());
    });
  }

  // 获取容器坐标
  function getContainerElRect() {
    const canvasRect = useElementBounding(canvasElRef);
    const imgRect = useElementBounding(imgElRef);

    // 舞台的宽高
    const stageWidth = canvasRect.width.value;
    const stageHeight = canvasRect.height.value;

    // 产品绘制区域的宽高
    const drawWidth = imgRect.width.value;
    const drawHeight = imgRect.height.value;

    // 产品绘制区域相当于舞台的偏移量
    const offsetX = imgRect.left.value - canvasRect.left.value;
    const offsetY = imgRect.top.value - canvasRect.top.value;

    return {
      canvasRect,
      imgRect,
      stageWidth,
      stageHeight,
      drawWidth,
      drawHeight,
      offsetX,
      offsetY,
    };
  }

  return {
    canvasElRef,
    imgElRef,
    getContainerElRect,
    setContainerEl,
    onContainerInit: containerEvent.on,
  };
}

//  canvas
function useCanvas() {
  /**
   * 创建canvas
   * @param {object} view template.viewList
   * @param {object} rect 节点坐标 getContainerElRect()
   * @returns {object} canvasNodes
   */
  function createCanvas(view, rect) {
    const { stageWidth, stageHeight, drawWidth, drawHeight, offsetX, offsetY } = rect;
    // 创建舞台
    const canvasNodes = createCanvasNode(view, rect);
    const { stage, designLayer, staticLayer, bd, transformer, designGroup } = canvasNodes;
    setNodeClipFunc(designLayer, { width: drawWidth, height: drawHeight });
    // TODO：设置舞台点击监听事件
    return { canvasNodes };
  }

  return {
    createCanvas,
  };
}
