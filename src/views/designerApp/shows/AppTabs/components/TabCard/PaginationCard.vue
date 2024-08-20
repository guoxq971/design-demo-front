<template>
  <el-pagination
    @size-change="onSizeChange"
    @current-change="onCurrentChange"
    :current-page.sync="pageNum"
    :page-size.sync="pageSize"
    background
    :pagerCount="5"
    layout="prev, pager, next, slot"
    :total="total"
  >
    <div class="jump-wrap">
      <el-input v-model.number="jumpValueComputed" class="go-ipt">
        <el-button slot="append" class="go-btn" @click="onGo">GO</el-button>
      </el-input>
    </div>
  </el-pagination>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { useVModels } from '@vueuse/core';
const emit = defineEmits([]);
const props = defineProps({
  pageNum: { type: Number, default: 1 },
  pageSize: { type: Number, default: 3 * 6 },
  total: { type: Number, default: 0 },
  getList: [Function],
});
const { pageNum, pageSize } = useVModels(props);

const jumpValue = ref(1);
const max = computed(() => Math.ceil(props.total / props.pageSize));
const min = 1;
const jumpValueComputed = computed({
  get: () => jumpValue.value,
  set: (value) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max.value) {
      jumpValue.value = numValue;
    } else {
      jumpValue.value = Math.max(min, Math.min(max.value, numValue));
    }
  },
});
function onGo() {
  pageNum.value = jumpValue.value;
  props.getList();
}
const onSizeChange = (val) => {
  pageSize.value = val;
  props.getList();
};
const onCurrentChange = (val) => {
  pageNum.value = val;
  props.getList();
};
</script>

<style scoped lang="less">
.el-pagination {
  padding: 0;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  :deep(.btn-prev),
  :deep(.btn-next) {
    margin: 0;
    background: transparent;
  }
  :deep(.number),
  :deep(.more) {
    margin: 0 !important;
    background: transparent !important;
  }
  :deep(.active) {
    background: transparent !important;
    color: var(--fn-primary-color) !important;
    border: 1px solid var(--fn-primary-color) !important;
  }
  .jump-wrap {
    color: #000c01;
    font-size: 1.2rem;
    line-height: 1.6rem;
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;

    .go-ipt {
      width: 9rem;
      margin-left: 0.3rem;
      :deep(.el-input__inner) {
        padding: 0;
        height: 3.2rem;
      }
      :deep(.el-input-group__append) {
        background: transparent;
      }
    }
    .go-btn {
      width: 4.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #303133;
    }
  }
}
</style>
