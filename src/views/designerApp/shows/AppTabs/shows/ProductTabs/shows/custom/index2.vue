<template>
  <div class="custom-container">
    <!--外层列表-->
    <TabCard
      v-show="!showDetail"
      placeholder="请输入产品名称、编号"
      :searchValue.sync="service.template.custom.params.queryInput"
      :params.sync="service.template.custom.params"
      :list="service.template.custom.list"
      :total="service.template.custom.total"
      :loading="service.template.custom.loading"
      @getList="service.template.custom.getList"
      :showCategory="false"
      @itemClick="itemClick"
    />

    <!--详情列表-->
    <TabCard
      v-if="showDetail"
      :list="service.template.custom.customDetail.list"
      :total="service.template.custom.customDetail.total"
      :loading="service.template.custom.customDetail.loading"
      @getList="service.template.custom.customDetail.getList"
      customCondition
      :customItem="hovers.custom"
      @itemClick="itemClickDetail"
    >
      <template #item="{row}">
        <ImgTrack :url1="row.productList[0].productImageSmall" />
      </template>

      <template #condition v-if="detail">
        <div class="header-wrap">
          <div class="box-wrap">
            <ImgTrack :url1="AppUtil.getShowImage(detail).image" :url2="AppUtil.getShowImage(detail).texture" />
          </div>
          <div class="info-wrap">
            <div class="title">{{ detail.name }}</div>
            <div class="model">{{ detail.templateNo }}</div>
            <div>
              <span>定制模板数量:</span>
              <span class="count">{{ service.template.custom.customDetail.total }}</span>
            </div>
          </div>
          <el-button class="back-btn" @click="onBack">返回</el-button>
        </div>
      </template>
    </TabCard>
  </div>
</template>

<script setup>
import { hovers } from '@/hooksFn/useDesignerApp/core/service/common/hoverService';
import ImgTrack from '@/components/imgTrack/index.vue';
import TabCard from '@/views/designerApp/shows/AppTabs/components/TabCard/index.vue';
import { useInjectApp } from '@/hooksFn/useDesignerApp';
import { ref } from 'vue';
const { service, AppUtil } = useInjectApp();

// 详情
const showDetail = ref(false);
const detail = ref(null);
function onBack() {
  showDetail.value = false;
  detail.value = null;
  service.template.custom.customDetail.reset();
}
function itemClickDetail(item) {
  console.log('item', item);
}

// 列表点击
async function itemClick(item) {
  console.log(item);
  service.template.custom.customDetail.params.templateId = item.seqId;
  await service.template.custom.customDetail.getList();
  detail.value = item;
  showDetail.value = true;
}
</script>

<style scoped lang="less">
.custom-container {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.header-wrap {
  position: relative;
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 5px 0;

  .box-wrap {
    width: 100px;
    height: 100px;
    margin-right: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
  }

  .info-wrap {
    flex: 1;
    .title {
      font-weight: bold;
      font-size: 14px;
    }
    .model {
      font-weight: bold;
    }
    .count {
      color: red;
      margin-left: 6px;
    }
  }

  .back-btn {
    position: absolute;
    right: 0;
    bottom: 5px;
  }
}
</style>
