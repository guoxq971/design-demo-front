<template>
  <TabContainer>
    <TabsHeader :active-tab.sync="activeTab" :list="textTabList" />

    <!--文字-->
    <TextTabCard v-show="activeTab === tabs.text.text" />
  </TabContainer>
</template>

<script setup>
import { useVModels } from '@vueuse/core';
// utils
import { textTabList, tabs } from '@/views/designerApp/app/define/tabs';
// components
import TextTabCard from './shows/TextTabCard';
import TabContainer from '../../components/TabContainer';
import TabsHeader from '@/views/designerApp/shows/AppTabs/components/TabsHeader/index.vue';

const emit = defineEmits([]);
const props = defineProps({
  activeTab: [String, Number],
});
const { activeTab } = useVModels(props);
</script>

<style scoped lang="less"></style>
