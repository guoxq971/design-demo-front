<!--右键菜单-->
<template>
  <el-menu v-show="visible" class="contextmenu" :style="style">
    <el-menu-item :key="item.key" v-for="item in itemList" @click.native="handleClick(item)">
      <el-icon v-if="item.icon" :class="item.icon" class="icon" />
      <span>{{ item.text }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Contextmenu',
  components: {},
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * @param {{ key: string, icon: string, text: string, fnFront:null|function }[]} itemList
     */
    itemList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      left: 0,
      top: 0,
      target: null,
      meta: null,
    };
  },
  computed: {
    style() {
      return {
        left: this.left + 'px',
        top: this.top + 'px',
      };
    },
  },
  created() {
    window.addEventListener('click', this.closeMenu);
    window.addEventListener('contextmenu', this.setPosition);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.closeMenu);
    window.removeEventListener('contextmenu', this.setPosition);
  },
  methods: {
    closeMenu() {
      this.$emit('update:visible', false);
    },
    setPosition(e) {
      this.left = e.clientX;
      this.top = e.clientY;
      this.target = e.target;
      this.meta = e.meta;
    },
    handleClick(item) {
      item.fn && item.fn();
      this.closeMenu();
    },
  },
};
</script>

<style lang="less" scoped>
:deep(.el-menu-item) {
  &:hover {
    color: var(--fn-primary-color) !important;
    .icon {
      color: var(--fn-primary-color);
    }
  }
}
.contextmenu {
  position: fixed;
  z-index: 1000;
  border-radius: 4px;
  box-shadow: -4px 4px 16px 1px rgba(0, 0, 0, 0.15) !important;
  width: fit-content !important;
}
.el-menu-item {
  margin: 0 !important;
  height: 38px;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  padding: 0 10px !important;
  min-width: 110px;
  > span {
    flex: 1;
    text-align: center;
  }
}
</style>
