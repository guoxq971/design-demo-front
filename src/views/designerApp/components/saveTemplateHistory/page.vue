<!--分页-->
<template>
  <el-pagination
    style="display: flex;justify-content: flex-end;padding-right: 10px;"
    class="page-container"
    :pager-count="5"
    @current-change="onChange"
    @size-change="onChange"
    :current-page.sync="param[numKey]"
    :page-size="param[sizeKey]"
    :total="total"
    layout="prev, pager, next, jumper"
  />
</template>

<script>
export default {
  props: {
    getList: Function,
    sizeKey: { type: String, default: 'pageSize' },
    numKey: { type: String, default: 'pageNum' },
    param: Object,
    total: Number,
  },
  methods: {
    onChange(val) {
      this.getList();
    },
  },
};
</script>

<style scoped lang="less">
.page-container {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
  padding-bottom: 8px;
}
:deep(.el-pager li) {
  min-width: 22.5px;
}
</style>
