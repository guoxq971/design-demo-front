<template>
  <div style="background-color:#000c01;width: 100vw;height: 100vh;display: flex;justify-content: center">
    <div>
      <div v-for="item in list" :key="item.value">
        <el-button @click="cutPath(item.value)">{{ item.label }}</el-button>
      </div>
    </div>
    <div v-loading="loading">
      <div ref="myThreeRef" style="width: 900px;height: 900px;border:1px solid #fff"></div>
    </div>
    <div>
      <div style="color:#fff">灯光类型</div>
      <div v-for="item in lightList" :key="item.value">
        <el-button :type="activeLight === item.value ? 'primary' : ''" @click="cutLight(item.value)">{{ item.label }}</el-button>
      </div>
    </div>
    <div>
      <el-checkbox v-model="roughness">
        <span style="color: #fff!important;">
          是否自动粗糙度
        </span>
      </el-checkbox>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { customThree } from '@/views/testThree/customThree/index.js';
// import { test } from '@/views/testThree/app';
// import { DemoPlugin } from '@/views/testThree/Editor/Plugin.demo';
// import { Editor } from '@/views/testThree/Editor/Editor';

const roughness = ref(false);
const loading = ref(false);
const list = ref([
  { value: '/1485.glb', label: '帽子' },
  { value: '/6007.glb', label: '帽子2' },
  { value: '/finish.glb', label: '鼠标垫' },
  { value: '/2426-L.glb', label: '衣服' },
  { value: '/2426_2.glb', label: '衣服(去材质)' },
]);
const lightList = ref([
  { value: 'DirectionalLight', label: '平行光' },
  { value: 'HemisphereLight', label: '半球光' },
  { value: 'PointLight', label: '点光源' },
  { value: 'RectAreaLight', label: '矩形区域光' },
  { value: 'SpotLight', label: '聚光灯' },
]);

const activePath = ref(list.value[0].value);
const activeLight = ref(lightList.value[0].value);

function cutPath(path) {
  activePath.value = path;
  load();
}
function cutLight(lightType) {
  activeLight.value = lightType;
  load();
}

function load() {
  t?.destroy();
  t = customThree(myThreeRef.value, { lightType: activeLight.value });
  t.model.load({ path: activePath.value, loading, roughness: roughness.value });
  t.animate.start();
}

const myThreeRef = ref(null);
let t;
onBeforeUnmount(() => {
  t?.destroy();
});
onMounted(() => {
  nextTick(async () => {
    load();
    // t = customThree(myThreeRef.value);
    // t.model.load({ path: '/1485.glb', loading }); //帽子
    // // t.model.load({ path: '/6007.glb' }); //帽子2
    // // t.model.load({ path: '/finish.glb' }); //鼠标垫
    // // t.model.load({ path: '/2426-L.glb' }); //衣服
    // // t.model.load({ path: '/2426_2.glb' }); //衣服(去材质)
    // t.animate.start();
  });
});
</script>

<style scoped lang="less"></style>
