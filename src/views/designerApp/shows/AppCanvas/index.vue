<template>
  <div class="canvas-container">
    <template v-if="app.activeTemplate">
      <!--舞台容器-->
      <div class="stage-container" v-for="item in app.activeTemplate.viewList" :key="`canvas_${item.id}`" v-show="item.id === app.activeViewId">
        <!--产品图-->
        <img :src="app.getViewImageByActiveColor(item.id).image" :style="`width:${imgSize}px;height:${imgSize}px;`" class="img" />
        <!--canvas-->
        <div :id="getCanvasContainerId(item.id)" style="width: 100%;height: 100%;"></div>
        <!--背景图-->
        <img :src="app.getViewImageByActiveColor(item.id).texture" :style="`width:${imgSize}px;height:${imgSize}px;`" class="img-bg" />
      </div>

      <!--预览图列表-->
      <PreviewGroup :left="previewStyle.left" :top="previewStyle.top" :preview-list="app.activeTemplate.viewList" :active-view-id="app.activeViewId" @onView="app.setViewId" />
    </template>

    <!--捕获舞台容器坐标-->
    <div ref="canvasElRef" class="container-el">
      <!--捕获图片坐标的容器-->
      <div ref="imgElRef" :style="`width:${imgSize}px;height:${imgSize}px;`" class="img-el"></div>
    </div>

    <!--占位-->
    <div class="canvas-wrap" v-if="false">
      <!--底图1-->
      <div
        class="fn-full"
        style="position: absolute;pointer-events: none;user-select: none"
        v-for="item in app.activeColorViewList"
        :key="'view' + item.view.id"
        v-show="item.view.id === app.activeViewId"
      >
        <ImgTrack :url1="item.image" :url2="item.texture" />
      </div>

      <!--提示语-->
      <TipCard />

      <!--预览图列表-->
      <PreviewGroup :preview-list="app.activeColorViewList" :active-view-id="app.activeViewId" @onView="app.setViewId" />

      <!--icon-->
      <IconCard />
    </div>
  </div>
</template>

<script setup>
import { defineProps, nextTick, onMounted, ref } from 'vue';
import { createEventHook, useVModels } from '@vueuse/core';
// utils
import { useInjectApp } from '@/hooksFn/useDesignerApp';
import { canvasDefine, getCanvasContainerId } from '@/hooksFn/useDesignerApp/core/service/app/define';
const imgSize = canvasDefine.size;
// components
import PreviewGroup from './shows/previewGroup';
import IconCard from './shows/iconCard';
import TipCard from './shows/tipCard';
import ImgTrack from '@/components/imgTrack/index.vue';

const props = defineProps({
  activeViewId: [String, Number],
  mode: String,
  onView: Function,
  onMode: Function,
});
const { mode, activeViewId } = useVModels(props);
const { service, AppUtil } = useInjectApp();
const app = service.app;

// 容器
const { canvasElRef, imgElRef } = useContainerEl();
// 预览样式
const { previewStyle } = usePreviewStyle();

// 预览样式
function usePreviewStyle() {
  const previewStyle = ref({
    left: '-9999999px',
    top: '-9999999px',
  });
  // 容器属性服务
  app.onContainerInit((rect) => {
    const { stageWidth, stageHeight, drawWidth, drawHeight, offsetX, offsetY } = rect;
    previewStyle.value = {
      left: `${offsetX}px`,
      top: `${offsetY}px`,
    };
  });
  return {
    previewStyle,
  };
}

// 容器
function useContainerEl() {
  const canvasElRef = ref(null);
  const imgElRef = ref(null);
  onMounted(() => app.setContainerEl(canvasElRef, imgElRef));

  return {
    canvasElRef,
    imgElRef,
  };
}
</script>

<style scoped lang="less">
// 画布区域
.canvas-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .app-canvas-container {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  // 舞台容器
  .stage-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 0;
    top: 0;
    .img {
      position: absolute;
      user-select: none;
      pointer-events: none;
    }
    .img-bg {
      position: absolute;
      pointer-events: none;
      user-select: none;
    }
  }

  // 绘制区域
  .canvas-wrap {
    pointer-events: none;
    @canvasSize: v-bind(canvas_size);
    width: @canvasSize;
    height: @canvasSize;
    position: relative;
    background: #f2f2f2;
    border: 2px dashed #7e7e7e;
  }
}

.container-el {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0;
  top: 0;
  z-index: -1;
  .img-el {
    position: absolute;
    z-index: 1;
    user-select: none;
    pointer-events: none;
  }
}
</style>
