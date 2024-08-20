<template>
  <TabCard>
    <TabBody>
      <TabCondition>
        <!--搜索-->
        <SearchCard v-model="params.tempalteNoOrName" placeholder="请输入产品名称、编号" :getList="onSearch" :loading="loading" />
        <!--分类-->
        <CategoryTemplate class="fn-mt-gap-min" :params="params" :onSearch="onSearch" />
      </TabCondition>
      <TabList :list="list" @onMouseenter="onMouseenter" @onMouseleave="onMouseleave" @onContextmenu="onContextmenu" @onClick="onClick" v-loading="loading" :active="(v) => v.id === activeTemplateId">
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
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useGlobalCommonTemplate } from '@/hooksFn/useDesignerApplication/core/template/commonTemplate';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { useGlobalApplication } from '@/hooksFn/useDesignerApplication/core/app/application';
import { useContextmenu, useHover } from '@/views/designerApp/hooks/common';
// components
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabCondition from '@/views/designerApp/shows/AppTabs/components/Tab/TabCondition.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';
import CategoryTemplate from '../../components/CategoryTemplate.vue';
import ImgTrack from '@/components/imgTrack/index.vue';
import SearchCard from '@/views/designerApp/shows/AppTabs/components/TabCard/SearchCard.vue';

// 通用模板数据
const { list, total, params, loading, getList, onSearch, activeTemplateId, onClick } = useCommonTemplateData();
// 全局数据
const { contextmenus, hovers } = useGlobalData();
// 鼠标经过
const { onMouseenter, onMouseleave } = useHover(hovers.template);
// 右键菜单
const { onContextmenu } = useContextmenu(contextmenus.template);

// 通用模板数据
function useCommonTemplateData() {
  // 通用模板数据
  const { list, total, params, loading, getList, onSearch } = useGlobalCommonTemplate();
  onMounted(() => getList());

  // 设置模板
  const { setTemplate, templateData } = useGlobalApplication();
  const { activeTemplateId } = templateData;
  const onClick = (detail) => {
    setTemplate(detail);
  };

  return {
    list,
    total,
    params,
    loading,
    getList,
    onSearch,
    activeTemplateId,
    onClick,
  };
}
</script>

<style scoped lang="less"></style>
