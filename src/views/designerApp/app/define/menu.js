import templateSvg from '@/views/designerApp/components/svg/templateSvg.vue';
import imageSvg from '@/views/designerApp/components/svg/imageSvg.vue';
import bgImageSvg from '@/views/designerApp/components/svg/bgImageSvg.vue';
import textSvg from '@/views/designerApp/components/svg/textSvg.vue';

export const menus = {
  product: '选择产品',
  image: '选择图片',
  bg: '选择背景',
  text: '添加文字',
};

export const menuList = [
  { label: '选择产品', value: menus.product, icon: templateSvg },
  { label: '选择图片', value: menus.image, icon: imageSvg },
  { label: '选择背景', value: menus.bg, icon: bgImageSvg },
  { label: '添加文字', value: menus.text, icon: textSvg },
];
