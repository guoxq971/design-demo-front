<template>
  <div class="pagination">
    <PaginationCard :page-num.sync="params.pageNum" :page-size.sync="params.pageSize" :total="total" :getList="getList" />
  </div>
</template>

<script setup>
import PaginationCard from '@/views/designerApp/shows/AppTabs/components/TabCard/PaginationCard.vue';
import { defineProps } from 'vue';
import { useVModels } from '@vueuse/core';
const props = defineProps({
  total: [Number, String],
  params: { type: Object, default: () => ({ pageNum: 1, pageSize: 3 * 6 }) },
  getList: Function,
});
const { params } = useVModels(props);
</script>

<style scoped lang="less">
// 分页
.pagination {
  height: 6rem;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  padding: 0 var(--fn-gap-min) 0 0;
}
</style>
