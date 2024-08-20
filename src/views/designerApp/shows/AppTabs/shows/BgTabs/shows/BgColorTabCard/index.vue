<template>
  <div class="tab">
    <!--色板-->
    <ColorPicker v-model="test" />
    <!--色块 + input + 取色器-->
    <div>色块 + input + 取色器</div>
    <!--预设-->
    <div>预设</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// utils
import ColorPicker from './shows/ColorPicker';

const test = ref('');
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
