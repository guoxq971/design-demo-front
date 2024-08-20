import { ref } from 'vue';
import { apis } from '@/hooksFn/useDesignerApp/core/api';
import { METHOD } from '@/utils/request';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';

export function useCommonTemplateService() {
  const list = ref([]);
  const total = ref(0);
  const params = ref({
    tempalteNoOrName: '', //通用模板|收藏模板
    category1: '',
    category2: '',
    pageNum: 1,
    pageSize: 3 * 6,
  });
  const loading = ref(false);
  const about = AppUtil.generateAbout();

  async function getList() {
    const _params = {
      ...params.value,
      pageNo: params.value.pageNum,
      limit: params.value.pageSize,
    };
    const config = {
      url: apis.template_list_by_common(),
      method: METHOD.GET,
      params: _params,
    };
    const { productTypes, count } = await AppUtil.fetch(config, { about, loading });
    list.value = productTypes;
    total.value = count;
  }
  function onSearch() {
    params.value.pageNum = 1;
    getList();
  }

  return {
    list,
    total,
    params,
    loading,
    about,
    getList,
    onSearch,
  };
}
