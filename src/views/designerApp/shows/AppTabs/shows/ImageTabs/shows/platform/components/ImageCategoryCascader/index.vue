<template>
  <el-cascader
    expandTrigger="hover"
    ref="cascaderShareRef"
    filterable
    clearable
    popper-class="pc-sel-area-cascader"
    :props="share"
    placeholder="分类"
    v-model="shareValue"
    @change="(e) => share_change(e)"
  />
</template>

<script setup>
import { computed, defineProps, defineEmits, ref } from 'vue';
import { GRequest, METHOD } from '@/utils/request';
const emit = defineEmits(['update:one', 'update:two']);
const props = defineProps({
  onSearch: { type: Function, default: () => {} },
  one: { type: String, default: '' },
  two: { type: String, default: '' },
});
const shareValue = computed({
  get: () => {
    let result = [];
    if (props.one && props.two) {
      result = [props.one, props.two];
    } else if (props.one && !props.two) {
      result = [props.one];
    } else {
      result = [''];
    }
    // console.log('get', result);
    return result;
  },
  set: (val) => {
    // console.log('set', val);
    if (val.length === 1) {
      if (val[0] === '') {
        emit('update:one', '');
        emit('update:two', '');
        return;
      }
      emit('update:one', val[0]);
      emit('update:two', '');
    } else if (val.length === 2) {
      emit('update:one', val[0]);
      emit('update:two', val[1]);
    } else {
      emit('update:one', '');
      emit('update:two', '');
    }
  },
});

const cascaderShareRef = ref(null);
// const shareValue = ref([]);
const share = ref({
  lazy: true,
  lazyLoad: getSelectList,
  checkStrictly: true,
});

/*
 * 分类-change
 * */
async function share_change(e) {
  // change事件调用二级分类接口
  const store = cascaderShareRef.value.$refs.panel.store;
  let i = store.nodes.findIndex((node) => node.value == e[0]);
  let d = store.nodes[i];
  let el = cascaderShareRef.value.$refs.panel.$refs.menu[d.level - 1].$el;
  el.querySelectorAll('.el-cascader-node__label')[i].click();

  // 分页
  props.onSearch();
}

/**
 * 获取分类的下拉列表
 * */
async function getSelectList(node, resolve) {
  const { level } = node;
  // 一级
  if (level === 0) {
    const res = await GRequest(`/base-web/CMDesignImageTypeAct/getPlatformListByParentCode.act?parentId=0`, METHOD.GET);
    if (res.data.retState !== '0') return;
    const list = res.data.cmDesignImageTypes;
    let tempList = [];
    tempList = list.map((item) => {
      return {
        label: item.name,
        value: item.seqId,
        leaf: false,
      };
    });
    tempList.unshift({ label: '全部分类', value: '', leaf: true });
    resolve(tempList);
  }
  // 二级
  else if (level === 1) {
    const res = await GRequest(`/base-web/CMDesignImageTypeAct/getPlatformListByParentCode.act`, METHOD.GET, { parentId: node.value });
    if (res.data.retState !== '0') return;
    const list = res.data.cmDesignImageTypes;
    let tempList = list.map((item) => {
      return {
        label: item.name,
        value: item.seqId,
        leaf: true,
      };
    });
    resolve(tempList);
  } else {
    resolve([]);
  }
}
</script>

<style scoped lang="less"></style>
