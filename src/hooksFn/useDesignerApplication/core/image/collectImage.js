import { ref } from 'vue';
import { createGlobalState } from '@vueuse/core';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { apis } from '@/hooksFn/useDesignerApp/core/api';
import { METHOD } from '@/utils/request';

export const useGlobalCollectImage = createGlobalState(() => {
  const list = ref([]);
  const total = ref(0);
  const params = ref({});
  const loading = ref(false);
  const about = AppUtil.generateAbout();

  async function getList() {
    // const _params = {
    //   ...params.value,
    //   offset: (params.value.pageNum - 1) * params.value.pageSize || 0,
    //   limit: params.value.pageSize,
    // };
    const config = {
      url: apis.image_list_by_collect(),
      method: METHOD.GET,
      // params: _params,
    };
    const { list: l } = await AppUtil.fetch(config, { about, loading });
    list.value = l;
  }

  // 是否收藏
  function isCollect(data) {
    return list.value.some((item) => item.seqId === AppUtil.getImageId(data));
  }
  // 收藏
  async function collect(data) {
    const config = {
      url: apis.image_collect(),
      method: METHOD.GET,
      params: { imgId: AppUtil.getImageId(data) },
    };
    await AppUtil.fetch(config, { about, loading });
  }
  // 取消收藏
  async function collectCancel(data) {
    const collectData = list.value.find((v) => v.seqId === AppUtil.getImageId(data));
    const config = {
      url: apis.image_cancel_collect(collectData?.quickimgid),
      method: METHOD.POST,
      params: { seqId: AppUtil.getImageId(data) },
    };
    await AppUtil.fetch(config, { about, loading });
  }
  // 收藏/取消收藏
  async function toggleCollect(data) {
    if (isCollect(data)) {
      await AppUtil.confirmCollect();
      await collectCancel(data);
    } else {
      await collect(data);
    }
  }

  return {
    list,
    total,
    params,
    loading,
    about,
    getList,
    isCollect,
    collect,
    collectCancel,
    toggleCollect,
  };
});
