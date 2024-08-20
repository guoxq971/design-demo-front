import { ref, computed } from 'vue';

export function useData() {
  // data
  const templateList = ref([]); //模板列表
  const activeTemplateId = ref(''); //模板id
  const activeViewId = ref(''); //视图id
  const activeSizeId = ref(''); //尺寸id
  const activeColorId = ref(''); //颜色id
  const activeDesignId = ref(''); //设计id

  // computed
  const activeTemplate = computed(() => templateList.value?.find((item) => item.detail.id === activeTemplateId.value));
  const activeView = computed(() => activeTemplate.value?.viewList?.find((item) => item.id === activeViewId.value));
  const activeSize = computed(() => activeView.value?.sizeList?.find((item) => item.id === activeSizeId.value));
  const activeColor = computed(() => activeTemplate.value?.colorList?.find((item) => item.id === activeColorId.value));
  const activeColorViewList = computed(() => {
    return activeColor.value?.views.map((colorView) => {
      return {
        id: colorView.id,
        view: activeTemplate.value?.viewList?.find((e) => e.id === colorView.id),
        colorView,
        image: colorView.image,
        texture: colorView.texture,
      };
    });
  });
  const activeViewDesignList = computed(() => activeView.value?.designList || []);
  // 翻转 activeViewDesignList
  const activeViewDesignListReverse = computed(() => activeViewDesignList.value.slice().reverse());

  return {
    // data
    templateList,
    activeTemplateId,
    activeViewId,
    activeSizeId,
    activeColorId,
    activeDesignId,
    // computed
    activeTemplate,
    activeView,
    activeSize,
    activeColor,
    activeColorViewList,
    activeViewDesignList,
    activeViewDesignListReverse,
  };
}
