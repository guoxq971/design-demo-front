import { ref } from 'vue';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { apis } from '@/hooksFn/useDesignerApp/core/api';
import { METHOD } from '@/utils/request';
import { generateParams } from '@/hooksFn/useDesignerApp/core/service/image/myImageService';

export function useCollectBgImageService() {
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
      url: apis.bg_image_list_by_collect(_params),
      method: METHOD.GET,
      // params: _params,
    };
    const { list: l, count } = await AppUtil.fetch(config, { about, loading });
    list.value = l;
    total.value = l.length;
  }
  function onSearch() {
    params.value.pageNum = 1;
    getList();
  }

  // 是否收藏
  function isCollect(data) {
    return list.value.some((item) => item.seqId === AppUtil.getImageId(data));
  }
  // 收藏
  async function collect(data) {
    const config = {
      url: apis.bg_image_collect(),
      method: METHOD.GET,
      params: { imgId: AppUtil.getImageId(data) },
    };
    await AppUtil.fetch(config, { about, loading });
  }
  // 取消收藏
  async function collectCancel(data) {
    const config = {
      url: apis.bg_image_cancel_collect(data?.quickimgid),
      method: METHOD.POST,
      params: { seqId: AppUtil.getImageId(data) },
    };
    await AppUtil.fetch(config, { about, loading });
  }

  return {
    list,
    total,
    params,
    loading,
    about,
    getList,
    onSearch,
    isCollect,
    collect,
    collectCancel,
  };
}
