<template>
  <TabContainer>
    <!--选项卡-头部-->
    <TabsHeader :activeTab.sync="activeTabProduct" :list="productTabList" />
    <!--通用产品-->
    <CommonTabCard v-show="activeTabProduct === tabs.product.common" />
    <!--定制产品-->
    <CustomTabCard v-show="activeTabProduct === tabs.product.custom" />
    <!--收藏产品-->
    <CollectTabCard v-show="activeTabProduct === tabs.product.collect" />
  </TabContainer>
</template>

<script setup>
import { onMounted } from 'vue';
// utils
import { tabs, productTabList } from '@/views/designerApp/app/define/tabs';
import { useGlobalTemplateCategory } from '@/hooksFn/useDesignerApplication/core/template/templateCategory';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
// components
import CustomTabCard from './shows/custom';
import CommonTabCard from './shows/common';
import CollectTabCard from './shows/collect';
import TabContainer from '../../components/TabContainer';
import TabsHeader from '../../components/TabsHeader';

// 全局菜单tabs数据
const { activeTabProduct } = useGlobalData();

// 模板分类
const { getList: getCategoryList } = useGlobalTemplateCategory();
onMounted(() => getCategoryList());
</script>

<style scoped lang="less"></style>
