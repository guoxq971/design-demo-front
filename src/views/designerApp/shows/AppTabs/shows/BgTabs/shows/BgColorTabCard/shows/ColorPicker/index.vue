<template>
  <div class="color-picker">
    <SketchPicker v-model="value" />
  </div>
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
import { Sketch as SketchPicker } from 'vue-color';
import { defineProps, defineEmits } from 'vue';
import { useVModels } from '@vueuse/core';
const emit = defineEmits([]);
const props = defineProps({
  value: { type: String, default: '' },
});
const { value } = useVModels(props);
</script>

<style scoped lang="less">
// 取色板样式
.vc-sketch {
  padding: 0;
  width: 100%;
  box-shadow: none;
  // 取色圆圈
  :deep(.vc-saturation-circle) {
    width: 14px;
    height: 14px;
    border: 1px solid #fff;
  }
  // 预设板块
  :deep(.vc-sketch-presets) {
    display: none;
  }
  // 数值
  :deep(.vc-sketch-field) {
    display: none;
  }
  // 色块
  :deep(.vc-sketch-color-wrap) {
    display: none;
  }
  // 透明度
  :deep(.vc-sketch-alpha-wrap) {
    display: none;
  }
  // 滑块取色
  :deep(.vc-sketch-hue-wrap) {
    margin-top: var(--fn-gap-min);
    height: 1.8rem;
    .vc-hue-picker {
      width: 0.8rem;
      height: 1.5rem;
    }
  }
}
</style>
