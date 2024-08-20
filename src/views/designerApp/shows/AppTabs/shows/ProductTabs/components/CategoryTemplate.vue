<template>
  <el-cascader
    expandTrigger="hover"
    popper-class="pc-sel-area-cascader"
    filterable
    placeholder="分类"
    v-model="category.selected"
    :options="list"
    :props="{ checkStrictly: true }"
    @change="getListByCategory"
    clearable
  />
</template>

<script setup>
import { computed, defineProps, reactive, ref } from 'vue';
import { useVModels } from '@vueuse/core';
import { useInjectApp } from '@/hooksFn/useDesignerApp';
const props = defineProps({
  params: Object,
  onSearch: Function,
});
const { params } = useVModels(props);
const { service } = useInjectApp();
const list = computed(() => service.template.category.list);

// 分类
const category = ref({
  selected: [],
  // options: [],
});
const getListByCategory = () => {
  let category1 = '';
  let category2 = '';
  if (category.value.selected[0]) category1 = category.value.selected[0];
  if (category.value.selected[1]) category2 = category.value.selected[1];
  params.value.category1 = category1;
  params.value.category2 = category2;
  props?.onSearch();
};
</script>

<style lang="less">
// 分类-级联高度
.pc-sel-area-cascader {
  .el-cascader-menu__wrap {
    height: 350px !important;
  }
}
</style>
<style scoped lang="less">
:deep(.el-input__inner) {
  height: 3.6rem;
}
</style>
