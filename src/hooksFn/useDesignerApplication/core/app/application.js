import { createGlobalState } from '@vueuse/core';
import { ref } from 'vue';

export const useGlobalApplication = createGlobalState(() => {
  const templateData = useTemplateData();

  // 设置模板
  function setTemplate(detail) {}
  // 设置设计图
  function setDesignImage(detail) {}

  return {
    setTemplate,
    setDesignImage,
    templateData,
  };
});

function useTemplateData() {
  const activeTemplateId = ref('');
  return {
    activeTemplateId,
  };
}
