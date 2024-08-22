import { computed } from 'vue';

// 模板组合数据
export function useTemplateGroup(templateData) {
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

  // 设计列表(激活的)
  const activeViewDesignList = computed(() => activeView.value?.designList || []);
  // 翻转 activeViewDesignList
  const activeViewDesignListReverse = computed(() => activeViewDesignList.value.slice().reverse());

  return {
    getViewImageByActiveColor,
    getBase64ByViewId,
    activeViewDesignList,
    activeViewDesignListReverse,
  };
}
