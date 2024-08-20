<template>
  <el-select v-model="value" @change="change" :placeholder="placeholder" filterable>
    <el-option v-for="item in list" :key="item.id" :label="item.value" :value="item.value" />
  </el-select>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { useVModel } from '@/views/selectMap/useCityMap/useVModel';
const emit = defineEmits();
const props = defineProps({
  provinceFlag: { type: Boolean, default: false },
  province: [String],
  cityFlag: { type: Boolean, default: false },
  city: [String],
  blockFlag: { type: Boolean, default: false },
  block: [String],
  placeholder: String,
  super: Object,
});
const province = useVModel(props, 'province', emit);
const city = useVModel(props, 'city', emit);
const block = useVModel(props, 'block', emit);
const values = ref({
  province: province,
  city: city,
  block: block,
});

const placeholders = {
  province: '省级地区',
  city: '市级地区',
  block: '区级地区',
};

const placeholder = computed(() => props.placeholder || placeholders[type.value]);

const type = computed(() => {
  if (props.provinceFlag) {
    return 'province';
  } else if (props.cityFlag) {
    return 'city';
  } else if (props.blockFlag) {
    return 'block';
  } else {
    return '';
  }
});

const change = (function() {
  const map = props.super.map;
  const changeProvince = (e) => {
    for (const index2 in map.province) {
      if (e === map.province[index2].value) {
        // console.log(provinceList.value[index2].id); //你选择的省级编码
        // console.log(provinceList.value[index2].value); //省级编码 对应的汉字
        map.city = map.province[index2].children;
        city.value = '';
        // map.block = map.province[index2].children[0].children;
        block.value = '';
      }
    }
  };
  const changeCity = (e) => {
    for (const index3 in map.city) {
      if (e === map.city[index3].value) {
        map.block = map.city[index3].children;
        block.value = '';
      }
    }
  };
  const changeBlock = (e) => {};

  return {
    province: changeProvince,
    city: changeCity,
    block: changeBlock,
  }[type.value];
})();

const list = computed(() => props.super.map[type.value]);

const value = computed({
  get: () => values.value[type.value],
  set: (val) => (values.value[type.value] = val),
});
</script>

<style scoped lang="less"></style>
