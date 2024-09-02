<template>
  <div class="canvas-container" v-loading="loading">
    <template v-if="activeTemplate">
      <!--舞台容器-->
      <div class="stage-container" v-for="item in activeTemplate.viewList" :key="`canvas_${item.id}`" v-show="item.id === activeViewId">
        <!--产品图-->
        <img v-show="isShowProdImg" :src="getActiveColorViewImage(item.id)?.image" :style="`width:${imgSize}px;height:${imgSize}px;`" class="img" />
        <!--canvas-->
        <div v-show="isShow2DCanvas" :id="get2dCanvasId(item.id)" style="width: 100%;height: 100%;"></div>
        <!--背景图-->
        <img v-show="isShowProdImg" :src="getActiveColorViewImage(item.id)?.texture" :style="`width:${imgSize}px;height:${imgSize}px;`" class="img-bg" />
      </div>
      <!--three 容器-->
      <div v-loading="threeLoading" style="border: 2px dashed #7e7e7e;" v-show="isShowThree">
        <div :style="`width:${imgSize}px;height:${imgSize}px;position:relative`" :id="useDesignerAppConfig().three_container_id" />
      </div>

      <!--预览图列表 + 精细/通用-->
      <PreviewGroup :left="previewStyle.left" :top="previewStyle.top" />
    </template>

    <!--捕获舞台容器坐标-->
    <div ref="canvasElRef" class="container-el">
      <!--捕获图片坐标的容器-->
      <div ref="imgElRef" :style="`width:${imgSize}px;height:${imgSize}px;`" class="img-el"></div>
    </div>

    <!--占位-->
    <div class="canvas-wrap" v-if="false">
      <!--提示语-->
      <TipCard />

      <!--icon-->
      <IconCard />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
// utils
// components
import PreviewGroup from './shows/previewGroup';
import IconCard from './shows/iconCard';
import TipCard from './shows/tipCard';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useDesignerContainerEl } from '@/hooksFn/useGlobalDesigner/core/contaienr';

// 设计器基础数据
const { loading, threeLoading, activeTemplate, activeViewId, activeView, getActiveColorViewImage, mode } = useDesignerApplication();
// 容器
const { canvasElRef, imgElRef } = useDesignerContainerEl();
// 预览样式
const { previewStyle } = usePreviewStyle();
// canvas配置
const imgSize = useDesignerAppConfig().canvas_size;
const get2dCanvasId = useDesignerAppConfig().get2dCanvasId;

// 是否展示产品图
const isShowProdImg = computed(() => {
  // 编辑模式 && 激活视图没有车线
  if (useDesignerApplication().mode.value === useDesignerAppConfig().mode_type_edit && !activeView.value.printout) {
    // 如果显示3d,则不显示产品图
    if (isShowThree.value) return false;
    return true;
  }
  // 预览模式
  if (mode.value === useDesignerAppConfig().mode_type_preview) {
    // 如果显示3d,则不显示产品图
    if (isShowThree.value) return false;
    return true;
  }
});
// 是否展示2dCanvas
const isShow2DCanvas = computed(() => {
  // 加载3d && 预览模式
  if (isShowThree.value) {
    return false;
  }
  return true;
});
// 是否展示3d
const isShowThree = computed(() => {
  // 加载3d && 预览模式
  if (activeTemplate.value.is3d && mode.value === useDesignerAppConfig().mode_type_preview) {
    return true;
  }
});

// 预览样式
function usePreviewStyle() {
  const previewStyle = ref({
    left: '-9999999px',
    top: '-9999999px',
  });

  const { onUpdate } = useDesignerContainerEl();
  // 容器属性服务
  onUpdate((rect) => {
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
