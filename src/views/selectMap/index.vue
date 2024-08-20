<template>
  <div>
    <MapSelect province-flag :super="citySuper" :province.sync="param.province" :city.sync="param.city" :block.sync="param.block" />
    <MapSelect city-flag :super="citySuper" :city.sync="param.city" :block.sync="param.block" />
    <MapSelect block-flag :super="citySuper" :block.sync="param.block" />
  </div>
</template>

<script setup>
import { useCityMap } from './useCityMap';
import MapSelect from './useCityMap/components/MapSelect';
import { onMounted, ref } from 'vue';

const { citySuper, setDefault } = useCityMap();

const param = ref({
  province: '河北省',
  city: '秦皇岛市',
  block: '北戴河区',
});
setDefault(...Object.values(param.value));
</script>

<style scoped lang="less"></style>
