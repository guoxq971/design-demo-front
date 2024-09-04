import { ref } from 'vue';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { METHOD } from '@/utils/request';
import { fnFetch, generateAbout } from '@/hooksFn/useGlobalDesigner/utils';

export function useCollectImage() {
  const list = ref([]);
  const total = ref(0);
  const params = ref({});
  const loading = ref(false);
  const about = generateAbout();

  async function getList() {
    const config = {
      url: `/base-web/CMDesignImageQuickAct/queryQuickImageListSJ.act`,
      method: METHOD.GET,
      // params: _params,
    };
    const { list: l } = await fnFetch(config, { about, loading });
    list.value = l;
  }

  // 是否收藏
  function isCollect(data) {
    return list.value.some((item) => item.seqId === AppUtil.getImageId(data));
  }
  // 收藏
  async function collect(data) {
    const config = {
      url: `/base-web/CMDesignImageQuickAct/saveQuickDesignImageSJ.act`,
      method: METHOD.GET,
      params: { imgId: AppUtil.getImageId(data) },
    };
    await fnFetch(config, { about, loading });
  }
  // 取消收藏
  async function collectCancel(data) {
    const collectData = list.value.find((v) => v.seqId === AppUtil.getImageId(data));
    const config = {
      url: `/base-web/CMDesignImageQuickAct/deleteImage.act?seqId=${collectData?.quickimgid}`,
      method: METHOD.POST,
      params: { seqId: AppUtil.getImageId(data) },
    };
    await fnFetch(config, { about, loading });
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
}
