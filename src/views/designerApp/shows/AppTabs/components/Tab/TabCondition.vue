<template>
  <div class="condition" :style="{ ...rowStyle }">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  row: { type: Boolean, default: false },
});
const rowStyle = props.row ? { flexDirection: 'row' } : {};
</script>

<style scoped lang="less">
// 条件
.condition {
  margin-bottom: var(--fn-gap-min);
  display: flex;
  flex-direction: column;
}
</style>
