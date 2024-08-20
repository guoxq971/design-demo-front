<!--鼠标经过的浮框 - 设计图-->
<template>
  <el-card class="hover-container image-group" v-if="detail" @mouseleave.native="mouseleave()" @mouseenter.native="mouseenter()">
    <!--图片-->
    <div class="image-wrap">
      <!--previewImg or designImg-->
      <img v-if="detail.previewImg" class="image" :src="detail.previewImg" alt="" />
      <img v-else :src="detail.designImg" alt="" />
    </div>

    <div class="title">{{ title }}</div>
    <div class="line-wrap">
      <div class="id">(ID: {{ detail.imageCode }})</div>
      <div class="tags" v-if="detail.isHasRisk">
        <el-tag type="danger" v-if="detail.highRiskWords && detail.highRiskWords.length">风险</el-tag>
        <el-tag type="warning" v-else-if="detail.highRiskWords && detail.lowRiskWords.length">风险</el-tag>
      </div>
      <div class="orderNums" style="text-align: right; padding-right: .5rem">
        单数:
        <el-tag type="danger" v-if="1 == 1">
          {{ detail.orderNums ? detail.orderNums : 0 }}
        </el-tag>
      </div>
    </div>
    <div style="white-space: nowrap">
      规格:
      <span class="font-color">{{ detail.size.width }}</span>
      *
      <span class="font-color">{{ detail.size.height }}</span>
      {{ detail.size.unit }}
      <span v-if="detail.dpi">({{ detail.dpi }}dpi)</span>
      <!--previewImg or designImg-->
      <span v-if="detail.previewImg">(.{{ detail.previewImg.split('.').pop() }})</span>
      <span v-else>(.{{ detail.designImg.split('.').pop() }})</span>
    </div>
    <div class="label-wrap" v-if="detail.description">
      <span style="white-space: nowrap">标签:</span>
      <span class="img-label">{{ detail.description }}</span>
    </div>
    <template v-if="detail.isRisk == 1 && (detail.highRiskWords.length || detail.lowRiskWords.length)">
      <el-divider></el-divider>
      <!--风险词-->
      <div class="keyword-wrap">
        <div class="high" v-if="detail.highRiskWords && detail.highRiskWords.length">
          <div class="keyword-title">
            <div class="chunk high-chunk"></div>
            <div>高风险词:</div>
          </div>
          <div class="text-wrap">{{ detail.highRiskWords }}</div>
        </div>
        <div class="low" v-if="detail.lowRiskWords.length">
          <div class="keyword-title">
            <div class="chunk low-chunk"></div>
            <div>低风险词:</div>
          </div>
          <div class="text-wrap">{{ detail.lowRiskWords }}</div>
        </div>
      </div>
    </template>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';
// utils
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';

// 鼠标经过
const { mouseenter, mouseleave, detail } = useHover();
// 标题
const { title } = useTitle(detail);

// 鼠标经过
function useHover() {
  const { hover } = useGlobalData();
  const { enter, leave, detail } = hover;
  return {
    mouseenter: enter,
    mouseleave: leave,
    detail,
  };
}

// 标题
function useTitle(detail) {
  const title = computed(() => {
    let title = '';
    if (detail.value.description) {
      title = detail.value.description;
    } else if (detail.value.imageTitle) {
      title = detail.value.imageTitle;
    } else if (detail.value.name) {
      title = detail.value.name;
    } else if (detail.value.imageName) {
      title = detail.value.imageName;
    }
    return title;
  });
  return { title };
}
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

  .image-wrap {
    position: relative;
    width: 100%;
    //width: 24.5rem;
    height: 24.5rem;
    background-color: #f5f7fa;
    border-radius: 0.4rem;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }

    .image {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      //height: 100%;
      // 居中
      transform: translateY(-50%);
    }
  }

  .title {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 设计图
.image-group {
  .font-color {
    color: var(--fn-primary-color);
  }

  // 设计图-标签超出省略号
  .img-label {
    display: inline-block;
    max-height: 10rem;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: -webkit-box;
    line-clamp: 5;
    -webkit-box-orient: vertical;
  }
  .text-wrap {
    word-wrap: break-word;
  }

  :deep(.el-divider--horizontal) {
    margin: 0.8rem 0;
  }

  // id + 标签(icon)
  .line-wrap {
    display: flex;
    height: 2.4rem;
    align-items: center;

    .id {
      color: #c0c4cc;
    }

    .tags {
      display: flex;
      margin-left: 0.7rem;
    }
  }

  // 标签
  .label-wrap {
    word-wrap: break-word;
  }

  // 风险词
  .keyword-wrap {
    .keyword-title {
      display: flex;
      align-items: center;
    }

    .chunk {
      width: 0.6rem;
      height: 1.5rem;
      margin-right: 0.4rem;
      border-radius: 0.2rem;
    }
    .high {
      .high-chunk {
        background-color: red;
      }
    }

    .low {
      .low-chunk {
        background-color: #ffff00;
      }
    }
  }
}
</style>
