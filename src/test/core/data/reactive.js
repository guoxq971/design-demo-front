import { computed, ref } from 'vue';

// 响应式数据
export function useReactiveData() {
  // 激活项
  const activeTemplateId = ref('');
  const activeSizeId = ref('');
  const activeColorId = ref('');
  const activeViewId = ref('');
  const activeDesignId = ref('');
  // 计算属性
  const activeTemplate = computed(() => {});
  const activeTemplateType = computed(() => {});
  const activeSize = computed(() => {});
  const activeColor = computed(() => {});
  const activeView = computed(() => {});
  const activeDesign = computed(() => {});
  // 多角度列表
  const multiList = computed(() => {});
  // 导出列表
  const exportList = computed(() => {});

  // 模板列表
  const templateList = ref([]);

  return {
    activeTemplateId,
    activeSizeId,
    activeColorId,
    activeViewId,
    activeDesignId,
    activeTemplate,
    activeTemplateType,
    activeSize,
    activeColor,
    activeView,
    activeDesign,
    multiList,
    exportList,
    templateList,
  };
}
