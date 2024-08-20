import { createEventHook, createGlobalState, useDebounceFn, useElementBounding } from '@vueuse/core';
import { watchEffect, ref, computed, reactive, nextTick, set } from 'vue';
// utils
import { parseTemplate, createCanvas, useCanvasHelper } from './utils/utils';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { createImage } from '@/hooksFn/useDesignerApplication/core/app/utils/createImage';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { useHelper } from '@/hooksFn/useDesignerApp/core/service/app/utils/helper';

export const useGlobalApplication = createGlobalState(() => {
  // 模板基础数据
  const templateData = useTemplateData();
  // 模板组合数据
  const templateGroupData = useTemplateGroup(templateData);

  // 设置模板
  const { setTemplate } = useSetTemplate(templateData);
  // 设置设计
  const { setDesignImage } = useSetDesign(templateData);
  // 容器
  const containerElData = useContainerEL();

  return {
    // 容器
    containerElData,
    // 模板基础数据
    templateData,
    templateGroupData,
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
  const setTemplateId = (templateId) => (activeTemplateId.value = templateId);

  // 视图列表
  const activeViewList = computed(() => activeTemplate.value?.viewList);
  // 视图id
  const activeViewId = ref('');
  // 视图 (模板>视图列表>视图)
  const activeView = computed(() => activeViewList.value?.find((item) => item.id === activeViewId.value));
  // 设置视图id
  const setViewId = (viewId) => (activeViewId.value = viewId);

  // 尺码列表
  const activeSizeList = computed(() => activeTemplate.value?.sizeList);
  //尺码id
  const activeSizeId = ref('');
  // 尺码 (模板>尺码列表>尺码)
  const activeSize = computed(() => activeSizeList.value?.find((item) => item.id === activeSizeId.value));
  // 设置尺码id
  const setSizeId = (sizeId) => (activeSizeId.value = sizeId);

  // 颜色列表
  const activeColorList = computed(() => activeTemplate.value?.colorList);
  // 颜色id
  const activeColorId = ref('');
  // 颜色 (模板>颜色列表>颜色)
  const activeColor = computed(() => activeColorList.value?.find((item) => item.id === activeColorId.value));
  // 设置颜色id
  const setColorId = (colorId) => (activeColorId.value = colorId);

  return {
    // 模板
    templateList,
    activeTemplateId,
    activeTemplate,
    setTemplateId,
    // 视图
    activeViewId,
    activeView,
    setViewId,
    // 尺码
    activeSizeId,
    activeSize,
    setSizeId,
    // 颜色
    activeColorId,
    activeColor,
    setColorId,
  };
}

// 模板组合数据
function useTemplateGroup(templateData) {
  const { templateList, activeTemplateId, activeTemplate, setViewId, activeViewId, activeView, activeSizeId, activeSize, activeColorId, activeColor } = templateData;

  // 产品图,背景图: 根据当前激活的颜色和视图获取
  const getViewImageByActiveColor = computed(() => {
    return (viewId) => {
      const result = activeColor.value?.views.find((item) => item.id === viewId);
      return {
        texture: result?.texture,
        image: result?.image,
      };
    };
  });

  // 获取base64
  const getBase64ByViewId = computed(() => {
    return (viewId) => activeTemplate.value?.viewList?.find((item) => item.id === viewId)?.base64;
  });

  return {
    getViewImageByActiveColor,
    getBase64ByViewId,
  };
}

// 设置模板
function useSetTemplate(templateData) {
  const { templateList, activeTemplateId, activeViewId, activeColorId, activeSizeId } = templateData;
  const { modes } = useGlobalData().defineData;

  // 设置模板
  function setTemplate(detail) {
    // 解析模板详情
    const template = parseTemplate(detail);
    const { viewList, colorList, sizeList } = template;
    viewList.forEach((view) => {
      view.base64 = ''; // 预览图
      view.designList = []; // 设计列表
      view.canvasNodes = null; // canvas节点
    });
    // 数据初始化
    templateList.value = [];
    templateList.value.push(template);
    activeTemplateId.value = detail.id;
    activeViewId.value = template.viewList[0].id;
    activeColorId.value = template.colorList[0].id;
    activeSizeId.value = template.sizeList[0].id;
    // 设置canvas
    nextTick(() => {
      template.viewList.forEach((view) => {
        createCanvas(view);
      });
    });
  }

  return {
    setTemplate,
  };
}

// 设置设计
function useSetDesign(templateData) {
  // 模板基础数据
  const { templateList, activeTemplateId, activeTemplate, activeViewId, activeView, activeColorId, activeSizeId } = templateData;
  const { defineData } = useGlobalData();
  const { designs, DEBOUNCE_TIME } = defineData;

  // 设置设计图
  async function setDesignImage(detail) {
    // 帮助函数
    const helper = useHelper(activeView.value);
    // 模板dpi
    const templateDpi = activeTemplate.value?.detail.dpi;
    // 创建设计图片节点
    const { attrs, onUpdate, onSort } = await createImage(detail, activeView.value, templateDpi);
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
    setDesignImage,
  };
}

// 容器
function useContainerEL() {
  // canvas容器(konva舞台)
  const canvasElRef = ref(null);
  // img(产品图)
  const imgElRef = ref(null);

  // 组装属性
  const canvasRect = reactive(useElementBounding(canvasElRef));
  const imgRect = reactive(useElementBounding(imgElRef));

  // 钩子
  const event = createEventHook();

  // 容器rect
  const containerRect = ref({});
  watchEffect(
    () => {
      // 舞台的宽高
      const stageWidth = canvasRect.width;
      const stageHeight = canvasRect.height;

      // 产品绘制区域的宽高
      const drawWidth = imgRect.width;
      const drawHeight = imgRect.height;

      // 产品绘制区域相当于舞台的偏移量
      const offsetX = imgRect.left - canvasRect.left;
      const offsetY = imgRect.top - canvasRect.top;

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

      containerRect.value = result;
    },
    { flush: 'post' },
  );

  return {
    canvasElRef,
    imgElRef,
    containerRect,
    onUpdate: event.on,
  };
}
