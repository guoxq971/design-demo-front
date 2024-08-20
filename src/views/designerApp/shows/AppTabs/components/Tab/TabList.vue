<template>
  <div class="list">
    <div class="item-group fn-full">
      <div
        class="item-box"
        v-for="item in list"
        :key="item[rowKey]"
        @mouseenter="(e) => onMouseenter(e, item)"
        @mouseleave="(e) => onMouseleave(e, item)"
        @contextmenu="(e) => onContextmenu(e, item)"
        @click="() => onClick(item)"
        :class="{ active: isActive(item) }"
      >
        <slot :row="item"></slot>
      </div>
      <el-empty class="fn-full" v-if="!list.length" :image-size="50"></el-empty>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const emit = defineEmits([
  //
  'onClick',
  'onContextmenu',
  'onMouseenter',
  'onMouseleave',
]);
const props = defineProps({
  // 列表
  list: [Array],
  // key
  rowKey: { type: String, default: 'seqId' },
  // 激活项
  active: { type: Function, default: () => false },
});
const isActive = computed(() => (item) => props.active(item));
const onMouseenter = (e, item) => emit('onMouseenter', e, item);
const onMouseleave = (e, item) => emit('onMouseleave', e, item);
const onContextmenu = (e, item) => emit('onContextmenu', e, item);
const onClick = (item) => emit('onClick', item);
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
      user-select: none;
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
    border-color: var(--fn-primary-color) !important;
  }
}
</style>
