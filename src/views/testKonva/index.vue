<template>
  <div>
    <el-input v-model="text" />
    <div ref="domRef" style="width: 500px;height: 500px;border:1px solid"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
// utils
import Konva from 'konva';

const domRef = ref(null);
const stage = ref(null);
const text = ref('');
watch(text, (val) => {
  stage.value.findOne('#text').text(val);
});
onMounted(() => {
  stage.value = new Konva.Stage({
    container: domRef.value,
    width: 500,
    height: 500,
  });
  const layer = new Konva.Layer();
  stage.value.add(layer);
  let rect = new Konva.Text({
    id: 'text',
    x: 10,
    y: 10,
    text: 'Hello',
    fontSize: 30,
    fontFamily: 'Calibri',
    fill: 'green',
  });
  rect = new Proxy(rect, {
    set(target, key, value) {
      if (key === 'text') {
        console.log('set text');
      }
      return Reflect.set(target, key, value);
    },
  });
  layer.add(rect);
  const tr = new Konva.Transformer();
  layer.add(tr);
  tr.nodes([rect]);
  layer.draw();
});
</script>

<style scoped lang="less"></style>
