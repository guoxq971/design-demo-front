import { computed, ref } from 'vue';

export function useHover() {
  const types = {
    template: 'template',
    customTemplate: 'customTemplate',
    image: 'image',
  };
  const type = ref('');
  const isHoverTemplate = computed(() => type.value === types.template);
  const isHoverImage = computed(() => type.value === types.image);
  const isHoverCustomTemplate = computed(() => type.value === types.customTemplate);

  const detail = ref(null);
  let time = null;

  // 进入,离开
  const onMouseenter = (item) => {
    clearTimeout(time);
    if (item) detail.value = item;
  };
  const onMouseleave = () => {
    time = setTimeout(() => {
      detail.value = null;
      type.value = '';
    }, 300);
  };

  // 图库
  function onMouseenterImage(event, data) {
    type.value = types.image;
    onMouseenter(data);
  }
  // 模板
  function onMouseenterTemplate(event, data) {
    type.value = types.template;
    onMouseenter(data);
  }
  // 定制模板
  function onMouseenterCustomTemplate(event, data) {
    type.value = types.customTemplate;
    onMouseenter(data);
  }
  function onMouseleaveTemplate() {
    onMouseleave();
  }

  return {
    onMouseenter,
    onMouseleave,
    onMouseenterTemplate,
    onMouseenterImage,
    onMouseenterCustomTemplate,
    onMouseleaveTemplate,
    isHoverTemplate,
    isHoverCustomTemplate,
    isHoverImage,
    detail,
    types,
  };
}
