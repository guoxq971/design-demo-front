<template>
  <div>
    <GoodsList />
    <FooterBar />
  </div>
</template>

<script setup>
import GoodsList from './components/GoodsList';
import FooterBar from './components/FooterBar';
import { defineProps } from 'vue';
const props = defineProps({
  list: { type: Array, default: () => [] },
});
</script>

<style scoped lang="less"></style>
