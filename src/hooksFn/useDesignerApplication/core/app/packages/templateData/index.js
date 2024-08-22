import { computed, ref } from 'vue';

// 模板基础数据
export function useTemplateData() {
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

  // 设计
  const activeDesignId = ref('');
  const activeDesign = computed(() => activeView.value?.designList.find((item) => item.uuid === activeDesignId.value));

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
    // 设计
    activeDesignId,
    activeDesign,
  };
}
