import { computed, ref } from 'vue';

export const hovers = {
  template: 'template',
  custom: 'template_custom_detail',
  image: 'image',
};

export function useHoverService() {
  const detail = ref(null);
  let time = null;

  // 类型
  const type = ref(null);
  const isTemplate = computed(() => detail.value && type.value === hovers.template);
  const isCustom = computed(() => detail.value && type.value === hovers.custom);
  const isImage = computed(() => detail.value && type.value === hovers.image);

  // 进入,离开
  const enter = (item, hoverType) => {
    hoverType && (type.value = hoverType);
    clearTimeout(time);
    if (item) detail.value = item;
  };
  const leave = () => {
    time = setTimeout(() => {
      detail.value = null;
      type.value = null;
    }, 300);
  };

  return {
    type,
    isTemplate,
    isCustom,
    isImage,
    detail,
    enter,
    leave,
  };
}
