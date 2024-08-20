<template>
  <div class="body">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
.body {
  flex: 1;
  padding: var(--fn-gap-min);
  display: flex;
  flex-direction: column;
}
</style>
