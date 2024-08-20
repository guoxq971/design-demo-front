import { createEventHook, createGlobalState, useElementBounding } from '@vueuse/core';
import { computed, ref } from 'vue';
// utils
import { parseTemplate } from './utils/utils';

export const useGlobalApplication = createGlobalState(() => {
  // 模板基础数据
  const templateData = useTemplateData();

  // 设置模板
  const { setTemplate } = useSetTemplate(templateData);
  // 设置设计图
  function setDesignImage(detail) {}
  // 容器
  const containerElData = useContainerEL();

  return {
    // 容器
    containerElData,
    // 模板基础数据
    templateData,
    // 设置模板
    setTemplate,
    // 添加设计图
    setDesignImage,
  };
});

// 模板基础数据
function useTemplateData() {
  // 模板列表[通用,精细]
  const templateList = ref([]);
  // 模板id
  const activeTemplateId = ref('');
  // 模板 (模板列表>模板)
  const activeTemplate = computed(() => templateList.value?.find((item) => item.detail.id === activeTemplateId.value));
  // 设置模板id

  // 视图列表
  const activeViewList = computed(() => activeTemplate.value?.viewList);
  // 视图id
  const activeViewId = ref('');
  // 视图 (模板>视图列表>视图)
  const activeView = computed(() => activeViewList.value?.find((item) => item.id === activeViewId.value));
  // 设置视图id

  // 尺码列表
  const activeSizeList = computed(() => activeTemplate.value?.sizeList);
  //尺码id
  const activeSizeId = ref('');
  // 尺码 (模板>尺码列表>尺码)
  const activeSize = computed(() => activeSizeList.value?.find((item) => item.id === activeSizeId.value));
  // 设置尺码id

  // 颜色列表
  const activeColorList = computed(() => activeTemplate.value?.colorList);
  // 颜色id
  const activeColorId = ref('');
  // 颜色 (模板>颜色列表>颜色)
  const activeColor = computed(() => activeColorList.value?.find((item) => item.id === activeColorId.value));
  // 设置颜色id

  return {
    // 模板
    templateList,
    activeTemplateId,
    activeTemplate,
    // 视图
    activeViewId,
    activeView,
    // 尺码
    activeSizeId,
    activeSize,
    // 颜色
    activeColorId,
    activeColor,
  };
}

// 设置模板
function useSetTemplate(templateData) {
  const { templateList, activeTemplateId, activeViewId, activeColorId, activeSizeId } = templateData;

  // 设置模板
  function setTemplate(detail) {
    // 解析模板详情
    const template = parseTemplate(detail);
    const { viewList, colorList, sizeList } = template;
    viewList.forEach((view) => {
      view.base64 = ''; // 预览图
      view.designList = []; // 设计列表
      view.canvasNodes = null; // canvas节点
      view.helper = null; // 工具
    });
    // 数据初始化
    templateList.value = [];
    templateList.value.push(template);
    activeTemplateId.value = detail.id;
    activeViewId.value = template.viewList[0].id;
    activeColorId.value = template.colorList[0].id;
    activeSizeId.value = template.sizeList[0].id;
    // 设置canvas
  }

  return {
    setTemplate,
  };
}

// 容器
function useContainerEL() {
  // canvas容器(konva舞台)
  const canvasElRef = ref(null);
  // img(产品图)
  const imgElRef = ref(null);

  // 组装属性
  const canvasRect = useElementBounding(canvasElRef);
  const imgRect = useElementBounding(imgElRef);

  // 钩子
  const event = createEventHook();

  // 容器rect
  const containerRect = computed(() => {
    // 舞台的宽高
    const stageWidth = canvasRect.width.value;
    const stageHeight = canvasRect.height.value;

    // 产品绘制区域的宽高
    const drawWidth = imgRect.width.value;
    const drawHeight = imgRect.height.value;

    // 产品绘制区域相当于舞台的偏移量
    const offsetX = imgRect.left.value - canvasRect.left.value;
    const offsetY = imgRect.top.value - canvasRect.top.value;

    const result = {
      canvasRect,
      imgRect,
      stageWidth,
      stageHeight,
      drawWidth,
      drawHeight,
      offsetX,
      offsetY,
    };

    // 触发钩子
    event.trigger(result);

    return result;
  });

  return {
    canvasElRef,
    imgElRef,
    containerRect,
    onUpdate: event.on,
  };
}
