<template>
  <div class="tab">
    <!--色板-->
    <ColorPicker v-model="param.color" />
    <!--文字-->
    <el-input v-model="param.text" />
    <el-button @click="onSure">确认</el-button>
    <!--预设-->
    <div>预设</div>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useDebounceFn, watchDebounced } from '@vueuse/core';
// utils
import ColorPicker from './shows/ColorPicker';
import { useGlobalApplication } from '@/hooksFn/useDesignerApplication/core/app/application';
import { getParam } from '@/hooksFn/useDesignerApplication/core/app/utils/createText';
import { Message } from 'element-ui';

const { setDesignText, templateData } = useGlobalApplication();
const param = ref(getParam());
function onSure() {
  if (!param.value.uuid && !param.value.text) {
    Message.warning('内容不能为空');
    return;
  }
  setDesignText(param.value);
}
// 监听文字参数变化
watch(
  () => param.value,
  useDebounceFn((val) => {
    param.value.uuid && setDesignText(param.value);
  }, 300),
  { deep: true },
);
// 监听当前设计信息
watch(
  () => templateData.activeDesign.value,
  useDebounceFn((val) => {
    if (!val) {
      param.value.uuid = '';
    } else {
      param.value = getParam(val);
    }
  }, 300),
  { deep: true },
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
