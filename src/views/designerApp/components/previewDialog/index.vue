<template>
  <el-dialog :title="title" :close-on-click-modal="false" :width="dialog.width" :top="dialog.top" append-to-body visible @close="onClose">
    <div class="preview-dialog-container">
      <!--预览列表-->
      <div class="preview-list">
        <div :class="{ active: index === i }" class="preview-item" v-for="(item, i) in activeColor.multiImageList" :key="`big_preview_box_${item.id}`" @click="onPreviewBoxClick(item, i)">
          <div class="show-box">
            <img class="child-box" :src="AppUtil.setStartHttp(item.bgImg)" />
            <template v-if="isMulti3D(item)">
              <div class="child-box">
                <img :src="getImg(item.id)" alt="" class="fn-full" />
              </div>
            </template>
            <template v-else>
              <img class="child-box" v-if="item.designImg" :src="item.designImg" alt="" />
            </template>
            <img class="child-box" :src="AppUtil.setStartHttp(item.prodImg)" />
          </div>
        </div>
      </div>
      <!--大图-->
      <div class="big-box">
        <el-carousel ref="carouselRef" trigger="click" indicator-position="outside" arrow="always" :loop="false" :autoplay="false" @change="onChange">
          <template v-if="activeColor?.multiImageList">
            <el-carousel-item v-for="item in activeColor.multiImageList" :key="`big_preview_box_${item.id}`">
              <div class="show-box">
                <img class="child-box" :src="AppUtil.setStartHttp(item.bgImg)" />
                <template v-if="isMulti3D(item)">
                  <div class="child-box">
                    <img :src="getImg(item.id)" alt="" class="fn-full" />
                  </div>
                </template>
                <template v-else>
                  <img class="child-box" v-if="item.designImg" :src="item.designImg" alt="" />
                </template>
                <img class="child-box" :src="AppUtil.setStartHttp(item.prodImg)" />
              </div>
            </el-carousel-item>
          </template>
        </el-carousel>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, defineEmits, defineProps, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { useVModels } from '@vueuse/core';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useMultiUtil } from '@/hooksFn/useGlobalDesigner/core/application/template/multi';

const title = '预览效果图';
const dialog = computed(() => {
  return {
    width: '120rem',
    top: '5vh',
  };
});
const emit = defineEmits([]);
const onClose = () => (show.value = false);
const props = defineProps({
  show: { type: Boolean, default: false },
});
const { show } = useVModels(props);

// 走马灯
const { carouselRef, index, onPreviewBoxClick, onChange } = onCarousel();

// 模板属性
const {
  // 基础属性
  renderLoading,
  activeTemplate,
  activeView,
  activeColor,
  activeSizeId,
  activeColorId,
  setColorId,
  setSizeId,
} = useDesignerApplication();

// 多角度处理
const { isMulti3D, getMultiContainerId } = useMultiUtil();
// 同步多角度
const list = ref([]);
const getImg = computed(() => (id) => {
  return list.value.find((item) => item.id === id)?.url;
});
onMounted(() => {
  setTimeout(() => syncMulti());
});
onBeforeUnmount(() => {
  list.value.forEach((item) => {
    item.url && URL.revokeObjectURL(item.url);
  });
  list.value = [];
});
function syncMulti() {
  for (let item of activeColor.value.multiImageList) {
    const orgDom = document.getElementById(getMultiContainerId(item.id));
    const orgCanvas = orgDom.querySelector('canvas');
    const base64 = orgCanvas.toDataURL();
    list.value.push({
      id: item.id,
      url: base64,
    });
  }
}

// 走马灯
function onCarousel() {
  const carouselRef = ref(null);
  // 下标
  const index = ref(0);
  // 左侧预览图列表点击
  function onPreviewBoxClick(item, i) {
    carouselRef.value.setActiveItem(i);
    index.value = i;
  }
  // 走马灯切换
  function onChange(newIndex, oldIndex) {
    index.value = newIndex;
  }
  return {
    carouselRef,
    index,
    onPreviewBoxClick,
    onChange,
  };
}
</script>

<style scoped lang="less">
.preview-dialog-container {
  display: flex;
  justify-content: center;
}

@width: 700px;
@height: 700px;

.preview-list {
  width: 135px;
  height: @height;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-right: 1.6rem;
  .preview-item {
    border: 2px solid #e1e1e1;
    width: 120px;
    height: 120px;
    min-width: 12rem;
    min-height: 12rem;
    cursor: pointer;
    &:hover {
      border-color: var(--fn-primary-color);
    }
  }
  .active {
    border-color: var(--fn-primary-color);
  }
}
.big-box {
  width: @width;
  height: @height;
}

:deep(.el-carousel) {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-carousel__container {
    height: 100% !important;
    box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
    //border-radius: 0.8rem;
    border: 1px solid #e1e1e1;
    overflow: hidden;
  }
  // 小圆点
  .el-carousel__indicators {
    .el-carousel__indicator--horizontal {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #b2b2b2;
      box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
      padding: 0;
      margin-right: var(--fn-gap-min);
      .el-carousel__button {
        display: none;
      }
    }
    .is-active {
      background-color: var(--fn-primary-color);
    }
  }
  // 箭头
  .el-carousel__arrow--right {
    position: absolute;
    right: 0;
    width: 28px;
    height: 100px;
    box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
    border-radius: 8px 0px 0px 8px;
    .el-icon-arrow-right {
      font-size: 24px;
      font-weight: bold;
    }
    &:hover {
      color: var(--fn-primary-color);
      background: var(--fn-primary-color-hover2);
    }
  }
  .el-carousel__arrow--left {
    position: absolute;
    left: 0;
    width: 28px;
    height: 100px;
    box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
    border-radius: 0px 8px 8px 0px;
    .el-icon-arrow-left {
      font-size: 24px;
      font-weight: bold;
    }
    &:hover {
      color: var(--fn-primary-color);
      background: var(--fn-primary-color-hover2);
    }
  }
}

// 展示盒子
.show-box {
  width: 100%;
  height: 100%;
  position: relative;
  .child-box {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
</style>
