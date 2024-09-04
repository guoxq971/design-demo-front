import { computed, onMounted, ref } from 'vue';
import { useDraggable } from '@vueuse/core';
import { GRequest, METHOD } from '@/utils/request';
import { MessageBox, Message } from 'element-ui';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useTemplateFnData } from '@/hooksFn/useGlobalDesigner/core/application/template/getSubmitData';

export function useTemplateHistory() {
  const el = ref(null);
  const { x, y, style } = useDraggable(el, {
    initialValue: { x: 1173, y: 117 },
  });

  const visible = ref(false);
  function onClose() {
    visible.value = false;
  }
  function onOpen() {
    visible.value = true;
  }
  function trigger() {
    if (visible.value) {
      onClose();
    } else {
      onOpen();
    }
  }

  const loading = ref(false);
  const list = ref([]);
  const params = ref({
    pageNum: 1,
    pageSize: 6,
  });
  const showList = computed(() => {
    return list.value.slice((params.value.pageNum - 1) * params.value.pageSize, params.value.pageNum * params.value.pageSize);
  });
  const total = computed(() => list.value.length);
  onMounted(() => getList());
  function getList() {
    loading.value = true;
    GRequest(`/base-web/CMProductAct/productsHis.act`, METHOD.GET, {})
      .then((res2) => {
        if (res2.data.retState !== '0') {
          return;
        }
        for (let item of res2.data.products) {
          item.loading = false;
          item.visible = false;
        }
        list.value = res2.data.products;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  // 删除单条记录
  async function onDel(data) {
    try {
      data.visible = false;
      data.loading = true;
      await GRequest('/base-web/CMProductAmazonAct/updateUserflagBatchBySeqIds.act', METHOD.POST, { seqIds: data.id });
      getList();
    } finally {
      data.loading = false;
    }
  }

  const { getParam, getTemplateDetail } = useHistorySet();
  // 使用模板
  async function onSel(item) {
    await MessageBox.confirm('是否确认使用该设计？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });

    /**@type {import('d').templateSubmit} 获取保存时候的参数*/
    const submitData = await getParam(item.id);
    // console.log('获取保存时候的参数 data', submitData);
    // 获取模板详情
    const detail = await getTemplateDetail(submitData.productType.id);
    if (!detail) {
      Message.warning('获取模板详情失败');
      console.error('获取模板详情失败');
      return;
    }
    // console.log('获取模板详情 detail', detail);
    await useDesignerApplication().setTemplate(detail);
    let template = useDesignerApplication().activeTemplate.value;
    // 如果是精细设计使用精细设计
    if (submitData.productType.size) {
      template = useDesignerApplication().templateList.value.find((t) => t.size === submitData.productType.size);
      if (template) {
        await useDesignerApplication().useTemplate(template);
      }
    }
    // 恢复设计
    useTemplateFnData(submitData.fnData, template);
  }

  return {
    visible,
    el,
    x,
    y,
    style,
    loading,
    list,
    params,
    showList,
    total,
    getList,
    onSel,
    onClose,
    onOpen,
    trigger,
    onDel,
  };
}

/**
 * 历史记录的选中
 */
function useHistorySet() {
  /**
   * 获取保存时候的参数
   * @param id
   * @returns {Promise<import('d').templateSubmit>}
   */
  async function getParam(id) {
    // 获取保存时候的参数
    const res = await GRequest(`/base-web/CMProductAct/getDataById4Design.act`, METHOD.GET, { seqId: id });
    // console.log('回显设计 res', res);
    if (!res.status) {
      throw new Error('获取保存时候的参数失败');
    }

    return res.data;
  }

  /**
   * 获取模板详情
   * @param {string} templateNo 模板号
   * @returns {Promise<import('d').templateDetail>}
   */
  async function getTemplateDetail(templateNo) {
    const res = await GRequest(`/base-web/CMProductTemplateAct/selectTemplateList4Design.act`, METHOD.GET, { tempalteNoOrName: templateNo });
    if (res.data.retState !== '0') {
      throw new Error('获取模板详情失败');
    }
    if (res.data.productTypes.length === 0) {
      throw new Error('模板不存在');
    }
    return res.data.productTypes[0];
  }

  return {
    getParam,
    getTemplateDetail,
  };
}
