<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { useDevice } from '@/hooksFn/useDevice';
useDevice();
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
