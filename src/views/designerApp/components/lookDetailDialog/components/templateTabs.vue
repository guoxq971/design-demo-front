<!--模板描述tabs-->
<template>
  <el-tabs tab-position="top" type="border-card" style="min-height: 630px;" v-model="activeName">
    <el-tab-pane name="1" label="产品详情">
      <el-form inline class="main-wrap" :style="{ height: height }" label-width="100px">
        <div>
          <el-form-item label="【中文名称】:">
            <el-input class="q-w270" disabled v-model="detail.templateName" />
          </el-form-item>
          <el-form-item label="【英文名称】:">
            <el-input class="q-w270" :disabled="disabled" v-model="detail.enName" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="【产品重量】:">
            <el-input class="q-w270" :disabled="disabled" v-model="detail.weight" />
          </el-form-item>
          <el-form-item label="【生产工艺】:">
            <el-input class="q-w270" :disabled="disabled" v-model="detail.craft" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="【产品材质】:">
            <el-input class="q-w270" :disabled="disabled" v-model="detail.material" />
          </el-form-item>
          <el-form-item label="【具体成分】:">
            <el-input class="q-w270" :disabled="disabled" v-model="detail.specificIngredient" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="【建议售价】:">
            <el-input class="q-w270" :disabled="disabled" v-model="detail.sellingPrice" />
          </el-form-item>
        </div>
        <div class="formmb0">
          <el-form-item label="【产品配件】:">
            <!--产品模板管理new/模板描述配置-->
            <el-input v-if="type === 0" type="textarea" :rows="4" :disabled="disabled" v-model="detail.accessories" class="q-w650" />
            <!--产品设计器new/查看详情-->
            <template v-if="type === 1">
              <div>{{ detail.accessories }}</div>
            </template>
          </el-form-item>
        </div>
        <el-divider />
        <div v-if="otherDescribe">
          <el-form-item label="【其他描述】:">
            <!--            <br />-->
            <bmEditor width="100%" :style="styleByProdDetail" v-if="isBmEditor" v-model="detail.otherDescribe" :isToolbar="isToolbar" :disabled="readOnly" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="【品类词】:">
            <!--            <br />-->
            <bmEditor width="100%" :style="styleByProdDetail" v-if="isBmEditor" v-model="detail.keyWord" :isToolbar="isToolbar" :disabled="readOnly" />
          </el-form-item>
        </div>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="2" label="产品规格">
      <el-form label-position="top" class="main-wrap">
        <el-form-item label="【产品规格】:">
          <bmEditor width="100%" v-if="isBmEditor" v-model="detail.productSpecification" :isToolbar="isToolbar" :disabled="readOnly" style="max-height: 575px; overflow: auto;" />
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="3" label="FBA装箱">
      <el-form class="main-wrap">
        <el-form-item label="【物流包装】:" max-height="350">
          <el-table :data="detail.fbaList">
            <el-table-column prop="size" align="center" label="尺码" />
            <el-table-column align="center" label="颜色" :formatter="() => '全部颜色'" />
            <el-table-column align="center" label="最优箱规(cm)">
              <template slot-scope="{ row }">
                <el-input v-model="row.boxSize" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="预计可装箱数量/箱">
              <template slot-scope="{ row }">
                <el-input v-model="row.casePack" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="预计重量kg/箱">
              <template slot-scope="{ row }">
                <el-input v-model="row.estimatedWeight" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="实重/泡重">
              <template slot-scope="{ row }">
                <bm-el-select :placeholder="disabled ? '' : '请选择'" :disabled="disabled" :is-first="false" :options="weightTypeList" :value.sync="row.weightType" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="【亚马逊包装】:">
          <el-table :data="detail.fbaList" max-height="350">
            <el-table-column prop="size" align="center" label="尺码" />
            <el-table-column align="center" label="颜色" :formatter="() => '全部颜色'" />
            <el-table-column align="center" label="最长边(inch)">
              <template slot-scope="{ row }">
                <el-input v-model="row.longestSide" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="次长边(inch)">
              <template slot-scope="{ row }">
                <el-input v-model="row.secondarySide" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="最短边(inch)">
              <template slot-scope="{ row }">
                <el-input v-model="row.shortestSide" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="毛重(lb)">
              <template slot-scope="{ row }">
                <el-input v-model="row.roughWeight" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="体积重(lb)">
              <template slot-scope="{ row }">
                <el-input v-model="row.volumeWeight" :disabled="disabled" />
              </template>
            </el-table-column>
            <el-table-column align="center" label="实收配送费(USD)" width="170">
              <template slot-scope="{ row }">
                <el-input v-model="row.shippingFee" :disabled="disabled" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane name="4" label="品类词" :disabled="categoryWordDisabled">
      <el-tooltip slot="label" effect="dark" :disabled="!categoryWordDisabled" content="该产品暂无【品类词】数据" placement="top">
        <div :class="{ 'text-disabled': categoryWordDisabled }">品类词</div>
      </el-tooltip>
      <categoryWord v-if="isShow && activeName == 4" :file="file" :type="type" v-model="detail.keyWordFile" />
      <el-skeleton v-if="!isShow"></el-skeleton>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getDetail } from './useTemplateTabs';
