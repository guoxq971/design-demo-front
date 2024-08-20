<template>
  <TabsContainer>
    <!--右键菜单-->
    <transition name="el-fade-in-linear">
      <Contextmenu v-if="menuVisible" :item-list="menuList" :visible.sync="menuVisible" />
    </transition>
    <!--hover 通用模板|收藏模板|定制模板-->
    <transition name="el-fade-in-linear">
      <HoverTemplateCard v-if="hoverIsTemplate" />
    </transition>
    <!--hover 定制模板-详情-->
    <transition name="el-fade-in-linear">
      <HoverTemplateCustomCard v-if="hoverIsCustom" />
    </transition>
    <!--hover 图库-->
    <transition name="el-fade-in-linear">
      <HoverImageCard v-if="hoverIsImage" />
    </transition>
    <!--产品-->
    <ProductTabs v-show="activeMenu === menus.product" :activeTab.sync="activeTabProduct" />
    <!--图片-->
    <ImageTabs v-show="activeMenu === menus.image" :activeTab.sync="activeTabImage" />
    <!--背景-->
    <BgTabs v-show="activeMenu === menus.bg" :activeTab.sync="activeTabBg" />
    <!--文字-->
  </TabsContainer>
</template>

<script setup>
// utils
import { menus } from '@/views/designerApp/app/define/menu';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
// components
import TabsContainer from './shows/TabsContainer';
import ProductTabs from './shows/ProductTabs';
import ImageTabs from './shows/ImageTabs';
import BgTabs from './shows/BgTabs';
import HoverTemplateCard from '@/views/designerApp/shows/AppTabs/components/HoverTemplateCard/index.vue';
import HoverImageCard from '@/views/designerApp/shows/AppTabs/components/HoverImageCard/index.vue';
import HoverTemplateCustomCard from '@/views/designerApp/shows/AppTabs/components/HoverTemplateCustomCard/index.vue';
import Contextmenu from '@/views/designerApp/shows/AppTabs/components/Contextmenu/index.vue';

// 全局菜单tabs数据
const { activeMenu, activeTabProduct, activeTabImage, activeTabBg } = useGlobalData();
// 鼠标经过
const { hoverIsTemplate, hoverIsCustom, hoverIsImage } = useHover();
// 右键菜单
const { menuVisible, menuList } = useContextmenu();

// 右键菜单
function useContextmenu() {
  // 右键菜单
  const { contextmenu } = useGlobalData();
  const { visible, list } = contextmenu;
  return {
    menuVisible: visible,
    menuList: list,
  };
}

// 鼠标经过
function useHover() {
  // hover
  const { hover } = useGlobalData();
  const { isTemplate: hoverIsTemplate, isCustom: hoverIsCustom, isImage: hoverIsImage } = hover;
  return {
    hoverIsTemplate,
    hoverIsCustom,
    hoverIsImage,
  };
}
</script>

<style scoped lang="less">
// 选项卡
.tabs {
  width: 32rem;
  height: 100%;
  background-color: #fff;
  border: 1px solid #eee;
}
</style>
