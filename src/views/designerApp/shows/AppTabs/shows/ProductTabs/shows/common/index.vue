<template>
  <TabCard>
    <TabBody>
      <TabCondition>
        <!--搜索-->
        <SearchCard v-model="params.tempalteNoOrName" placeholder="请输入产品名称、编号" :getList="onSearch" :loading="loading" />
        <!--分类-->
        <CategoryTemplate class="fn-mt-gap-min" :params="params" :onSearch="onSearch" />
      </TabCondition>
      <TabList
        :list="list"
        @onMouseenter="onMouseenterTemplate"
        @onMouseleave="onMouseleaveTemplate"
        @onContextmenu="onContextmenuTemplate"
        @onClick="onClick"
        v-loading="loading"
        :active="(v) => v.id === activeTemplate?.id"
      >
        <template slot-scope="{ row }">
          <ImgTrack :url1="AppUtil.getShowImage(row).image" :url2="AppUtil.getShowImage(row).texture" />
        </template>
      </TabList>
    </TabBody>
    <TabPagination :params.sync="params" :total="total" :get-list="getList" />
  </TabCard>
</template>

<script setup>
import { onMounted } from 'vue';
// components
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabCondition from '@/views/designerApp/shows/AppTabs/components/Tab/TabCondition.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';
import CategoryTemplate from '../../components/CategoryTemplate.vue';
import ImgTrack from '@/components/imgTrack/index.vue';
import SearchCard from '@/views/designerApp/shows/AppTabs/components/TabCard/SearchCard.vue';
// utils
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

// 通用模板数据
const { list, total, params, loading, getList, onSearch } = useGlobalDesigner().commonTemplate;
onMounted(() => getList().then((_) => list.value.length && useDesignerApplication().setTemplate(list.value[0])));
const onClick = (detail) => useDesignerApplication().setTemplate(detail);
// 右键菜单
const { onContextmenuTemplate } = useGlobalDesigner().contextmenu;
// 鼠标经过
const { onMouseenterTemplate, onMouseleaveTemplate } = useGlobalDesigner().hover;
// 激活模板
const { activeTemplateId, activeTemplate } = useDesignerApplication();
</script>

<style scoped lang="less"></style>
