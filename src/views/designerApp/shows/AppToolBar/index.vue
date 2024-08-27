<template>
  <div class="tool-container">
    <DefineSvgTemplate v-slot="{ content, component, type, fn }">
      <template v-if="type === 'shu'">
        <div class="shu">|</div>
      </template>
      <el-tooltip v-else placement="bottom" effect="dark" :content="content" transition="none">
        <div class="tool-item" @click="fn">
          <component :is="component" />
        </div>
      </el-tooltip>
    </DefineSvgTemplate>

    <ReuseSvgTemplate v-for="item in list" :key="item.content" :content="item.content" :component="item.component" :type="item.type" :fn="item.fn" />
  </div>
</template>

<script setup>
import { createReusableTemplate } from '@vueuse/core';
// components
import undoSvg from '@/views/designerApp/components/svg/undoSvg.vue';
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
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';

const [DefineSvgTemplate, ReuseSvgTemplate] = createReusableTemplate();

const app = useGlobalDesigner().app.tool();
const list = [
  { content: '上一步', component: undoSvg, fn: () => {} },
  { content: '下一步', component: redoSvg, fn: () => {} },
  { content: '清空', component: clearSvg, fn: () => app.clearView() },
  { type: 'shu' },
  { content: '居中', component: centerSvg, fn: () => app.centerXY() },
  { content: '最大化', component: maxSvg, fn: () => app.max() },
  { content: '上移一层', component: layerUpSvg, fn: () => app.upDesign() },
  { content: '下移一层', component: layerDownSvg, fn: () => app.downDesign() },
  { content: '置顶', component: layerTopSvg, fn: () => app.topDesign() },
  { content: '置底', component: layerBottomSvg, fn: () => app.bottomDesign() },
  { content: '复制', component: copySvg, fn: () => {} },
  { content: '删除', component: deleteSvg, fn: () => app.delDesign() },
  { content: '水平翻转', component: mirrorXSvg, fn: () => app.flipX() },
  { content: '垂直翻转', component: mirrorYSvg, fn: () => app.flipY() },
  { content: '水平居中', component: centerXSvg, fn: () => app.centerX() },
  { content: '垂直居中', component: centerYSvg, fn: () => app.centerY() },
  { content: '放大', component: scaleUpSvg, fn: () => app.scaleUp() },
  { content: '缩小', component: scaleDownSvg, fn: () => app.scaleDown() },
  { content: '旋转', component: rotationSvg, fn: () => app.rotationRight() },
  { content: '平铺', component: tileSvg, fn: () => {} },
  { content: '快捷键', component: hotkeySvg, fn: () => {} },
  { content: '设置', component: settingSvg, fn: () => {} },
  { content: '保存', component: saveSvg, fn: () => {} },
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
  .shu {
    margin-right: var(--fn-gap);
  }
  .tool-item {
    width: 2.8rem;
    height: 2.8rem;
    border: 1px solid #eee;
    margin-right: var(--fn-gap);
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
}
</style>
