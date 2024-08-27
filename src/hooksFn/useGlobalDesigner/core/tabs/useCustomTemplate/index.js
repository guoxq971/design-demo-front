import { ref } from 'vue';
// utils
import { METHOD } from '@/utils/request';
import { fnFetch, generateAbout } from '@/hooksFn/useGlobalDesigner/utils';

export function useCustomTemplate() {
  const list = ref([]);
  const total = ref(0);
  const params = ref({
    queryInput: '', // 定制模板
    pageNum: 1,
    pageSize: 3 * 6,
  });
  const loading = ref(false);
  const about = generateAbout();

  async function getList() {
    const config = {
      url: `/basic-web/template/cmProductTemplateCustom/customTemplateList/${params.value.pageNum}/${params.value.pageSize}`,
      method: METHOD.POST,
      params: params.value,
    };
    const result = await fnFetch(config, { about, loading });
    list.value = result?.records || [];
    total.value = result?.total || 0;
  }
  function onSearch() {
    params.value.pageNum = 1;
    getList();
  }

  // 定制模板详情
  const customDetail = useCustomDetailTemplateService();

  return {
    list,
    total,
    params,
    loading,
    about,
    getList,
    onSearch,
    customDetail,
  };
}

// 定制详情
function useCustomDetailTemplateService() {
  const list = ref([]);
  const total = ref(0);
  const params = ref({
    templateId: '',
    pageNum: 1,
    pageSize: 3 * 6,
  });
  const loading = ref(false);
  const about = generateAbout();
  function reset() {
    list.value = [];
    total.value = 0;
    params.value.pageNum = 1;
  }

  async function getList() {
    const config = {
      url: `/basic-web/template/cmProductTemplateCustom/customDetailList/${params.value.pageNum}/${params.value.pageSize}`,
      method: METHOD.POST,
      params: params.value,
    };
    const { records, total: t } = await fnFetch(config, { about, loading });
    list.value = records;
    total.value = t;
  }

  return {
    list,
    total,
    params,
    loading,
    about,
    getList,
    reset,
  };
}
