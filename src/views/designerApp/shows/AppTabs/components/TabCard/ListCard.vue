<template>
  <div class="list">
    <div class="item-group fn-full">
      <div
        class="item-box mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
        v-for="item in list"
        :key="item.seqId"
        @mouseenter="mouseenter(item)"
        @mouseleave="mouseleave(item)"
        @contextmenu="(e) => onContextmenu(e, item)"
        @click="emit('itemClick', item)"
        :class="{ active: false }"
      >
        <template v-if="customItem">
          <slot name="item" :row="item"></slot>
        </template>
        <ImgTrack v-else :url1="AppUtil.getShowImage(item).image" :url2="AppUtil.getShowImage(item).texture" />
      </div>
      <el-empty class="fn-full" v-if="!list.length" :image-size="50"></el-empty>
    </div>
  </div>
</template>

<script setup>
import ImgTrack from '@/components/imgTrack/index.vue';
import { computed, defineProps, defineEmits } from 'vue';
import { useInjectApp } from '@/hooksFn/useDesignerApp';
import { hovers } from '@/hooksFn/useDesignerApp/core/service/common/hoverService';

const emit = defineEmits(['itemClick']);
const props = defineProps({
  list: [Array],
  // 是否自定义展示item
  customItem: { type: [Boolean, String], default: false },
  // 是否右键菜单
  contextmenu: { type: [Boolean, String], default: false },
});
const { service, AppUtil } = useInjectApp();

// 右键菜单
function onContextmenu(e, item) {
  service.template.contextmenu.onContextmenu(e, item, props.contextmenu);
}

// hover
const hoverType = computed(() => (!props.customItem ? hovers.template : props.customItem));
const hover = service.template.hover;
const mouseenter = (item = null) => hover.enter(item, hoverType.value);
const mouseleave = (item = null) => hover.leave();
</script>

<style scoped lang="less">
// 列表
.list {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  position: relative;
  .item-group {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    align-content: flex-start;
    .item-box {
      box-sizing: border-box;
      box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
      border: 1px solid #eeeeee;
      width: 9.5rem;
      height: 9.5rem;
      margin-right: var(--fn-gap-min);
      margin-bottom: var(--fn-gap-min);
      cursor: pointer;
      &:nth-child(3n) {
        margin-right: 0;
      }

      &:hover {
        border-color: var(--fn-primary-color);
      }
    }
  }

  .active {
    border-color: var(--fn-primary-color);
  }
}
</style>
