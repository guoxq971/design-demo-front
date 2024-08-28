<template>
  <div class="corner-wrap">
    <slot></slot>
    <div class="corner"></div>
  </div>
</template>

<script setup></script>

<style scoped lang="less">
// 角标
.corner-wrap {
  position: relative;
  //width: 100%;
  //height: 100%;
}
.corner {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.8rem;
  height: 0.8rem;
  background: #ffc3a4;
  -webkit-clip-path: polygon(100% 0, 0 0, 100% 100%);
  //clip-path: polygon(100% 0, 0 0, 100% 100%);
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}
</style>
