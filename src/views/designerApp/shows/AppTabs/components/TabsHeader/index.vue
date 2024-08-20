<template>
  <div class="tabs-header">
    <div class="tabs-header-item" :class="{ active: activeTab === item.value }" v-for="item in list" :key="item.value" @click="onTab(item)">{{ item.label }}</div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { useVModels } from '@vueuse/core';

const emit = defineEmits([]);
const props = defineProps({
  activeTab: [String, Number],
  list: Array,
});
const { activeTab } = useVModels(props);
const onTab = (item) => (activeTab.value = item.value);
</script>

<style scoped lang="less">
// 选项卡头部
.tabs-header {
  display: flex;
  height: 4rem;

  .tabs-header-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: var(--fn-primary-color-hover2);
    }
  }

  .active {
    font-weight: bold;
    background-color: var(--fn-primary-color-hover2);
    color: var(--fn-primary-color);
  }
}
</style>
