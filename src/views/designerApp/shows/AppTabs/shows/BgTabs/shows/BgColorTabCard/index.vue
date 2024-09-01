<template>
  <div class="tab">
    <!--色板-->
    <ColorPicker v-model="color" />
    <!--色块 + input + 取色器-->
    <div>色块 + input + 取色器</div>
    <!--预设-->
    <div>预设</div>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useDebounceFn } from '@vueuse/core';
// utils
import ColorPicker from './shows/ColorPicker';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

const color = ref('');
const fn = useDebounceFn(() => useDesignerApplication().addColor(color.value), 300);
watch(
  () => color.value,
  () => fn(),
);
</script>

<style scoped lang="less">
.tab {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--fn-gap) var(--fn-gap-min) var(--fn-gap-min) var(--fn-gap-min);
}
</style>
