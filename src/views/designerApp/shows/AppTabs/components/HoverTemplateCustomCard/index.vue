<!--鼠标经过的浮框 - 产品模板-->
<template>
  <el-card class="hover-container" v-if="detail" @mouseleave.native="mouseleave()" @mouseenter.native="mouseenter()">
    <!--图片-->
    <div class="image-wrap">
      <div class="type-name">{{ typeName }}</div>
      <img class="image" :src="src" alt="" />
    </div>

    <!--标题 - 副标题-->
    <div class="title-2" style="margin-top: .4rem">{{ detail.productCodes }}</div>
    <div class="title">{{ detail.customName }}</div>
    <div class="title-2">
      <span v-if="detail.createUserId">({{ detail.createUserId }})</span>
      <span>{{ detail.createUserName }}</span>
    </div>
    <div class="title-2">{{ detail.createTime }}</div>

    <!--精细设计-->
    <div v-if="detail.designType !== 0">
      <div class="size-wrap">设计尺码:</div>
      <div class="model-info-color">
        <div class="model-info-color-size" v-for="item in detail.productList" :key="item.designSize">
          {{ item.designSize }}
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';
import { useInjectApp } from '@/hooksFn/useDesignerApp';

// hover
const { service, AppUtil } = useInjectApp();
const mouseenter = (item = null) => service.template.hover.enter(item);
const mouseleave = (item = null) => service.template.hover.leave();
const detail = computed(() => service.template.hover.detail);

const typeName = computed(() => {
  if (detail.value.designType === 0) {
    return '通用';
  } else {
    return '精细';
  }
});
const src = computed(() => {
  // 判空
  if (!(detail.value.productList && detail.value.productList.length > 0)) {
    return '';
  }
  const s = detail.value.productList[0].productImageSmall;
  // 判断你是否需要添加前缀
  if (s.startsWith('http')) {
    return s;
  } else {
    return process.env.VUE_APP_API_BASE_IMG_URL + s;
  }
});
</script>

<style scoped lang="less">
.hover-container {
  position: absolute;
  z-index: 7;
  top: 10.4rem;
  right: -27.7rem;
  width: 26.5rem;

  :deep(.el-card__body) {
    padding: 0.7rem;
  }

  .title {
    font-size: 1.9rem;
    font-weight: bold;
    margin-top: 0.3rem;
  }

  .title-2 {
    color: #a2a2a2;
    font-size: 1.4rem;
  }

  .image-wrap {
    position: relative;
    width: 100%;
    height: 24.5rem;
    background-color: #f5f7fa;
    border-radius: 0.4rem;
    overflow: hidden;
    border: 0.1rem solid #aaa;

    .image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .type-name {
      position: absolute;
      z-index: 2;
      right: 0.4rem;
      top: 0.4rem;
      border: 0.1rem solid #aaa;
      border-radius: 0.4rem;
      padding: 0.2rem 0.9rem;
      font-size: 1.4rem;
      color: var(--fn-primary-color);
      //font-weight: bold;
      background: rgba(255, 255, 255, 0.9);
    }
  }
}

.size-wrap {
  color: #a2a2a2;
  border-top: 0.1rem solid #aaa;
  margin-bottom: 0.4rem;
  font-size: 1.5rem;
  margin-top: 0.7rem;
  padding-top: 0.4rem;
}

// 颜色 and 尺码
.model-info-color {
  display: flex;
  max-width: 43rem;
  flex-wrap: wrap;

  .model-info-color-item {
    width: 1.9rem;
    border: #d6d2d2 solid 0.1rem;
    border-radius: 0.4rem;
    height: 1.9rem;
    margin-right: 0.4rem;
    margin-bottom: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;

    & div {
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 0.3rem;
    }
  }

  .model-info-color-size {
    border: 0.1rem solid #ccc;
    padding: 0 0.3rem;
    margin-right: 0.4rem;
    border-radius: 0.4rem;
    background-color: #fff;
    margin-bottom: 0.8rem;
    //margin-bottom: .5rem;
    font-size: 1.3rem;
  }
}
</style>
