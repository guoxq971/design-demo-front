import { createGlobalState } from '@vueuse/core';
import { computed, ComputedRef, ref, Ref, watchEffect } from 'vue';
import { setTemplate, useTemplate } from './template/setTemplate';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { saveTemplate } from '@/hooksFn/useGlobalDesigner/core/application/template/saveTemplate';

// 设计器
export const useDesignerApplication = createGlobalState(() => {
  /**@type {import('d').templateListRef} 模版列表*/
  const templateList = ref([]);
  /**@type {Ref<string>} 激活模板id*/
  const activeTemplateId = ref('');
  /**@type {Ref<string>} 激活视图id*/
  const activeViewId = ref('');
  /**@type {Ref<string>} 激活尺码id*/
  const activeSizeId = ref('');
  /**@type {Ref<string>} 激活颜色id*/
  const activeColorId = ref('');
  /**@type {Ref<string>} 激活设计id*/
  const activeDesignId = ref('');
  /**@type {Ref<import('d').mode_type>} 模式*/
  const mode = ref(useDesignerAppConfig().mode_type_preview);

  /**@type {Ref<boolean>} 模板加载中*/
  const loading = ref(false);
  /**@type {Ref<boolean>} 3d加载中*/
  const threeLoading = ref(false);
  /**@type {Ref<boolean>} 多角度加载中*/
  const renderLoading = ref(false);
  /**@type {Ref<boolean>} 模板保存中*/
  const saveLoading = ref(false);
  /**@type {Ref<boolean>} 获取模板导出配置加载中*/
  const exportLoading = ref(false);
  /**@type {Ref<boolean>} 导出弹窗*/
  const exportDialogVisible = ref(false);

  /**@type {import('d').templateComputed} 当前激活的模板*/
  const activeTemplate = computed(() => templateList.value?.find((t) => t.uuid === activeTemplateId.value));
  /**@type {ComputedRef<import('d').view>} 当前激活的视图*/
  const activeView = computed(() => activeTemplate.value?.viewList.find((v) => v.id === activeViewId.value));
  /**@type {ComputedRef<import('d').size>} 当前激活的尺码*/
  const activeSize = computed(() => activeTemplate.value?.sizeList.find((s) => s.id === activeSizeId.value));
  /**@type {import('d').colorComputed} 当前激活的颜色*/
  const activeColor = computed(() => activeTemplate.value?.colorList.find((c) => c.id === activeColorId.value));

  /**@type {ComputedRef<function(string):import('d').colorView>} 获取指定视图的展示的图片*/
  const getActiveColorViewImage = computed(() => {
    return (viewId) => {
      return activeColor.value?.viewImageList.find((item) => item.id === viewId);
    };
  });
  /**@type {ComputedRef<import('d').design>} 当前激活的设计*/
  const activeDesign = computed(() => activeView.value?.designList.find((d) => d.attrs.uuid === activeDesignId.value));

  // 设置颜色id
  const setColorId = (id) => (activeColorId.value = id);
  // 设置视图id
  const setViewId = (id) => {
    activeViewId.value = id;
    activeView.value?.setMode(useDesignerAppConfig().mode_type_preview);
    activeTemplate.value?.viewList.forEach((v) => v.setNode(null));
  };
  /**
   * 设置尺码id
   * @param {import('d').size} item
   */
  const setSizeId = async (item) => {
    if (item.id === activeSizeId.value) return;
    // 如果当前是精细设计
    if (activeTemplate.value?.isRefine) {
      const t = templateList.value.find((t) => t.size === item.size);
      if (t) {
        await useTemplate(t);
      }
    }
    activeSizeId.value = item.id;
  };

  /**
   * 添加设计图
   * @typedef {import('d').view.addImage}
   * @param {import('d').designImageDetail} detail
   * @param {import('d').view} view
   */
  function addImage(detail, view) {
    if (!view) view = activeView.value;
    if (!view) {
      console.error('添加设计图失败, view is undefined');
      return;
    }
    view.addImage(detail);
  }
  /**
   * 添加设计颜色
   * @typedef {import('d').view.addColor}
   * @param {string} color
   * @param {import('d').view} view
   */
  function addColor(color, view) {
    if (!view) view = activeView.value;
    if (!view) {
      console.error('添加设计颜色失败, view is undefined');
      return;
    }
    view.addColor(color);
  }
  /**
   * 添加设计文字
   * @param textOptions
   * @param {import('d').view} view
   */
  function addText(textOptions, view) {
    if (!view) view = activeView.value;
    if (!view) {
      console.error('添加设计文字失败, view is undefined');
      return;
    }
    view.addText(textOptions);
  }

  return {
    // 保存模板
    saveTemplate,
    // 添加设计
    addImage,
    addColor,
    addText,
    activeDesign,
    // 设置模板
    setTemplate,
    useTemplate,
    setColorId,
    setViewId,
    setSizeId,
    // 基础数据
    templateList,
    activeTemplateId,
    activeViewId,
    activeSizeId,
    activeColorId,
    activeDesignId,
    mode,
    loading,
    threeLoading,
    exportDialogVisible,
    renderLoading,
    exportLoading,
    saveLoading,
    activeTemplate,
    activeView,
    activeSize,
    activeColor,
    // 获取指定视图
    getActiveColorViewImage,
  };
});
