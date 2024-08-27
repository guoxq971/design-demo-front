import { ref } from 'vue';
// utils
import { METHOD } from '@/utils/request';
import { generateAbout, fnFetch } from '@/hooksFn/useGlobalDesigner/utils';

export function useTemplateCategory() {
  const list = ref([]);
  const loading = ref(false);
  const about = generateAbout();

  async function getList() {
    const config = {
      url: '/base-web/CMProductTemplateTypeAct/productTypeDepartments.act',
      method: METHOD.GET,
      params: {},
    };
    const { productTypeDepartments } = await fnFetch(config, { about, loading });
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
}
