<template>
  <TabCard>
    <TabBody>
      <TabCondition>
        <!--搜索-->
        <SearchCard v-model="params.query" placeholder="请输入素材名称" :getList="onSearch" :loading="loading" />
        <TabConditionSecond>
          <!--分类-->
          <ImageCategoryCascader :onSearch="onSearch" :one.sync="params.basetype" :two.sync="params.nexttype" class="fn-full" />
          <!--图片类型-->
          <ImageTypeButton :imageType.sync="params.imageType" :getList="onSearch" />
        </TabConditionSecond>
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
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useContextmenu, useHover } from '@/views/designerApp/hooks/common';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
// components
import ImageCategoryCascader from './components/ImageCategoryCascader';
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabCondition from '@/views/designerApp/shows/AppTabs/components/Tab/TabCondition.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';
import SearchCard from '@/views/designerApp/shows/AppTabs/components/TabCard/SearchCard.vue';
import ImageTypeButton from '@/views/designerApp/shows/AppTabs/components/ImageTypeButton/index.vue';
import TabConditionSecond from '@/views/designerApp/shows/AppTabs/components/Tab/TabConditionSecond.vue';
import { useGlobalPlatformImage } from '@/hooksFn/useDesignerApplication/core/image/platformImage';
import { useGlobalApplication } from '@/hooksFn/useDesignerApplication/core/app/application';

// 平台图库
const { list, total, params, loading, getList, onSearch, onClick } = usePlatformImageData();
// 全局数据
const { contextmenus, hovers } = useGlobalData();
// 鼠标经过
const { onMouseenter, onMouseleave } = useHover(hovers.image);
// 右键菜单
const { onContextmenu } = useContextmenu(contextmenus.image);

// 平台图库
function usePlatformImageData() {
  const { setDesignImage } = useGlobalApplication();
  const { list, total, params, loading, getList, onSearch } = useGlobalPlatformImage();
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
