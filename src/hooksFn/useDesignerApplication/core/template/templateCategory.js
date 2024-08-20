import { ref } from 'vue';
import { createGlobalState } from '@vueuse/core';
// utils
import { apis } from '@/hooksFn/useDesignerApp/core/api';
import { METHOD } from '@/utils/request';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';

export const useGlobalTemplateCategory = createGlobalState(() => {
  const list = ref([]);
  const loading = ref(false);
  const about = AppUtil.generateAbout();

  async function getList() {
    const config = {
      url: apis.template_category_list(),
      method: METHOD.GET,
      params: {},
    };
    const { productTypeDepartments } = await AppUtil.fetch(config, { about, loading });
    list.value = productTypeDepartments.map((item) => {
      let { name, id, categories } = item;
      let children = [];
      if (categories) {
        children = categories.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        });
      }
      return { label: name, value: id, children };
    });
  }

  return {
    list,
    loading,
    about,
    getList,
  };
});
