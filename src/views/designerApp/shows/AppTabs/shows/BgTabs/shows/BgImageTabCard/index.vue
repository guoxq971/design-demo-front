<template>
  <TabCard>
    <TabBody>
      <TabCondition row>
        <!--搜索-->
        <SearchCard v-model="params.query" placeholder="请输入素材名称" :getList="onSearch" :loading="loading" />
      </TabCondition>
      <TabList :list="list" @onMouseenter="onMouseenterImage" @onMouseleave="onMouseleave" @onContextmenu="onContextmenuBgImage" @onClick="onClick" v-loading="loading">
        <template slot-scope="{ row }">
          <img :src="AppUtil.setStartHttp(row.designImg)" class="fn-full" />
        </template>
      </TabList>
    </TabBody>
    <TabPagination :params.sync="params" :total="total" :get-list="getList" />
  </TabCard>
</template>

<script setup>
import { onMounted } from 'vue';
// components
import SearchCard from '@/views/designerApp/shows/AppTabs/components/TabCard/SearchCard.vue';
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabCondition from '@/views/designerApp/shows/AppTabs/components/Tab/TabCondition.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';
// utils
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

// 背景图
const { list, total, params, loading, getList, onSearch } = useGlobalDesigner().bgImage;
onMounted(() => getList());
const onClick = (detail) => useDesignerApplication().addImage(detail);
// 鼠标经过
const { onMouseenterImage, onMouseleave } = useGlobalDesigner().hover;
// 右键菜单
const { onContextmenuBgImage } = useGlobalDesigner().contextmenu;
</script>

<style scoped lang="less"></style>
