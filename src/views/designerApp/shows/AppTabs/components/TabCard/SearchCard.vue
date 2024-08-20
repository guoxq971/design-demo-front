<template>
  <el-input v-model="value" :placeholder="placeholder" @keyup.enter.native="getList">
    <template #append>
      <el-button icon="el-icon-search" @click="getList" :loading="loading" />
    </template>
  </el-input>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update:value',
  },
};
</script>
<script setup>
import { defineProps } from 'vue';
import { useVModels } from '@vueuse/core';
const props = defineProps({
  value: [String],
  placeholder: [String],
  getList: [Function],
  loading: [Boolean],
});
const { value } = useVModels(props);
</script>

<style scoped lang="less">
:deep(.el-input__inner) {
  height: 4rem;
}
:deep(.el-input-group__append) {
  background-color: transparent;
  font-size: 1.8rem;
}
</style>
