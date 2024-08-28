<template>
  <div class="preview-container" style="width: fit-content" :style="leftStyle">
    <conrner>
      <div class="btn-wrap">
        <span>精细设计</span>
      </div>
    </conrner>
    <div class="preview-box-group" style="width: fit-content">
      <div class="preview-box" :class="{ active: activeViewId === item.id }" @click="setViewId(item.id)" v-for="(item, index) in activeTemplate.viewList" :key="'preview' + item.id">
        <img :src="getActiveColorViewImage(item.id).image" alt="" style="position: absolute;width: 100%;height:100%;user-select: none;pointer-events: none" />
        <!--容器id-->
        <img v-if="getBase64ByViewId(item.id)" :src="getBase64ByViewId(item.id)" class="fn-full" style="position: absolute;" />
        <img :src="getActiveColorViewImage(item.id).texture" alt="" style="position: absolute;width: 100%;height:100%;user-select: none;pointer-events: none" />
        <div class="preview-box-label">图层{{ index + 1 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue';
// components
import conrner from '@/views/designerApp/components/conrner.vue';
// utils
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';

const emit = defineEmits(['onView']);
const props = defineProps({
  canvasSize: Number,
  left: { type: [String, Number], default: -999999 },
  top: { type: [String, Number], default: -999999 },
});

// 设计器基础数据
const { getBase64ByViewId, activeViewId, activeTemplate, setViewId, getActiveColorViewImage } = useGlobalDesigner().app;

// 样式管理
const { leftStyle, size, scrollGap, gap } = useStyle();

// 样式管理
function useStyle() {
  const size = '9.2rem';
  // 滚动条宽度
  const scrollGap = '1.2rem';
  // 和canvas的间距
  const gap = `calc(var(--fn-gap-min) + ${scrollGap})`;

  const leftStyle = computed(() => {
    const left = `calc(${setPx(props.left)} - ${size} - ${gap})`;
    const top = `calc(${setPx(props.top)})`;
    return {
      left,
      top,
    };
  });

  function setPx(value) {
    return value.toString().indexOf('px') > -1 ? value : value + 'px';
  }

  return {
    leftStyle,
    size,
    scrollGap,
    gap,
  };
}
</script>

<style scoped lang="less">
@canvasSize: v-bind('props.canvasSize');

//预览图列表
.preview-container {
  pointer-events: all;
  @size: v-bind(size); //宽度
  @scrollGap: v-bind(scrollGap); //滚动条宽度
  @gap: v-bind(gap); //和canvas的间距
  @designBtnHeight: 3.4rem; //通用/精细按钮的高度
  @designBtnGap: var(--fn-gap);
  position: absolute;
  //left: calc((@size + @gap) * -1);
  width: calc(@size + @scrollGap);

  // 精细/通用设计
  .btn-wrap {
    width: @size;
    height: @designBtnHeight;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 1.4rem;
    color: #000c01;
    line-height: 1.9rem;
    cursor: pointer;
    margin-bottom: @designBtnGap;
    &:hover {
      opacity: 0.9;
    }
  }
  // 预览box
  .preview-box-group {
    user-select: none;
    //max-height: calc(@canvasSize - @designBtnHeight - @designBtnGap);
    //overflow: auto;
    display: flex;
    flex-direction: column;
    .preview-box {
      width: @size;
      height: @size;
      margin-bottom: var(--fn-gap-min);
      border: 1px solid #e9e9e9;
      cursor: pointer;
      position: relative;
      &:last-child {
        margin-bottom: 0;
      }
      &:hover {
        border-color: var(--fn-primary-color);
      }

      .preview-box-label {
        position: absolute;
        z-index: 3;
        bottom: 0;
        width: 100%;
        height: 2.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: #000000;
        opacity: 0.3;
        font-size: 1.2rem;
        line-height: 1.6rem;
      }
    }
    .active {
      border-color: var(--fn-primary-color);
    }
  }
}
</style>
