<template>
  <el-popover popper-class="price-pop" placement="left-start" trigger="click">
    <!--正常-->
    <el-table
      border
      class="fn-table-border"
      :header-cell-style="{ background: '#F6F8FA', fontWeight: 'normal' }"
      :data="list"
      v-if="[useDesignerAppConfig().template_special_type_2].includes(specialType)"
    >
      <el-table-column align="center" property="num" label="下单件数" width="92" />
      <el-table-column align="center" property="price" label="单件价格" width="100">
        <template slot="header">
          单件价格
          <el-tooltip placement="top" :content="tooltip">
            <span class="el-icon-question" style="color: #A6A7A7;" />
          </el-tooltip>
        </template>
        <template slot-scope="{ row }">
          <span style="color: var(--fn-primary-color)">￥{{ row.price }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--尺码 | 颜色-->
    <el-table :data="list" v-if="![useDesignerAppConfig().template_special_type_2].includes(specialType)">
      <el-table-column align="center" label="">
        <el-table-column align="center" property="num" label="下单件数" />
      </el-table-column>
      <el-table-column align="center" label="单件价格">
        <template slot="header">
          单件价格
          <el-tooltip v-if="[useDesignerAppConfig().template_special_type_1].includes(specialType)" placement="top" :content="tooltip">
            <span class="el-icon-question" style="color: #A6A7A7;" />
          </el-tooltip>
          <el-tooltip v-if="[useDesignerAppConfig().template_special_type_0].includes(specialType)" placement="top" :content="tooltip">
            <span class="el-icon-question" />
          </el-tooltip>
        </template>
        <el-table-column v-for="(item, index) in headerList" :key="`aa${index}`" align="center">
          <template slot="header">
            <span v-if="[useDesignerAppConfig().template_special_type_0].includes(specialType)" class="fn-red">{{ item.join(' / ') }}</span>
            <div v-if="[useDesignerAppConfig().template_special_type_1].includes(specialType)" style="display: flex">
              <div :style="{ background: getColor(it) }" class="chunk-wrap" v-for="it in item" :key="it" />
            </div>
          </template>
          <template slot-scope="{ row }">
            <span style="color: var(--fn-primary-color)">￥{{ row[item[0]] }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <!--icon-->
    <div slot="reference" v-if="list.length">
      <slot></slot>
    </div>
  </el-popover>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

const specialType = computed(() => {
  return useDesignerApplication().templateSpecialType.value;
});
const priceList = computed(() => {
  return useDesignerApplication().templatePriceList.value;
});

const tooltip = '该价格不含可选工艺、配件';
const headerList = ref([]);
const list = computed(() => {
  // 表头组成
  let headerObj = {};
  // 表格数据
  let result = [];
  if (priceList.value.length === 0) {
    return result;
  }
  // 件数
  const numList = priceList.value[0].list.map((it) => it.num);
  // 尺码/颜色
  const propList = priceList.value.map((e) => e.prop);

  switch (specialType.value) {
    // 颜色 | 尺码
    case useDesignerAppConfig().template_special_type_0:
    case useDesignerAppConfig().template_special_type_1:
      // 表头
      headerObj = getHeaderObj(priceList.value);

      // 件数合并
      for (let num of numList) {
        const obj = { num: num };
        for (let prop of propList) {
          obj[prop] = priceList.value.find((e) => e.prop === prop).list.find((e) => e.num === num).price;
        }
        result.push(obj);
      }

      headerList.value = Object.values(headerObj);
      break;
    // 正常
    case useDesignerAppConfig().template_special_type_2:
      result = priceList.value[0].list;
      break;
    default:
      result = [];
      break;
  }

  return result;
});

// 获取颜色
function getColor(color) {
  const result = useDesignerApplication().activeTemplate.value?.detail.appearances.find((e) => e.name === color);
  if (result) {
    return result.colors[0].value;
  }
  return '';
}

/**
 * 获取重组后的表头
 * @param {Array} list 模板价格列表
 * @returns {Object}
 * */
function getHeaderObj(list) {
  const headerObj = {};
  for (const item of list) {
    // 区分尺码 | 颜色;
    const str = item.list.reduce((pre, cur) => {
      return pre + cur.num + '、' + cur.price + '、';
    }, '');
    if (!headerObj[str]) headerObj[str] = [item.prop];
    else headerObj[str].push(item.prop);
  }
  return headerObj;
}
</script>

<style scoped lang="less">
.chunk-wrap {
  width: 2rem;
  height: 2rem;
  background: #fff;
  border: 0.1rem solid;
  border-radius: 0.4rem;
  margin-right: 0.4rem;
}
</style>
