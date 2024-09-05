<template>
  <el-popover placement="right" width="240px" trigger="hover" popper-class="icon-popover">
    <!--    <DefinePsdTemplate>-->
    <!--      <template v-if="!isPsd">-->
    <!--        <template v-if="detail.psdVersion">-->
    <!--          <el-popover popper-class="prod-popover" placement="right-start" width="450" trigger="manual">-->
    <!--            <el-table :data="detail.designLogs">-->
    <!--              <el-table-column :resizable="false" label="版本号" prop="version" align="center" />-->
    <!--              <el-table-column :resizable="false" label="更新时间" prop="createTime" align="center" />-->
    <!--              <el-table-column :resizable="false" label="备注" prop="remark" align="center" />-->
    <!--            </el-table>-->

    <!--            <el-button style="padding: 0;" type="text" slot="reference">-->
    <!--              {{ detail.psdVersion }}-->
    <!--            </el-button>-->
    <!--          </el-popover>-->
    <!--          <br />-->
    <!--        </template>-->
    <!--        <el-button class="btn primary" style="width: 100%;" type="primary" size="mini" @click="handlerDown">-->
    <!--          下载psd-->
    <!--        </el-button>-->
    <!--      </template>-->
    <!--      <span v-else>{{ psd }}</span>-->
    <!--    </DefinePsdTemplate>-->

    <div>
      <div class="fn-mb-gap-min">推荐设计像素宽高: {{ size }}</div>
      <div>推荐设计分辨率: {{ dpi }}</div>
      <!--      <div>-->
      <!--        工厂生产版:-->
      <!--        <ReusePsdTemplate />-->
      <!--      </div>-->
    </div>

    <template #reference>
      <div class="icon-container">
        <recommendSvg />
        <div class="corner"></div>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import conrner from '@/views/designerApp/components/conrner.vue';
import recommendSvg from '@/views/designerApp/components/svg/recommendSvg.vue';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { GRequest, METHOD } from '@/utils/request';
// import { downloadByFetch } from '@/laod/utils';
// const [DefinePsdTemplate, ReusePsdTemplate] = createReusableTemplate();

const activeTemplate = useDesignerApplication().activeTemplate;
const detail = computed(() => activeTemplate.value?.detail);

// 推荐设计像素宽高
const size = computed(() => {
  const config2 = detail.value?.configDesign;
  let size,
    width = 0,
    height = 0;
  if (config2.recommendWidth) width = config2.recommendWidth;
  if (config2.recommendWidth) height = config2.recommendHeight;
  if (width || height) {
    size = `${width}*${height}px`;
  } else {
    size = '暂无数据';
  }
  return size;
});

// 推荐dpi
const dpi = computed(() => {
  const config2 = detail.value?.configDesign;
  let dpi;
  if (config2.recommendDpi) dpi = config2.recommendDpi;
  if (dpi) {
    dpi = `${dpi}像素/英寸`;
  } else {
    dpi = '暂无数据';
  }
  return dpi;
});

// 推荐psd
const psd = computed(() => {
  const config2 = detail.value?.configDesign;
  let psd;
  if (config2.factoryProductionDocuments) psd = config2.factoryProductionDocuments;
  if (psd) {
    psd = `${psd}`;
  } else {
    psd = '暂无数据';
  }
  return psd;
});
// 是否有psd
const isPsd = computed(() => {
  const config = detail.value?.configDesign;
  return !!config.factoryProductionDocuments;
});

/*
 * 下载psd文件
 * */
function handlerDown() {
  const config = detail.value?.configDesign;
  const url = '/base-web/CMProductTemplateConfigDesignAct/downLoad.act';
  const param = {
    downUrl: config.factoryProductionDocuments,
    templateId: activeTemplate.value.detail.seqId,
  };
  // GRequest(url, METHOD.GET, param, { responseType: 'blob' }).then((res) => downloadByFetch(res));
}
</script>

<style lang="less">
.icon-popover {
  width: fit-content;
  //height: 510px;
  background: #fcfcfe;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}
</style>
<style scoped lang="less">
//icon
.icon-container {
  @size: 4rem;
  @gap: var(--fn-gap-min);
  //position: absolute;
  //right: calc((@size + @gap) * -1);
  width: @size;
  height: @size;
  background: #fcfcfe;
  border-radius: 0.4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: #7e7e7e;

  &:hover {
    color: var(--fn-primary-color);
    opacity: 0.9;
    background-color: #fff9f5;
  }
}
</style>
