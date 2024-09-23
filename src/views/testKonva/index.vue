<template>
  <div>
    <el-button @click="onAdd">新增</el-button>
    <el-button @click="onTile">平铺</el-button>
    <div ref="domRef" style="width: 500px;height: 500px;border:1px solid"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
// utils
import { Editor } from './editor/editor';

let editor;
const domRef = ref(null);
function onAdd() {
  editor.add();
}
function onTile() {
  editor.tile();
}

onMounted(() => {
  editor = Editor(domRef.value);
});
</script>

<style scoped lang="less"></style>
