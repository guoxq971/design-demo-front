<template>
  <div class="tab">
    <div class="line-gap-deb">
      <!--色板-->
      <ColorPicker v-model="color" />
    </div>
    <div>
      <div class="line-gap color-chunk-line">
        <!--当前颜色色块-->
        <div class="color-chunk" :style="{ background: color }"></div>
        <el-input v-model="color" class="color-chunk-input"></el-input>
        <!--拾色器-->
        <div class="color-picker">
          <colorPickerSvg />
        </div>
      </div>
    </div>
    <!--色板预设-->
    <div class="line-gap">
      <div class="line-gap">色板预设</div>
      <div class="default-color-group line-gap">
        <div @click="onClickColor(item)" v-for="item in defaultColorList" :key="item" :style="{ backgroundColor: item }" class="default-color-item"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import { useDebounceFn } from '@vueuse/core';
// components
import ColorPickerSvg from '@/views/designerApp/components/svg/colorPickerSvg.vue';
// utils
import ColorPicker from './shows/ColorPicker';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

// 颜色列表
const defaultColorList = useDesignerAppConfig().default_color_list;
function onClickColor(val) {
  color.value = val;
}

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
.line-gap-deb {
  margin-top: var(--fn-gap);
}
.line-gap {
  margin-top: var(--fn-gap-min);
}
.line {
  margin-top: var(--fn-gap-min);
  display: flex;
  justify-content: space-between;
  gap: var(--fn-gap-min);
}
// 色块 + 拾色器
.color-chunk-line {
  display: flex;
  align-items: center;
}

// 色块
.color-chunk {
  min-width: 4rem;
  min-height: 4rem;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
}
.color-chunk-input {
  width: 12rem;
  margin-left: var(--fn-gap-min);
}
.color-picker {
  margin-left: var(--fn-gap-min);
  cursor: pointer;
  &:hover {
    color: var(--fn-primary-color);
  }
}

// 预设
.default-color-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fn-gap-min);
}
.default-color-item {
  cursor: pointer;
  width: 2.8rem;
  height: 2.8rem;
  box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  padding: 0.3rem;
  background-clip: content-box;
  &:hover {
    border-color: var(--fn-primary-color);
  }
}
</style>
