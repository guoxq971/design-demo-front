<template>
  <div class="save-wrap">
    <Btn type="primary">保存产品</Btn>
    <Btn type="blue">保存产品</Btn>
  </div>
</template>

<script setup>
import Btn from '@/views/designerApp/components/Btn.vue';
</script>

<style scoped lang="less">
// 保存
.save-wrap {
  background-color: #fff;
  box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5), 0px -1px 0px 0px #eeeeee;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: calc(var(--fn-gap-min) * 1.5) 0;
  margin-bottom: var(--fn-gap-min);
}
</style>
