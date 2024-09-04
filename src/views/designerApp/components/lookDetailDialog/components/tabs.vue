<template>
  <el-tabs v-model="activeName" tab-position="top" type="border-card" v-loading="loading" class="body-detail">
    <el-tab-pane name="1" label="详情">
      <div class="detail-title">【产品详情】</div>
      <div class="detail-bt-48">
        <div class="detail-templateName">【中文名称】{{ info.templateName }}</div>
        <div class="detail-templateName">【英文名称】{{ info.templateEnName }}</div>
        <div class="detail-templateName">【产品编号】{{ info.spu }}</div>
        <template v-if="showWeight">
          <div class="detail-templateName">【产品重量】{{ info.weight }}</div>
        </template>
        <div class="detail-templateName">【生产工艺】{{ info.craft }}</div>
        <div class="detail-templateName">【产品材质】{{ info.material }}</div>
        <div class="detail-templateName">【具体成分】{{ info.specificIngredient }}</div>
      </div>
      <div class="detail-title">【其他描述】</div>
      <div class="detail-bt-48 detail-table" v-html="info.otherDescribe"></div>
    </el-tab-pane>
    <el-tab-pane name="2" label="规格">
      <div class="detail-title">【尺码规格】</div>
      <div class="detail-bt-48 detail-table" v-html="info.productSpecification"></div>
    </el-tab-pane>
    <el-tab-pane name="3" label="包装">
      <div class="detail-title">【物流包装】</div>
      <el-table :data="info.packSpecificationList" class="detail-bt-48">
        <el-table-column label="尺码" prop="templateSize" align="center" />
        <el-table-column label="包装尺寸cm(长*宽*高)" prop="packVolumeCm" align="center" />
        <el-table-column label="包装尺寸in(长*宽*高)" prop="packVolumeIn" align="center" />
        <el-table-column label="包装重量g" prop="packWeightG" align="center" />
        <el-table-column label="包装重量ib" prop="packWeightLb" align="center" />
        <el-table-column label="FBA操作费" prop="fbaOptFee" align="center" />
      </el-table>
      <div class="detail-title">【FBA包装】</div>
      <el-tabs class="detail-bt-48" type="card" v-model="activeBar">
        <el-tab-pane v-for="item in info.fbaPackList" :key="item.boxCode" :label="`${item.boxCode}#`" :name="item.boxCode">
          <el-table :data="item.parameterList">
            <el-table-column prop="size" label="尺码" align="center" />
            <el-table-column prop="packTypeName" label="包装类型" align="center" />
            <el-table-column prop="estimatePackQuantity" label="预计装箱数量" align="center" />
            <el-table-column prop="estimatePackVolume" label="预计装箱总体积cm" align="center" />
            <el-table-column prop="estimatePackWeight" label="预计装箱重量g" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="detail-tip">*美国FBA装箱数据仅供参考，因产品形态、摆放方式等不同，可能存在一定误差，请以实际装箱为准</div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue';
import { GRequest, METHOD } from '@/utils/request';

const props = defineProps({
  templateId: { type: String, default: '', required: true },
  showWeight: { type: Boolean, default: true },
});

onMounted(() => {
  getDetail();
});

const activeName = ref('1');
const activeBar = ref('');
const loading = ref(false);
const info = ref({
  colorList: [], // 颜色
  fbaPackList: [], // FBA包装
  sizeStrList: [], // 尺码
  templateName: '', // 模板名称
  templateEnName: '', // 英文名
  priceList: [], // 价格
  productSpecification: '', // 产品规格
  packSpecificationList: [], // 物流包装
  vidroUrl: '', // 视频地址
  craft: '', // 生产工艺
  weight: '', // 产品重量
  spu: '', // 产品编号
  material: '', // 产品材质
  specificIngredient: '', // 具体成分
  otherDescribe: '', // 产品尺码
});
const getDetail = async () => {
  try {
    loading.value = true;
    const res = await GRequest(`/base-web/cm/cmProductTemplate/getAllTemplateDetail/${props.templateId}`, METHOD.GET, {});
    if (res.data.code !== 0) return;
    Object.keys(info.value).forEach((key) => {
      info.value[key] = res.data.data[key];
    });
    // activeColor.value = res.data.data.colorList[0].value;
    // activeSize.value = res.data.data.sizeStrList[0];
    // priceList.value = res.data.data.priceList ? res.data.data.priceList[0].priceList : [];
    // getImgList();
    info.value.fbaPackList?.forEach((item) => (item.boxCode = item.boxCode.toString()));
    // 激活的tab栏
    activeBar.value = info.value.fbaPackList[0]?.boxCode;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="less">
:deep(.el-tabs__item.is-active) {
  border-bottom-color: var(--fn-primary-color) !important;
}
// 产品详情
.body-detail {
  .detail-title {
    height: 6rem;
    font-weight: bold;
    font-size: 1.6rem;
    color: #000d01;
    line-height: 2.1rem;
    padding: 2rem 0 1.9rem 2.8rem;
    margin-bottom: 2.8rem;
    background: #f7f8f9;
    border-radius: 0.8rem;
  }

  .detail-templateName {
    height: 2.8rem;
    font-size: 1.6rem;
    color: #000d01;
    line-height: 2.8rem;
    margin-bottom: 1.2rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .detail-bt-48 {
    margin-bottom: 4.8rem;
  }

  .detail-tip {
    margin-top: 1.8rem;
    height: 2.1rem;

    font-size: 1.6rem;
    color: #ff4551;
    line-height: 2.1rem;
  }
}
</style>

<style lang="less">
.detail-table img {
  width: 100%;
}

.detail-table table {
  width: 100% !important;
}
.detail-table table th {
  text-align: center;
  background: #fcfcfe;
  color: #000c01;
  border: 1px solid #ebeef5;
  font-size: 1.4rem;
  line-height: 1.9rem;
  font-weight: 500;
  height: 6rem;
  vertical-align: center;
}

.detail-table table td {
  height: 6rem;
  font-size: 1.4rem;
  line-height: 1.9rem;
  font-weight: 500;
  vertical-align: center;
  text-align: center;
  border: 1px solid #ebeef5;
}
</style>
