import { ref } from 'vue';
import { apis } from '@/hooksFn/useDesignerApp/core/api';
import { METHOD } from '@/utils/request';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';

export function useCustomTemplateService() {
  const list = ref([]);
  const total = ref(0);
  const params = ref({
    queryInput: '', // 定制模板
    pageNum: 1,
    pageSize: 3 * 6,
  });
  const loading = ref(false);
  const about = AppUtil.generateAbout();

  async function getList() {
    const config = {
      url: apis.template_list_by_custom(params.value.pageNum, params.value.pageSize),
      method: METHOD.POST,
      params: params.value,
    };
    // const { records, total: t } = await AppUtil.fetch(config, { about, loading });
    const result = await AppUtil.fetch(config, { about, loading });
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

function useCustomDetailTemplateService() {
  const list = ref([]);
  const total = ref(0);
  const params = ref({
    templateId: '',
    pageNum: 1,
    pageSize: 3 * 6,
  });
  const loading = ref(false);
  const about = AppUtil.generateAbout();
  function reset() {
    list.value = [];
    total.value = 0;
    params.value.pageNum = 1;
  }

  async function getList() {
    const config = {
      url: apis.template_list_by_custom_detail(params.value.pageNum, params.value.pageSize),
      method: METHOD.POST,
      params: params.value,
    };
    const { records, total: t } = await AppUtil.fetch(config, { about, loading });
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
