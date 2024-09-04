<!--查看详情-->
<template>
  <el-dialog :title="title" v-drag visible :close-on-click-modal="false" width="77%" top="5vh" @close="onClose">
    <el-row class="dialog-bd">
      <fnTabs :template-id="templateId" :showWeight="false" />
    </el-row>
  </el-dialog>
</template>

<script setup>
import fnTabs from './components/tabs.vue';
import { TemplateDescType } from './util';
import { ref, defineEmits, defineProps } from 'vue';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

const emit = defineEmits(['update:show', 'success']);
const onClose = () => emit('update:show', false);
const props = defineProps({
  // 开关
  show: { type: Boolean, default: false },
  seqId: { type: String, default: '' },
});

const $app = useDesignerApplication();

const templateId = ref($app.activeTemplate.value.detail.seqId);
const activeName = ref('1');
// 表格数据
const list = ref([]);
//加载状态
const loading = ref(false);
//标题
const title = ref($app.activeTemplate.value.detail.name);
//当前场景 add=新增 edit=编辑 detail=详情
const type = ref('detail');
//接口获取的detail
const detail = ref(new TemplateDescType());
</script>

<style lang="less" scoped>
:deep(.el-tabs__nav) {
  width: 100%;
}

//input输入框的disable状态
:deep(.el-input.is-disabled .el-input__inner) {
  color: #000;
}
:deep(.el-dialog__body) {
  padding: 10px 20px 30px 20px;
}
</style>
