<template>
  <TabContainer>
    <TabsHeader :active-tab.sync="activeTab" :list="imageTabList" />

    <!--我的图库-->
    <MyTabCard v-show="activeTab === tabs.image.my" />
    <!--平台图库-->
    <PlatformTabCard v-show="activeTab === tabs.image.platform" />
    <!--收藏图库-->
    <CollectTabCard v-show="activeTab === tabs.image.collect" />
  </TabContainer>
</template>

<script setup>
import MyTabCard from './shows/my';
import PlatformTabCard from './shows/platform';
import CollectTabCard from './shows/collect';
import TabContainer from '../../components/TabContainer';
import TabsHeader from '../../components/TabsHeader';
import { tabs, imageTabList } from '@/views/designerApp/app/define/tabs';
import { useVModels } from '@vueuse/core';

const emit = defineEmits([]);
const props = defineProps({ activeTab: [String, Number] });
const { activeTab } = useVModels(props);
</script>

<style scoped lang="less"></style>
