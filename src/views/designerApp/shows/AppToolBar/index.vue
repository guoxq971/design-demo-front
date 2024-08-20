<template>
  <div class="tool-container">
    <el-tooltip placement="bottom" effect="dark" :content="item + ''" v-for="item in 19" :key="item + ''" transition="none">
      <div class="tool-item"></div>
    </el-tooltip>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
.tool-container {
  //width: fit-content;
  width: 100%;
  padding: var(--fn-gap-min) var(--fn-gap);
  background: #ffffff;
  border-radius: 0.4rem;
  border: 1px solid #eeeeee;
  display: flex;
  justify-content: center;
  align-items: center;
  .tool-item {
    width: 2.8rem;
    height: 2.8rem;
    border: 1px solid #eee;
    margin-right: var(--fn-gap);
    border-radius: 0.4rem;
    background: #f7f8f9;
    cursor: pointer;
    &:hover {
      border-color: var(--fn-primary-color);
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
