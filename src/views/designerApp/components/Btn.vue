<template>
  <div class="btn" :class="{ primary: isPrimary, blue: isBlue }">
    <span v-if="icon" :class="[icon]"></span>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  type: { type: String, default: '' },
  notMargin: { type: Boolean, default: false },
  icon: { type: String, default: '' },
});
const margin = props.notMargin ? '0' : 'var(--fn-gap-min)';
const isPrimary = props.type === 'primary';
const isBlue = props.type === 'blue';
</script>

<style scoped lang="less">
.btn {
  width: 16rem;
  height: 4rem;
  font-size: 1.4rem;
  color: #ffffff;
  line-height: 1.9rem;
  border-radius: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: v-bind(margin);
  &:first-child {
    margin-left: 0;
  }
  &:hover {
    opacity: 0.9;
  }
}
.primary {
  background-color: var(--fn-primary-color);
}
.blue {
  background-color: var(--fn-blue-color);
}
</style>
