import { computed, onMounted, ref } from 'vue';
import { useDraggable } from '@vueuse/core';
import { GRequest, METHOD } from '@/utils/request';

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
    onClose,
    onOpen,
    trigger,
    onDel,
  };
}
