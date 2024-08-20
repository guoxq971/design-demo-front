<template>
  <div class="tip-container">
    <span class="icon el-icon-warning"></span>
    <span>请在红色虚线范围内设计，非阴影必须铺满，</span>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
//提示语
.tip-container {
  width: 100%;
  @height: 3.2rem;
  @gap: var(--fn-gap-min);
  position: absolute;
  top: calc((@gap + @height) * -1);
  height: @height;
  background: #ffecec;
  color: #ff5151;
  display: flex;
  align-items: center;
  padding-left: 1.8rem;
  font-size: 1.3rem;
  line-height: 1.6rem;

  .icon {
    color: #ff5b5b;
    font-size: 1.7rem;
    position: relative;
    top: 0.1rem;
    margin-right: 0.4rem;
  }
}
</style>
