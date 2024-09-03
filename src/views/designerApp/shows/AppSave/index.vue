<template>
  <div class="save-wrap">
    <el-button :loading="saveLoading" plain class="btn btn-1" @click="(e) => onSave(e, useDesignerAppConfig().save_template_type_color)">全颜色合成</el-button>
    <el-button :loading="saveLoading" class="btn btn-2" type="primary" @click="(e) => onSave(e, useDesignerAppConfig().save_template_type_org)">保存模板</el-button>
    <el-button :loading="saveLoading" class="btn btn-3" type="primary" @click="(e) => onSave(e, useDesignerAppConfig().save_template_type_save)">保存产品</el-button>
  </div>
</template>

<script setup>
import Btn from '@/views/designerApp/components/Btn.vue';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
const { saveLoading } = useDesignerApplication();
function onSave(event, type) {
  let target = event.target;
  if (['SPAN', 'I'].includes(target.nodeName)) {
    target = event.target.parentNode;
  }
  target.blur();
  useDesignerApplication().saveTemplate(type);
}
</script>

<style scoped lang="less">
// 保存
.save-wrap {
  background-color: #fff;
  box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5), 0px -1px 0px 0px #eeeeee;
  //padding: calc(var(--fn-gap-min) * 1.5) 0;
  margin-bottom: var(--fn-gap-min);
  padding: var(--fn-gap);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn {
  position: relative;
  margin-left: 0;
  :deep(.el-icon-loading) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  :deep(span) {
    margin: 0 !important;
  }
}
.btn-1 {
  width: 10.8rem;
  color: var(--fn-primary-color);
  border-color: var(--fn-primary-color);
  &:hover {
    opacity: 0.8;
  }
}
.btn-2 {
  width: 9.4rem;
  border-color: var(--fn-blue-color);
  background-color: var(--fn-blue-color);
  &:hover {
    opacity: 0.8;
  }
}
.btn-3 {
  width: 9.4rem;
}
</style>
