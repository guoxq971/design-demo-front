<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { useDevice } from '@/hooksFn/useDevice';
import { useGlobalTest } from '@/testClass';
useDevice();
useGlobalTest();
const { test, onTest } = useGlobalTest();
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
