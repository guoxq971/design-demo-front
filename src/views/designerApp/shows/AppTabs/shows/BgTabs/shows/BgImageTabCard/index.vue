<template>
  <TabCard>
    <TabBody>
      <TabCondition row>
        <!--搜索-->
        <SearchCard v-model="params.query" placeholder="请输入素材名称" :getList="onSearch" :loading="loading" />
      </TabCondition>
      <TabList :list="list" @onMouseenter="onMouseenter" @onMouseleave="onMouseleave" @onContextmenu="onContextmenu" @onClick="onClick" v-loading="loading">
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
// utils
import { useGlobalBgImage } from '@/hooksFn/useDesignerApplication/core/bg/bgImage';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { useContextmenu, useHover } from '@/views/designerApp/hooks/common';
import { useGlobalApplication } from '@/hooksFn/useDesignerApplication/core/app/application';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
// components
import SearchCard from '@/views/designerApp/shows/AppTabs/components/TabCard/SearchCard.vue';
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabCondition from '@/views/designerApp/shows/AppTabs/components/Tab/TabCondition.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';

// 背景图
const { list, total, params, loading, getList, onSearch, onClick } = useBgImageData();
// 全局数据
const { contextmenus, hovers } = useGlobalData();
// 鼠标经过
const { onMouseenter, onMouseleave } = useHover(hovers.image);
// 右键菜单
const { onContextmenu } = useContextmenu(contextmenus.bgImage);

// 背景图
function useBgImageData() {
  const { setDesignImage } = useGlobalApplication();
  const { list, total, params, loading, getList, onSearch } = useGlobalBgImage();
  onMounted(() => getList());
  const onClick = (detail) => {
    setDesignImage(detail);
  };
  return {
    list,
    total,
    params,
    loading,
    getList,
    onSearch,
    onClick,
  };
}
</script>

<style scoped lang="less"></style>
