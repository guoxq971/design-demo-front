<template>
  <div class="tabs">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
// 选项卡
.tabs {
  width: 32rem;
  height: 100%;
  background-color: #fff;
  border: 1px solid #eee;
  position: relative;
}
</style>
