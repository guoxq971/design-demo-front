<template>
  <TabCard>
    <TabBody>
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
import { useGlobalCollectImage } from '@/hooksFn/useDesignerApplication/core/image/collectImage';
import { useGlobalApplication } from '@/hooksFn/useDesignerApplication/core/app/application';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { useContextmenu, useHover } from '@/views/designerApp/hooks/common';
// components
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';

// 收藏图库
const { list, total, params, loading, getList, onClick } = useCollectImageData();
// 全局数据
const { contextmenus, hovers } = useGlobalData();
// 鼠标经过
const { onMouseenter, onMouseleave } = useHover(hovers.image);
// 右键菜单
const { onContextmenu } = useContextmenu(contextmenus.image);

// 收藏图库
function useCollectImageData() {
  const { setDesignImage } = useGlobalApplication();
  const { list, total, params, loading, getList } = useGlobalCollectImage();
  onMounted(() => getList());
  const onClick = () => {
    setDesignImage(detail);
  };
  return {
    list,
    total,
    params,
    loading,
    getList,
    onClick,
  };
}
</script>

<style scoped lang="less"></style>
