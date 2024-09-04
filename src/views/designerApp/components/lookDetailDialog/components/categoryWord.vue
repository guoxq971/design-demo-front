<template>
  <div class="category-word-wrap">
    <!--编辑-->
    <template v-if="type === 0">
      <div class="title-wrap">
        <div>品类词文件:</div>
        <template v-if="fileName">
          <div class="q-text-blue q-cur-pointer">{{ fileName }}</div>
          <el-button type="text" class="q-text-red" @click="onDel">删除</el-button>
        </template>
      </div>
      <div class="upload-wrap">
        <bmUploadPic v-model="c_fileName" bmName="file" :bm-limit="1" bmUrl="/base-web/cm/cmTemplateDescribe/uploadFile" />
      </div>
    </template>
    <!--预览-->
    <template v-else>
      <bm-excel-preview v-if="file" v-model="file" :style="{ width: width, height, height }" />
    </template>
  </div>
</template>

<script>
export default {
  name: 'categoryWord',
  model: {
    prop: 'fileName',
  },
  props: {
    file: { type: [Blob, null], default: null }, //文件
    fileName: { type: String, default: '' }, //文件名
    type: { type: Number }, //场景类型 0编辑 1详情
  },
  data() {
    return {
      c_fileName: this.fileName,
      width: '100%',
      height: '630px',
    };
  },
  watch: {
    file: {
      immediate: true,
      handler(val) {
        if (val) {
          // console.log('val', val);
        }
      },
      deep: true,
    },
    c_fileName(val) {
      this.$emit('input', val);
    },
  },
  methods: {
    // 删除
    onDel() {
      this.c_fileName = '';
    },
  },
  mounted() {
    // if (this.type === 1 && this.fileName && !this.file) {
    //   readFile({ url: this.fileName }).then((res) => {
    //     console.log('res', res);
    //     this.file = res.data;
    //   });
    // }
  },
};
</script>

<style scoped lang="less">
.category-word-wrap {
  .title-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }
  .upload-wrap {
  }
}
</style>
