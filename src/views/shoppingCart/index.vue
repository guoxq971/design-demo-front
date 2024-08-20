<template>
  <div class="shopping-cart-container">
    <!--列表-->
    <List v-show="active === tabs.list" />
    <!--一件代发-->
    <OneDelivery v-if="active === tabs.one" />
    <!--装箱发货-->
    <InstallBox v-if="active === tabs.box" />
  </div>
</template>

<script setup>
import List from './shows/List';
import InstallBox from './shows/InstallBox';
import OneDelivery from './shows/OneDelivery';
import { ref } from 'vue';
const tabs = {
  list: '1',
  one: '2',
  box: '3',
};
const active = ref(tabs.list);
</script>

<style scoped lang="less">
.shopping-cart-container {
  width: 140rem;
  height: 100%;
}
</style>
