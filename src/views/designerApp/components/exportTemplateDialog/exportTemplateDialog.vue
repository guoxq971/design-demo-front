<template>
  <el-dialog :title="title" :close-on-click-modal="false" :width="dialog.width" :top="dialog.top" append-to-body visible @close="onClose">
    <div>
      <el-select v-model="activeSize" :disabled="loading">
        <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button style="margin-left: 15px;" type="primary" @click="onSubmit" :loading="loading">确定</el-button>
    </div>

    <div class="preview-group" v-if="imageList.length">
      <div v-loading="item.loading" v-for="(item, index) in imageList" :key="'preview_' + index">
        <img v-if="showImage(item)" :src="showImage(item)" alt="" class="img" />
      </div>
    </div>

    <div class="template-export-container-group">
      <div ref="templateExportRef" v-for="(item, index) in imageList" :key="'template_export_container3d_' + index" :style="containerStyle"></div>
    </div>
  </el-dialog>
</template>

<script setup>
import { Ref, computed, defineEmits, defineProps, onBeforeUnmount, ref, onMounted } from 'vue';
import JSZip from 'jszip';
import { useVModels } from '@vueuse/core';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { ThreeWithCamera } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/ThreeWithCamera';
import { getMaterialName } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/updateMesh';
import { Message, MessageBox } from 'element-ui';
import * as THREE from 'three';

const title = '模板导出';
const dialog = computed(() => {
  return {
    width: '500px',
    top: '15vh',
  };
});
const onClose = () => (show.value = false);
const props = defineProps({
  show: { type: Boolean, default: false },
});
const { show } = useVModels(props);
onBeforeUnmount(() => {
  // base64销毁,3d销毁
  imageList.value.forEach((item) => {
    item.base64 && URL.revokeObjectURL(item.base64);
    item.three?.destroy();
  });
});

// 展示图片
const showImage = computed(() => {
  return (item) => imageList.value.find((e) => e.seqId === item.seqId)?.base64;
});

// 模板
const template = useDesignerApplication().activeTemplate.value;

/**@type {Ref<{name:string,base64:string,seqId:string,three:import('d').multiThree,glbPath:string,loading:boolean }[]>}*/
const imageList = ref([]);
const templateExportRef = ref(null);
const loading = ref(false);
const sizeList = [
  { label: '1500 x 1500 px', value: 1, size: 1500 },
  { label: '1000 x 1000 px', value: 2, size: 1000 },
  { label: '500 x 500 px', value: 3, size: 500 },
];
const activeSize = ref(sizeList[0].value);
const activeSizeObj = computed(() => sizeList.find((item) => item.value === activeSize.value));
const containerStyle = computed(() => ({
  width: `${activeSizeObj.value.size}px`,
  height: `${activeSizeObj.value.size}px`,
}));

// 初始化需要导出的图片配置
imageList.value = template.exportConfig.map((item) => {
  return {
    seqId: item.seqId,
    base64: '',
    name: item.angleName,
    three: null,
    glbPath: item.glbPath,
    loading: false,
  };
});

// 提交
function onSubmit() {
  loading.value = true;
  try {
    // base64销毁
    imageList.value.forEach((item) => {
      item.base64 && URL.revokeObjectURL(item.base64);
      item.base64 = '';
    });
    const pAll = imageList.value.map((item, index) => {
      return new Promise((resolve) => {
        if (!item.three) {
          item.three = new ThreeWithCamera();
          return item.three
            .create({
              path: process.env.VUE_APP_API_BASE_IMG_URL + item.glbPath,
              container: templateExportRef.value[index],
              loadModelBefore: () => (item.loading = true),
              loadModelFinally: () => (item.loading = false),
              loadModelSuccess: (_, meshModelList) => {
                // 加载模型材质
                bindModelMesh(template, meshModelList, item.three);
                // 等待渲染完后导出
                setTimeout(() => {
                  item.base64 = item.three.exportBase64();
                  resolve(true);
                });
              },
            })
            .catch((e) => {
              console.error('模型加载失败 e', e);
              Message.warning('模型加载失败');
              resolve(false);
            })
            .finally(() => {
              item.value = false;
            });
        } else {
          resolve(true);
        }
      });
    });

    Promise.all(pAll).then((l) => {
      if (l.every((e) => e)) {
        createZip();
      } else {
        MessageBox.confirm('存在解析失败的图片，是否继续导出图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          createZip();
        });
      }
    });
  } finally {
    loading.value = false;
  }
}

/**
 * 绑定模型材质
 * @param {import('d').template} template
 * @param {THREE.Mesh[]} meshModelList
 * @param {import('d').multiThree} three
 */
function bindModelMesh(template, meshModelList, three) {
  template.viewList.forEach(
    /**@param {import('d').view} view*/
    (view) => {
      if (view.textureCanvas) {
        const mesh = meshModelList.find((mesh) => getMaterialName(mesh) === view.getMaterialName());
        if (mesh) {
          // 绑定到材质上
          const texture = new THREE.CanvasTexture(view.textureCanvas);
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.flipY = false;
          mesh.material.map = texture;
          mesh.material.needsUpdate = true;

          // 更细材质
          three.renderer.render(three.scene, three.camera);
          mesh.material.map.needsUpdate = true;
          three.renderer.render(three.scene, three.camera);
        }
      }
    },
  );
}

// 创建zip
function createZip() {
  // 创建一个 JSZip 实例
  const zip = new JSZip();
  // 将所有图片添加到 ZIP 文件
  imageList.value.forEach((item) => {
    zip.file(`${item.name}.png`, item.base64.split('base64,')[1], { base64: true });
  });

  // 生成 ZIP 文件
  zip
    .generateAsync({ type: 'blob' })
    .then((zipBlob) => {
      // 创建一个下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(zipBlob);
      // name = 3D效果图_时间戳.zip
      downloadLink.download = `3D效果图_${new Date().getTime()}.zip`;

      // 将链接添加到页面并触发下载
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // 移除链接
      document.body.removeChild(downloadLink);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style scoped lang="less">
.template-export-container-group {
  position: fixed;
  left: 99999999999px;
}
.preview-group {
  width: 43.3rem;
  display: flex;
  flex-wrap: wrap;
  margin-top: 1.2rem;
  img {
    width: 10rem;
    height: 10rem;
    border: 1px solid #eee;
    margin-right: 0.8rem;
    margin-bottom: 0.8rem;
  }
}
</style>
