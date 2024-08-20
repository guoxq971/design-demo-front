<template>
  <el-popover placement="bottom" width="fit-content" trigger="hover" popper-class="image-type-popover">
    <div class="form-item">
      <div class="form-item-label">图片类型:</div>
      <el-radio-group v-model="imageType" size="small" @change="getList">
        <el-radio v-for="item in picTypeList" :key="item.value" :label="item.value" border>
          {{ item.label }}
        </el-radio>
      </el-radio-group>
    </div>
    <ElpButton slot="reference" icon="el-icon-picture-outline" class="icon-btn" :class="{ active: imageType }" />
  </el-popover>
</template>

<script setup>
import ElpButton from '@/views/designerApp/components/ElpButton.vue';
import { defineProps } from 'vue';
import { useVModels } from '@vueuse/core';
const props = defineProps({
  getList: Function,
  imageType: String,
  height: { type: String, default: '' },
});
const { imageType } = useVModels(props);
const heightStyle = props.height ? props.height : '3.2rem';

const picTypeList = [
  { label: '全部', value: '' },
  { label: '.png', value: '.png' },
  { label: '.jpg', value: '.jpg' },
];
</script>

<style lang="less">
.image-type-popover {
  .form-item {
    display: flex;
    align-items: center;
  }
  .form-item-label {
    margin-right: var(--fn-gap-min);
  }
  :deep(.el-radio) {
    margin-right: 0;
  }
}
</style>
<style scoped lang="less">
.icon-btn,
:deep(.el-input__inner) {
  height: v-bind(heightStyle);
}
.active {
  border-color: var(--fn-primary-color);
  color: var(--fn-primary-color);
}
</style>
