<template>
  <TabCard>
    <TabBody>
      <TabCondition>
        <div class="header-wrap">
          <div class="box-wrap">
            <ImgTrack :url1="AppUtil.getShowImage(detail).image" :url2="AppUtil.getShowImage(detail).texture" />
          </div>
          <div class="info-wrap">
            <div class="title">{{ detail.name }}</div>
            <div class="model">{{ detail.templateNo }}</div>
            <div>
              <span>定制模板数量:</span>
              <span class="count">{{ total }}</span>
            </div>
          </div>
          <el-button class="back-btn" @click="onBack">返回</el-button>
        </div>
      </TabCondition>
      <TabList :list="list" @onMouseenter="onMouseenterCustomTemplate" @onMouseleave="onMouseleave" @onClick="onClick" v-loading="loading">
        <template slot-scope="{ row }">
          <ImgTrack :url1="getCustomTemplateImage(row)" />
        </template>
      </TabList>
    </TabBody>
    <TabPagination :params.sync="params" :total="total" :get-list="getList" />
  </TabCard>
</template>

<script setup>
import { onMounted, defineProps } from 'vue';
import { useVModels } from '@vueuse/core';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
// components
import TabCard from '../../../../components/Tab/TabCard.vue';
import TabBody from '../../../../components/Tab/TabBody.vue';
import TabCondition from '../../../../components/Tab/TabCondition.vue';
import TabList from '../../../../components/Tab/TabList.vue';
import TabPagination from '../../../../components/Tab/TabPagination.vue';
import ImgTrack from '@/components/imgTrack/index.vue';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';

const props = defineProps({
  detail: Object,
});
const { detail } = useVModels(props);

// 回退
const { onBack } = useBack(detail);
// 鼠标经过
const { onMouseenterCustomTemplate, onMouseleave } = useGlobalDesigner().hover;
// 定制模板详情
const { list, total, params, loading, getList, reset, onClick, getCustomTemplateImage } = useCustomTemplatePage();

// 定制模板
function useCustomTemplatePage() {
  // 定制模板详情
  const { list, total, params, loading, getList, reset } = useGlobalDesigner().customTemplate.customDetail;

  // 选择模板
  function onClick() {}

  // 显示图片
  const getCustomTemplateImage = (row) => {
    if (row.productList.length === 0) return '';
    return row.productList[0]?.productImageSmall;
  };

  onMounted(() => {
    params.value.templateId = detail.value.seqId;
    getList();
  });

  return {
    list,
    total,
    params,
    loading,
    getList,
    reset,
    onClick,
    getCustomTemplateImage,
  };
}

// 回退
function useBack(detail) {
  // 回退
  function onBack() {
    detail.value = null;
    reset();
  }

  return { onBack };
}
</script>

<style scoped lang="less">
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
