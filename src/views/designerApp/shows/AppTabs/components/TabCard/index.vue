<template>
  <div class="tab">
    <div class="body">
      <!--条件-->
      <div class="condition">
        <template v-if="customCondition">
          <slot name="condition"></slot>
        </template>
        <template v-else>
          <!--搜索-->
          <SearchCard v-model="searchValue" :placeholder="placeholder" :getList="onSearch" :loading="loading" />
          <!--分类-->
          <el-cascader
            v-if="showCategory"
            expandTrigger="hover"
            popper-class="pc-sel-area-cascader"
            class="select-item"
            filterable
            placeholder="分类"
            v-model="category.selected"
            :options="categoryList"
            :props="{ checkStrictly: true }"
            @change="getListByCategory"
            clearable
          />
        </template>
      </div>
      <!--列表-->
      <ListCard @itemClick="(item) => emit('itemClick', item)" :list="list" v-loading="loading" :customItem="customItem" :contextmenu="contextmenu">
        <template v-if="customItem" #item="{ row }">
          <slot name="item" :row="row" />
        </template>
      </ListCard>
    </div>
    <!--分页-->
    <div class="pagination" v-if="showPagination">
      <PaginationCard :page-num.sync="params.pageNum" :page-size.sync="params.pageSize" :total="total" :getList="getList" />
    </div>
  </div>
</template>

<script setup>
import PaginationCard from './PaginationCard.vue';
import ListCard from './ListCard.vue';
import SearchCard from './SearchCard.vue';
import { ref, defineProps, defineEmits, onMounted, computed } from 'vue';
import { useVModels } from '@vueuse/core';

const emit = defineEmits(['getList', 'itemClick']);
const props = defineProps({
  placeholder: { type: String, default: '请输入' },
  list: { type: Array, default: () => [] },
  total: [Number, String],
  loading: [Boolean],
  // 是否右键菜单
  contextmenu: { type: [Boolean, String], default: false },
  // 自定义列表item
  customItem: { type: [Boolean, String], default: false },
  // 自定义条件区域
  customCondition: { type: Boolean, default: false },
  // 展示分类
  showCategory: { type: Boolean, default: true },
  // 分类列表
  categoryList: { type: Array, default: () => [] },
  // 参数
  params: { type: Object, default: () => ({ pageNum: 1, pageSize: 3 * 6 }) },
  // 搜索
  searchValue: [String],
  // 是否分页
  showPagination: { type: Boolean, default: true },
});
const { params, searchValue } = useVModels(props);

// 搜索
const getList = () => emit('getList');
onMounted(() => getList());
function onSearch() {
  params.value.pageNum = 1;
  getList();
}

// 分类
const category = ref({
  selected: [],
  // options: [],
});
const getListByCategory = () => {
  params.value.pageNum = 1;
  let category1 = '';
  let category2 = '';
  if (category.value.selected[0]) category1 = category.value.selected[0];
  if (category.value.selected[1]) category2 = category.value.selected[1];
  params.value.category1 = category1;
  params.value.category2 = category2;
  onSearch();
};
</script>

<style lang="less">
// 分类-级联高度
.pc-sel-area-cascader {
  .el-cascader-menu__wrap {
    height: 350px !important;
  }
}
</style>
<style scoped lang="less">
// 选项卡
.tab {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .body {
    flex: 1;
    padding: var(--fn-gap-min);
    display: flex;
    flex-direction: column;
    // 条件
    .condition {
      margin-bottom: var(--fn-gap);
      display: flex;
      flex-direction: column;
      .select-item {
        margin-top: var(--fn-gap-min);
        :deep(.el-input__inner) {
          height: 3.6rem;
        }
      }
    }
  }
  // 分页
  .pagination {
    height: 6rem;
    border-top: 1px solid #eee;
    display: flex;
    align-items: center;
    padding: 0 var(--fn-gap-min) 0 0;
  }
}
</style>
