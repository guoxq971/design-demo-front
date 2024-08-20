<template>
  <div class="icon-container">
    <div class="el-icon-question"></div>
    <div class="corner"></div>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
//icon
.icon-container {
  @size: 4rem;
  @gap: var(--fn-gap-min);
  position: absolute;
  right: calc((@size + @gap) * -1);
  width: @size;
  height: @size;
  background: #ffffff;
  border-radius: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 0.9;
  }
}
</style>
