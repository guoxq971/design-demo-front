<template>
  <div class="tab-container">
    <slot></slot>
  </div>
</template>
<script setup></script>

<style scoped lang="less">
// 选项卡
.tab-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
