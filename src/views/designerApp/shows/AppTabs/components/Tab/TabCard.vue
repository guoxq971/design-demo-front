<template>
  <div class="tab">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
// 选项卡
.tab {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
