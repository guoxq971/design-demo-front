<template>
  <div class="custom-container">
    <CustomList v-show="!detail" @onClick="onClick" />
    <DetailList v-if="detail" :detail.sync="detail" />
  </div>
</template>

<script setup>
import CustomList from './customList.vue';
import DetailList from './detailList.vue';
import { ref } from 'vue';

// 详情
const detail = ref(null);
function onClick(item) {
  detail.value = item;
}
</script>

<style scoped lang="less">
.custom-container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
