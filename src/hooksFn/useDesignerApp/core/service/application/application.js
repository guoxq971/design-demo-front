import { computed, ref } from 'vue';
import { createGlobalState } from '@vueuse/core';
// utils
import { TemplateUtil } from '@/hooksFn/useDesignerApp/core/service/app/util/templateUtil';

// 设计器全局状态
export const useGlobalAppState = createGlobalState(() => {
  // 模板基础数据
  const baseTemplateData = useBaseTemplateData();
  // 设置模板
  const { setTemplate } = useSetTemplate(baseTemplateData);
  // 设置模板
  const { setTemplateType } = useSetTemplateType(baseTemplateData);

  return {
    baseTemplateData,
    setTemplate,
    setTemplateType,
  };
});

// 模板
function useBaseTemplateData() {
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
    templateList,
    activeTemplateId,
    activeTemplate,
    setTemplateId,
    activeViewId,
    activeView,
    setViewId,
    activeSizeId,
    activeSize,
    setSizeId,
    activeColorId,
    activeColor,
    setColorId,
  };
}

// 设置模板
function useSetTemplate(baseTemplateData) {
  const { templateList, activeTemplateId, activeViewId, activeColorId, activeSizeId } = baseTemplateData;

  // 设置模板
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
    activeViewId.value = template.viewList[0].id;
    activeColorId.value = template.colorList[0].id;
    activeSizeId.value = template.sizeList[0].id;
  }

  return { setTemplate };
}

// 切换模板类型
function useSetTemplateType(baseTemplateData) {
  // 切换模板类型
  function setTemplateType() {}

  return { setTemplateType };
}
