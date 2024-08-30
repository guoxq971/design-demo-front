import { createGlobalState } from '@vueuse/core';
import { computed, ref, Ref, toRefs } from 'vue';

// 设计器
export const useDesignerApplication = createGlobalState(() => {
  const templateList = ref([]);
  const activeTemplateId = ref('');
  const activeViewId = ref('');
  const activeSizeId = ref('');
  const activeColorId = ref('');
  const activeDesignId = ref('');
  const mode = ref('');

  const activeTemplate = computed(() => {});
  const activeView = computed(() => {});
  const activeSize = computed(() => {});
  const activeColor = computed(() => {});

  return {};
});

// 配置
export const useDesignerAppConfig = createGlobalState(() => {
  return {};
});
