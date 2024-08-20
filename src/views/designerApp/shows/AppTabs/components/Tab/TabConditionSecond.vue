<template>
  <div class="condition-2">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
.condition-2 {
  margin-top: var(--fn-gap-min);
  display: flex;
  gap: 0.4rem;

  .icon-btn,
  :deep(.el-input__inner) {
    height: 3.2rem;
  }
  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}
</style>
