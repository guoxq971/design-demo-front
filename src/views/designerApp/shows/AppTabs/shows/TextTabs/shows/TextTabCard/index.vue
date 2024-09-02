<template>
  <div class="tab">
    <!--色板-->
    <ColorPicker v-model="param.fill" />
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
import { getParam } from '@/hooksFn/useDesignerApplication/core/app/utils/createText';
import { Message } from 'element-ui';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { getTextOptions } from '@/hooksFn/useGlobalDesigner/core/application/design/addText';
import { cloneDeep } from 'lodash';

const param = ref(getTextOptions());
function onSure() {
  if (!param.value.uuid && !param.value.text) {
    Message.warning('内容不能为空');
    return;
  }
  useDesignerApplication().addText(param.value);
}
// 监听文字参数变化
watch(
  () => param.value,
  useDebounceFn((val) => {
    // console.log('监听文字参数变化 param.value', param.value);
    param.value.uuid && useDesignerApplication().addText(cloneDeep(param.value));
  }, 300),
  { deep: true },
);
// 监听当前设计信息
watch(
  () => useDesignerApplication().activeDesignId.value,
  useDebounceFn((val) => {
    // console.log('监听当前设计信息 val', val);
    if (!useDesignerApplication().activeDesign.value || !useDesignerApplication().activeDesign.value?.isText) {
      param.value.uuid = '';
    } else {
      param.value = getTextOptions(useDesignerApplication().activeDesign.value.node.attrs);
    }
  }, 100),
  // { deep: true },
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
