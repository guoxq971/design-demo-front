import { ref } from 'vue';
import { createGlobalState } from '@vueuse/core';
// utils
import { apis } from '@/hooksFn/useDesignerApp/core/api';
import { METHOD } from '@/utils/request';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';

export const useGlobalCollectTemplate = createGlobalState(() => {
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
      collectFlag: 1,
    };
    const config = {
      url: apis.template_list_by_collect(),
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

  // 是否收藏
  function isCollect(data) {
    return list.value.some((item) => item.seqId === data.seqId);
  }
  // 收藏
  async function collect(data) {
    const config = {
      url: apis.template_collect(),
      method: METHOD.POST,
      params: { templateId: data.seqId },
    };
    await AppUtil.fetch(config, { about, loading });
  }
  // 取消收藏
  async function collectCancel(data) {
    const config = {
      url: apis.template_cancel_collect(data.collectId),
      method: METHOD.POST,
      params: {},
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
});
