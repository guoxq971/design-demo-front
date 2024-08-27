import { ref } from 'vue';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { METHOD } from '@/utils/request';
import { fnFetch, generateAbout } from '@/hooksFn/useGlobalDesigner/utils';
import { generateParams } from '@/hooksFn/useGlobalDesigner/core/tabs/useBgImage/generateParams';

export function useCollectBgImage() {
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
      url: `/base-web/CMDesignImageQuickAct/queryQuickImageList.act`,
      method: METHOD.GET,
      // params: _params,
    };
    const { list: l, count } = await fnFetch(config, { about, loading });
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
      url: `/base-web/CMDesignImageQuickAct/saveQuickDesignImage.act`,
      method: METHOD.GET,
      params: { imgId: AppUtil.getImageId(data) },
    };
    await fnFetch(config, { about, loading });
  }
  // 取消收藏
  async function collectCancel(data) {
    const seqId = AppUtil.getImageId(data);
    const result = list.value.find((e) => e.seqId === seqId);
    const config = {
      url: `/base-web/CMDesignImageQuickAct/deleteImage.act?seqId=${result?.quickimgid}`,
      method: METHOD.POST,
      params: { seqId: seqId },
    };
    await fnFetch(config, { about, loading });
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
