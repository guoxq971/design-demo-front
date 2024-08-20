<template>
  <el-button v-bind="$attrs" @click="handleClick">
    <slot />
  </el-button>
</template>

<script>
export default {
  name: 'pl-button',
  props: {},
  methods: {
    elButtonBlur(evt) {
      let target = evt.target;
      if (['SPAN', 'I'].includes(target.nodeName)) {
        target = evt.target.parentNode;
      }
      target.blur();
    },
    handleClick(event) {
      this.elButtonBlur(event);
      this.$emit('click', event);
    },
  },
};
</script>
