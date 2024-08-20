import { ref } from 'vue';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { apis } from '@/hooksFn/useDesignerApp/core/api';
import { METHOD } from '@/utils/request';
import { generateParams } from '@/hooksFn/useDesignerApp/core/service/image/myImageService';

export function useBgImageService() {
  const list = ref([]);
  const total = ref(0);
  const params = ref(generateParams());
  const loading = ref(false);
  const about = AppUtil.generateAbout();

  async function getList() {
    const _params = {
      ...params.value,
      offset: (params.value.pageNum - 1) * params.value.pageSize || 0,
      limit: params.value.pageSize,
    };
    const config = {
      url: apis.bg_image_list_by_common(_params),
      method: METHOD.GET,
      // params: _params,
    };
    const { designs, count } = await AppUtil.fetch(config, { about, loading });
    list.value = designs;
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
