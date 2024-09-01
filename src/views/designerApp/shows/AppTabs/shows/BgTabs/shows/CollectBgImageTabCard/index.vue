<template>
  <TabCard>
    <TabBody>
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
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

// 背景收藏图
const { list, total, params, loading, getList } = useGlobalDesigner().collectBgImage;
onMounted(() => getList());
const onClick = (detail) => useDesignerApplication().addImage(detail);
// 鼠标经过
const { onMouseenterImage, onMouseleave } = useGlobalDesigner().hover;
// 右键菜单
const { onContextmenuBgImage } = useGlobalDesigner().contextmenu;
</script>

<style scoped lang="less"></style>
