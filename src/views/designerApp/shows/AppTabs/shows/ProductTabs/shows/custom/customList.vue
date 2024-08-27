<template>
  <TabCard>
    <TabBody>
      <TabCondition>
        <!--搜索-->
        <SearchCard v-model="params.queryInput" placeholder="请输入产品名称、编号" :getList="onSearch" :loading="loading" />
        <!--分类-->
        <CategoryTemplate class="fn-mt-gap-min" :params="params" :onSearch="onSearch" />
      </TabCondition>
      <TabList :list="list" @onMouseenter="onMouseenterTemplate" @onMouseleave="onMouseleaveTemplate" @onClick="onClick" v-loading="loading">
        <template slot-scope="{ row }">
          <ImgTrack :url1="AppUtil.getShowImage(row).image" :url2="AppUtil.getShowImage(row).texture" />
        </template>
      </TabList>
    </TabBody>
    <TabPagination :params.sync="params" :total="total" :get-list="getList" />
  </TabCard>
</template>

<script setup>
import { onMounted, defineEmits } from 'vue';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
// components
import TabCard from '../../../../components/Tab/TabCard.vue';
import TabBody from '../../../../components/Tab/TabBody.vue';
import TabCondition from '../../../../components/Tab/TabCondition.vue';
import TabList from '../../../../components/Tab/TabList.vue';
import TabPagination from '../../../../components/Tab/TabPagination.vue';
import CategoryTemplate from '../../components/CategoryTemplate.vue';
import ImgTrack from '@/components/imgTrack/index.vue';
import SearchCard from '@/views/designerApp/shows/AppTabs/components/TabCard/SearchCard.vue';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';

const emit = defineEmits(['onClick']);

// 定制模板
const { list, total, params, loading, getList, onSearch } = useGlobalDesigner().customTemplate;
onMounted(() => getList());
const onClick = (item) => emit('onClick', item);
// 鼠标经过
const { onMouseenterTemplate, onMouseleaveTemplate } = useGlobalDesigner().hover;
</script>

<style scoped lang="less"></style>
