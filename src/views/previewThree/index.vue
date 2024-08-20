<template>
  <div ref="containerRef" class="app-container" style="position: relative" :class="{ 'dark-mode': isDark }">
    <div style="position: absolute">
      <el-button @click="onOpen(types.camera)">选择文件(相机)</el-button>
      <el-button @click="onOpen(types.noCamera)">选择文件</el-button>
      <div style="margin-top: 10px;font-size: 20px" v-if="curName">{{ curName }}</div>
    </div>
    <div style="display: flex;justify-content: center;align-items: center;height:100%">
      <div v-loading="loading" ref="threeContainerRef" style="border:2px dashed" :style="style"></div>
    </div>
  </div>
</template>

<script setup>
import { useObjectUrl, useDark, useToggle, useFileDialog, useElementBounding } from '@vueuse/core';
import { Message } from 'element-ui';
import { Test } from './Test';
import { ref, nextTick, computed } from 'vue';
import { ThreeWithCamera } from './ThreeWithCamera';
const isDark = useDark();
const loading = ref(false);
const toggleLoading = useToggle(loading);

const containerRef = ref(null);
const { width, height } = useElementBounding(containerRef);
const style = computed(() => ({
  width: `${height.value}px`,
  height: `${height.value}px`,
}));

const { files, open, reset, onChange } = useFileDialog({
  accept: '*', // Set to accept only image files
  directory: false, // Select directories instead of files if set true
});

const curName = ref('');
const curType = ref('');
const types = {
  camera: 'camera',
  noCamera: 'noCamera',
};
const onOpen = (type) => {
  curType.value = type;
  open();
};
const threeContainerRef = ref(null);
let three;
onChange((fileList) => {
  console.log('change');
  if (!fileList?.length) {
    return;
  }

  // 名字赋值
  curName.value = fileList[0].name;
  // 重置文件 (等价elUpload.clearFiles())
  nextTick(() => reset());

  // 后缀校验
  const suffixList = ['glb'];
  if (!suffixList.includes(fileList[0].name.split('.').at(-1))) {
    Message.warning(`请选择正确的模型文件 ${suffixList.join(', ')}`);
    return;
  }
  const path = useObjectUrl(fileList[0]);

  //销毁已有
  three?.destroy();
  three = null;

  //创建
  if (curType.value === types.camera) {
    create3dWithCamera(path);
  } else {
    create3d(path);
  }
});

// 创建-自带相机
function create3dWithCamera(path) {
  three = new ThreeWithCamera();
  three.create({
    path: path.value,
    container: threeContainerRef.value,
    loadModelBefore: () => toggleLoading(true),
    loadModelFinally: () => toggleLoading(false),
    loadModelSuccess: (model, meshModelList, three) => {
      nextTick(() => {
        // this.bindCanvas(meshModelList);
        // successBack && successBack();
        if (three?.scene && three?.camera && three?.renderer) {
          // this.updateMeshList.forEach((mesh) => (mesh.material.map.needsUpdate = true));
          three.renderer.render(three.scene, three.camera);
          // 销毁base64
          // this.base64 && URL.revokeObjectURL(this.base64);
          // setTimeout(() => {
          //   // 截图
          //   this.base64 = this.three.renderer.domElement.toDataURL();
          // });
        }
      });
    },
  });
}

// 不带相机
function create3d(path) {
  three = new Test();
  three.create({
    path: path.value,
    container: threeContainerRef.value,
    loadModelBefore: () => toggleLoading(true),
    loadModelFinally: () => toggleLoading(false),
    loadModelSuccess: (model, meshModelList) => {
      nextTick(() => {
        // // 初始化材质
        // this.initMeshAllList(meshModelList);
        // // 绑定材质
        // this.bindCanvas(meshModelList);
        // // 注册射线
        // this.registerRaycaster(container, this.three.camera, this.three.controls);
        // // 注册鼠标事件
        // this.destroyMouse = this.registerMouseEvent(this.three.renderer.domElement);
        setTimeout(() => model && (model.visible = true), 100);
        // createCallback && createCallback();
      });
    },
  });
}
</script>

<style lang="less" scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
.dark-mode {
  background-color: #333;
  color: #fff;
}
</style>
