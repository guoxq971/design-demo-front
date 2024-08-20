<!--图片组合-->
<template>
  <div class="img" @click="handleImg" :class="{ transform: isTransform }">
    <template v-if="!isTransform">
      <img :style="{ objectFit: objectFit }" v-if="src1" :src="src1" class="img-box" alt="" />
      <img :style="{ objectFit: objectFit }" v-if="src2" :src="src2" class="img-box1" alt="" />
    </template>
    <template v-else>
      <img :style="{ objectFit: objectFit }" v-if="src1" :src="src1" class="img-box" alt="" />
      <img :style="{ objectFit: objectFit }" v-if="src2" :src="src2" class="img-box1" alt="" />
    </template>
  </div>
</template>

<script setup>
import { isFileSuffixTool } from '@/laod/utils';
import { ref, computed, defineProps, defineEmits } from 'vue';
import { isRenderings } from '@/components/imgTrack/util';

const props = defineProps({
  // 图片地址1-背景
  url1: { type: String, default: '' },
  // 图片地址2-非背景
  url2: { type: String, default: '' },
  // 图片宽
  imgWidth: { type: String, default: '100%' },
  // 图片高
  imgHeight: { type: String, default: '100%' },
  // transform
  transform: { type: Boolean, default: false },
  // objectFit
  objectFit: { type: String, default: 'cover' },
});

// 图片是否使用transform渲染 (只对500x500有效果,其他尺寸要另外设置)
const transformScale = ref(0.5); //251/500  渲染大小(div大小)/实际尺寸(图片大小)  $0.offsetWidth/$0.naturalWidth
const isTransform = computed(() => props.transform);

// 判断是否有前缀，没有就加前缀
const checkFix = (oUrl) => {
  let url = '';
  // 是否是指定后缀图片
  if (isFileSuffixTool.isCheckSuffix(oUrl)) {
    url = isFileSuffixTool.getPic(oUrl);
  } else {
    let result2 = (oUrl + '').indexOf('http') === -1; //url中如果存在 http 就不加前缀
    let result4 = (oUrl + '').indexOf('https') === -1; //url中如果存在 https 就不加前缀
    let result3 = oUrl !== ''; //图片不能为空
    if (result3 && result2 && result4) {
      url = process.env.VUE_APP_API_BASE_IMG_URL + oUrl;
    } else {
      url = oUrl;
    }
  }
  return url;
};

const src1 = computed(() => {
  const s = checkFix(props.url1);
  return isRenderings(props.url2) ? '' : s;
});

const src2 = computed(() => {
  const s = checkFix(props.url2);
  return isRenderings(props.url1) ? '' : s;
});

const emit = defineEmits(['click']);
const handleImg = () => {
  emit('click');
};
</script>

<style scoped lang="less">
.img {
  width: v-bind('props.imgWidth');
  height: v-bind('props.imgHeight');
  position: relative;

  .img-box,
  .img-box1 {
    width: auto;
    height: 100%;
  }

  .img-box1 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}

.transform {
  width: v-bind('props.imgWidth');
  height: v-bind('props.imgHeight');
  position: relative;
  .img-box,
  .img-box1 {
    width: auto;
    height: auto;
    transform: scale(v-bind(transformScale)) translate(-50%, -50%);
  }

  .img-box1 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
