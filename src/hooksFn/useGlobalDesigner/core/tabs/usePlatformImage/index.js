import { ref } from 'vue';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { METHOD } from '@/utils/request';
import { fnFetch, generateAbout } from '@/hooksFn/useGlobalDesigner/utils';
import { generateParams } from '@/hooksFn/useGlobalDesigner/core/tabs/useBgImage/generateParams';

export function usePlatformImage() {
  const list = ref([]);
  const total = ref(0);
  const params = ref(generateParams());
  const loading = ref(false);
  const about = generateAbout();

  async function getList() {
    const _params = {
      ...params.value,
      offset: (params.value.pageNum - 1) * params.value.pageSize || 0,
      limit: params.value.pageSize,
    };
    const config = {
      url: `/base-web/CMDesignImageAct/getPlatformDesignImageList.act${AppUtil.encodeUrl(_params)}`,
      method: METHOD.GET,
      // params: _params,
    };
    const { designs, count } = await fnFetch(config, { about, loading });
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
