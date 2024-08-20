<template>
  <TabContainer>
    <TabsHeader :active-tab.sync="activeTab" :list="bgTabList" />

    <!--背景图-->
    <BgImageTabCard v-show="activeTab === tabs.bg.image" />
    <!--背景色-->
    <BgColorTabCard v-show="activeTab === tabs.bg.color" />
    <!--收藏背景-->
    <CollectBgImageTabCard v-show="activeTab === tabs.bg.collect" />
  </TabContainer>
</template>

<script setup>
import { useVModels } from '@vueuse/core';
// utils
import { bgTabList, tabs } from '@/views/designerApp/app/define/tabs';
// components
import BgImageTabCard from './shows/BgImageTabCard';
import BgColorTabCard from './shows/BgColorTabCard';
import CollectBgImageTabCard from './shows/CollectBgImageTabCard';
import TabContainer from '../../components/TabContainer';
import TabsHeader from '@/views/designerApp/shows/AppTabs/components/TabsHeader/index.vue';

const emit = defineEmits([]);
const props = defineProps({
  activeTab: [String, Number],
});
const { activeTab } = useVModels(props);
</script>

<style scoped lang="less"></style>