import { TemplateDescType } from './util';
import categoryWord from './categoryWord';
import { GRequest, METHOD } from '@/utils/request';

// 重量类型 1-实重  2-泡重
const weightTypeList = [
  { value: 1, label: '实重' },
  { value: 2, label: '泡重' },
];
export default {
  name: 'templateTabs',
  components: { categoryWord },
  props: {
    //  类型 0-产品模板管理new-模板描述配置 1-产品设计器new-查看详情
    type: { type: Number, default: 0 },
  },
  directives: { title: {} },
  data() {
    return {
      file: null,
      activeName: '1',
      isShow: false,
      // 产品配件列表
      productParts: [],
      detail: new TemplateDescType(),
      // 重量类型
      weightTypeList,
    };
  },
  computed: {
    // 品类词是否禁用 => 详情模式 && 有品类词文件
    categoryWordDisabled() {
      return this.type === 1 && !this.detail.keyWordFile;
    },
    // 产品详情-样式
    styleByProdDetail() {
      let style = '';
      // 设计器详情需要
      if (this.type === 1) {
        // style = 'position: relative; left: -100px;';
      }
      return style;
    },
    // 其他描述特殊处理
    otherDescribe() {
      let isShow = true;
      // 设计器-详情，没有内容就不展示
      if (this.type === 1 && !this.detail?.otherDescribe?.length) {
        isShow = false;
      }
      return isShow;
    },
    // 是否展示富文本
    isBmEditor() {
      let isBmEditor = [0, 1].includes(this.type);
      return isBmEditor;
    },
    // 富文本是否显示工具栏
    isToolbar() {
      let isToolbar = false;
      // 模板管理new-模板编辑
      if (this.type === 0) {
        isToolbar = true;
      }
      // 设计器-查看详情
      else if (this.type === 1) {
        isToolbar = false;
      }
      return isToolbar;
    },
    // 富文本是否只读
    readOnly() {
      let readOnly = true;
      // 模板管理new-模板编辑
      if (this.type === 0) {
        readOnly = false;
      }
      // 设计器-查看详情
      else if (this.type === 1) {
        readOnly = true;
      }
      return readOnly;
    },
    // 模板高度
    height() {
      let height = 0;
      // 模板管理new-模板编辑
      if (this.type === 0) {
        height = '565px';
      }
      // 设计器-查看详情
      else if (this.type === 1) {
        height = '645px';
      }
      return height;
    },
    /*
     * 输入框禁用
     * */
    disabled() {
      let flag = false;
      if (this.type === 1) flag = true;
      return flag;
    },
  },
  methods: {
    async init(param) {
      const { type, data } = param;
      this.isShow = false;
      const { detail } = await getDetail(data.seqId);
      this.isShow = true;
      this.detail = detail;
      // 获取品类词文件
      if (this.type === 1 && this.detail.keyWordFile) {
        GRequest(
          `/base-web/CMDesignerAct/read/file`,
          METHOD.POST,
          { url: this.detail.keyWordFile },
          {
            responseType: 'blob',
          },
        ).then((res) => {
          console.log('res', res);
          this.file = res.data;
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
:deep(.el-divider--horizontal) {
  margin: 10px 0 24px 0;
}
.main-wrap {
  //height: 565px;
  overflow: auto;
}

:deep(.el-dialog__body) {
  padding-bottom: 0;
}

.box-wrap {
  display: flex;

  .flex-1 {
    flex: 1;
  }
}

:deep(.el-input.is-disabled .el-input__inner),
:deep(.el-textarea.is-disabled .el-textarea__inner) {
  color: #000;
}

:deep(.text-disabled) {
  cursor: no-drop;
}
</style>
