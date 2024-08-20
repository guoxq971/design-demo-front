<template>
  <div class="menu">
    <div class="menu-item" :class="{ active: activeMenu === item.value }" v-for="item in menuList" :key="item.value" @click="onMenu(item)">
      <div class="menu-item-icon">
        <Component :is="item.icon" />
      </div>
      <div class="menu-item-label">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup>
// utils
import { menuList } from '@/views/designerApp/app/define/menu';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';

const { activeMenu } = useGlobalData();
const onMenu = (item) => (activeMenu.value = item.value);
</script>

<style scoped lang="less">
// 导航菜单
.menu {
  @size: 12rem;
  @hoverColor: var(--fn-primary-color-hover2);

  width: @size;
  background: #f7f8f9;

  .menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: @size;
    height: @size;
    background-color: #fff;
    position: relative;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      width: 0.3rem;
      height: 100%;
      background: var(--fn-primary-color);
      display: none;
    }
    &:hover {
      background-color: @hoverColor;
      color: var(--fn-primary-color);
    }
    .menu-item-icon {
    }
    .menu-item-label {
    }
  }
  .active {
    background-color: @hoverColor;
    color: var(--fn-primary-color);
    &::before {
      display: block;
    }
  }
}
</style>
