<template>
  <div class="tool-container">
    <!--复用组件-->
    <DefineSvgTemplate v-slot="{ disabledContent, content, component, type, fn, children, disabled }">
      <template v-if="type === 'shu'">
        <div class="shu">|</div>
      </template>
      <el-tooltip v-else placement="bottom" effect="dark" transition="none">
        <template #content>
          <span>{{ disabled?.value ? disabledContent : content }}</span>
        </template>
        <template v-if="children?.length">
          <el-dropdown :disabled="!children?.length" placement="bottom" :hide-on-click="false">
            <conrner>
              <div class="tool-item" @click="fn">
                <component :is="component" />
              </div>
            </conrner>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in children" :key="item.content" @click.native="item.fn">
                <span style="user-select: none">{{ item.content }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template v-else>
          <el-tooltip placement="bottom" effect="dark" transition="none" :disabled="!disabled?.value">
            <template #content>
              <span>{{ disabled?.value ? disabledContent : content }}</span>
            </template>
            <div class="tool-item" @click="() => (disabled?.value ? '' : fn())" :class="{ disabled: disabled?.value }">
              <component :is="component" />
            </div>
          </el-tooltip>
        </template>
      </el-tooltip>
    </DefineSvgTemplate>

    <!--工具条-->
    <ReuseSvgTemplate
      v-for="item in list"
      :key="item.content"
      :content="item.content"
      :component="item.component"
      :type="item.type"
      :fn="item.fn"
      :children="item.children"
      :disabled="item.disabled"
      :disabledContent="item.disabledContent"
    />
  </div>
</template>

<script setup>
import { createReusableTemplate } from '@vueuse/core';
// components
import conrner from '@/views/designerApp/components/conrner.vue';
import undoSvg from '@/views/designerApp/components/svg/undoSvg.vue';
import historySvg from '@/views/designerApp/components/svg/historySvg.vue';
import redoSvg from '@/views/designerApp/components/svg/redoSvg.vue';
import clearSvg from '@/views/designerApp/components/svg/clearSvg.vue';
import centerSvg from '@/views/designerApp/components/svg/centerSvg.vue';
import maxSvg from '@/views/designerApp/components/svg/maxSvg.vue';
import layerUpSvg from '@/views/designerApp/components/svg/layerUpSvg.vue';
import layerDownSvg from '@/views/designerApp/components/svg/layerDownSvg.vue';
import layerTopSvg from '@/views/designerApp/components/svg/layerTopSvg.vue';
import layerBottomSvg from '@/views/designerApp/components/svg/layerBottomSvg.vue';
import copySvg from '@/views/designerApp/components/svg/copySvg.vue';
import deleteSvg from '@/views/designerApp/components/svg/deleteSvg.vue';
import mirrorXSvg from '@/views/designerApp/components/svg/mirrorXSvg.vue';
import mirrorYSvg from '@/views/designerApp/components/svg/mirrorYSvg.vue';
import centerXSvg from '@/views/designerApp/components/svg/centerXSvg.vue';
import centerYSvg from '@/views/designerApp/components/svg/centerYSvg.vue';
import scaleUpSvg from '@/views/designerApp/components/svg/scaleUpSvg.vue';
import scaleDownSvg from '@/views/designerApp/components/svg/scaleDownSvg.vue';
import rotationSvg from '@/views/designerApp/components/svg/rotationSvg.vue';
import tileSvg from '@/views/designerApp/components/svg/tileSvg.vue';
import hotkeySvg from '@/views/designerApp/components/svg/hotkeySvg.vue';
import settingSvg from '@/views/designerApp/components/svg/settingSvg.vue';
import saveSvg from '@/views/designerApp/components/svg/saveSvg.vue';
import exportSvg from '@/views/designerApp/components/svg/exportSvg.vue';
// utils
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { computed } from 'vue';
import { Message } from 'element-ui';

const [DefineSvgTemplate, ReuseSvgTemplate] = createReusableTemplate();

const exportConfigDisabled = computed(() => {
  return useDesignerApplication().activeTemplate.value?.exportConfig.length === 0;
});
const activeTemplate = useDesignerApplication().activeTemplate;
const activeView = useDesignerApplication().activeView;
const activeDesign = useDesignerApplication().activeDesign;
const list = [
  { content: '上一步', component: undoSvg, fn: () => Message.warning('上一步') },
  { content: '下一步', component: redoSvg, fn: () => Message.warning('下一步') },
  {
    content: '清空',
    component: clearSvg,
    fn: () => activeView.value?.clearDesign(),
    children: [
      { content: '清空当前视图', component: maxSvg, fn: () => activeView.value?.clearDesign() },
      { content: '清空全部视图', component: maxSvg, fn: () => activeTemplate.value?.viewList.forEach((v) => v.clearDesign()) },
    ],
  },
  { type: 'shu' },
  {
    content: '居中',
    component: centerSvg,
    fn: () => activeDesign.value?.center(),
    children: [
      { content: '水平居中', component: centerSvg, fn: () => activeDesign.value?.centerX() },
      { content: '垂直居中', component: centerSvg, fn: () => activeDesign.value?.centerY() },
    ],
  },
  {
    content: '最大化',
    component: maxSvg,
    fn: () => activeDesign.value?.max(useDesignerAppConfig().design_max_type_width),
    children: [
      { content: '宽度最大化', component: maxSvg, fn: () => activeDesign.value?.max(useDesignerAppConfig().design_max_type_width) },
      { content: '高度最大化', component: maxSvg, fn: () => activeDesign.value?.max(useDesignerAppConfig().design_max_type_height) },
    ],
  },
  { content: '上移一层', component: layerUpSvg, fn: () => activeDesign.value?.moveUp() },
  { content: '下移一层', component: layerDownSvg, fn: () => activeDesign.value?.moveDown() },
  { content: '置顶', component: layerTopSvg, fn: () => activeDesign.value?.moveToTop() },
  { content: '置底', component: layerBottomSvg, fn: () => activeDesign.value?.moveToBottom() },
  { content: '复制', component: copySvg, fn: () => activeDesign.value?.copy() },
  { content: '删除', component: deleteSvg, fn: () => activeDesign.value?.remove() },
  { content: '水平翻转', component: mirrorXSvg, fn: () => activeDesign.value?.flipX() },
  { content: '垂直翻转', component: mirrorYSvg, fn: () => activeDesign.value?.flipY() },
  { content: '水平居中', component: centerXSvg, fn: () => activeDesign.value?.centerX() },
  { content: '垂直居中', component: centerYSvg, fn: () => activeDesign.value?.centerY() },
  { content: '放大', component: scaleUpSvg, fn: () => activeDesign.value?.scaleUp() },
  { content: '缩小', component: scaleDownSvg, fn: () => activeDesign.value?.scaleDown() },
  {
    content: '旋转',
    component: rotationSvg,
    fn: () => activeDesign.value?.rotationRight(),
    children: [
      { content: '左旋转5°', component: maxSvg, fn: () => activeDesign.value?.rotationLeft() },
      { content: '右旋转5°', component: maxSvg, fn: () => activeDesign.value?.rotationRight() },
      { content: '旋转重置', component: maxSvg, fn: () => activeDesign.value?.rotationReset() },
    ],
  },
  { content: '平铺', component: tileSvg, fn: () => Message.warning('平铺') },
  { content: '快捷键', component: hotkeySvg, fn: () => Message.warning('快捷键') },
  { content: '设置', component: settingSvg, fn: () => Message.warning('设置') },
  // { content: '保存', component: saveSvg, fn: () => {} },
  {
    content: '导出',
    disabledContent: '该模板不支持导出',
    component: exportSvg,
    fn: () => {
      useDesignerApplication().exportDialogVisible.value = !useDesignerApplication().exportDialogVisible.value;
    },
    disabled: exportConfigDisabled,
  },
  {
    content: '保存产品历史记录',
    component: historySvg,
    fn: () => useGlobalDesigner().templateHistory.trigger(),
    // children: [
    //   { content: '保存产品记录', component: saveSvg, fn: () => useGlobalDesigner().templateHistory.trigger() },
    //   { content: '设计操作记录', component: saveSvg, fn: () => {} },
    // ],
  },
];
</script>

<style scoped lang="less">
.tool-container {
  //width: fit-content;
  width: 100%;
  padding: var(--fn-gap-min) var(--fn-gap);
  background: #ffffff;
  border-radius: 0.4rem;
  border: 1px solid #eeeeee;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--fn-gap);
  .shu {
    //margin-right: var(--fn-gap);
  }
  .tool-item {
    width: 2.6rem;
    height: 2.6rem;
    border: 1px solid #f3f4f6;
    //margin-right: var(--fn-gap);
    border-radius: 0.4rem;
    background: #f7f8f9;
    cursor: pointer;
    color: #7e7e7e;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      border-color: var(--fn-primary-color);
      color: var(--fn-primary-color);
    }
    &:last-child {
      margin-right: 0;
    }
  }

  .disabled {
    cursor: not-allowed;
    color: #ccc;
    border-color: #ccc;
    //pointer-events: none;
    &:hover {
      border-color: #ccc;
      color: #ccc;
    }
  }
}
</style>
