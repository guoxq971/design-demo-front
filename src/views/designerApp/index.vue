<template>
  <div class="app-container">
    <div class="left">
      <AppMenu />
      <AppTabs />
    </div>
    <div class="center">
      <!--工具条-->
      <AppToolBar />
      <!--画布-->
      <AppCanvas />
    </div>
    <div class="right">
      <!--保存-->
      <AppSave />

      <!--模板设计信息-->
      <AppTemplateDesign />
    </div>
  </div>
</template>

<script setup>
import { onKeyStroke } from '@vueuse/core';
// utils
import { Message } from 'element-ui';
import { useDesignerApp, useProvideApp } from '@/hooksFn/useDesignerApp';
// components
import AppTemplateDesign from '@/views/designerApp/shows/AppTemplateDesign';
import AppSave from '@/views/designerApp/shows/AppSave';
import AppCanvas from '@/views/designerApp/shows/AppCanvas';
import AppToolBar from '@/views/designerApp/shows/AppToolBar';
import AppMenu from '@/views/designerApp/shows/AppMenu';
import AppTabs from '@/views/designerApp/shows/AppTabs';

// 初始化
const designerApp = useDesignerApp();
useProvideApp(designerApp);

// 测试键盘事件
onKeyStroke('ArrowDown', () => {
  Message.success('ArrowDown');
});
</script>

<style scoped lang="less">
.app-container {
  position: relative;
  top: 6rem;
  width: 100vw;
  height: calc(100vh - 6rem);
  display: flex;
  justify-content: space-between;
  background-color: #f2f2f2;
  padding-top: var(--fn-gap-min);
  .left {
    display: flex;
  }
  .center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 var(--fn-gap-min);
  }
  .right {
    width: 38rem;
    display: flex;
    flex-direction: column;
    padding-right: var(--fn-gap-min);
  }
}
</style>
