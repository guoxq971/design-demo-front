<template>
  <div class="fn-pagination-container">
    <div style="display: flex; align-items: center;">
      <template v-if="multiple">
        <div style="display: flex; align-items: center;padding-top: 0.2rem">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="onCheckAllChange">全选</el-checkbox>
        </div>
        <div style="margin: 0 1.8rem 0 0.8rem">|</div>
        <div v-if="multiple && multipleNum > 0" style="margin-right: 0.8rem">已选 {{ multipleNum }} 条,</div>
      </template>

      <div>共 {{ total }} {{ unit }}</div>
      <div>，本页 {{ listNum === null ? pageSize : listNum }} 条</div>
      <slot name="customSlot"></slot>
    </div>
    <div :class="{ pagination: isSurePadding }">
      <el-pagination
        background
        :pager-count="7"
        :layout="layout"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :current-page="pageNum"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, watch } from 'vue';
const emit = defineEmits(['update:pageSize', 'update:pageNum', 'checkAllChange']);
const props = defineProps({
  layout: { type: String, default: 'sizes, prev, pager, next, jumper' },
  //列表查询
  getList: { type: Function, default: () => {} },
  // 是否需要padding
  isSurePadding: { type: Boolean, default: true },
  /*单位*/
  unit: { type: String, default: '条' },
  // 当前页的数量 【兼容之前代码，不等于null就是列表的总条数】
  listNum: { type: Number, default: null },
  // 总条数
  total: { type: Number, default: 0 },
  // 当前页
  pageNum: { type: Number, default: 1 },
  // 每页显示条数
  pageSize: { type: Number, default: 10 },
  // 每页显示个数选择器的选项设置
  pageSizes: { type: Array, default: () => [10, 20, 30, 50] },
  // 是否多选
  multiple: { type: Boolean, default: false },
  // 已选数量
  multipleNum: { type: Number, default: 0 },
});

const onSizeChange = (val) => {
  emit('update:pageSize', val);
  props.getList();
};
const onCurrentChange = (val) => {
  emit('update:pageNum', val);
  props.getList();
};

const checkAll = ref(false);
const isIndeterminate = computed(() => {
  return props.multipleNum > 0 && props.multipleNum < props.listNum;
});

watch(
  () => props.multipleNum,
  (val) => {
    if (val > 0) {
      checkAll.value = val === props.listNum;
    } else {
      checkAll.value = false;
    }
  },
);

// 全选
const onCheckAllChange = (val) => {
  emit('checkAllChange', val);
};
</script>

<style scoped lang="less">
.fn-pagination-container {
  display: flex;
  justify-content: space-between;
  height: 6rem;
  align-items: center;
}
</style>
