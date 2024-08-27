import { ref } from 'vue';
// utils
// component
import templateSvg from '@/views/designerApp/components/svg/templateSvg.vue';
import imageSvg from '@/views/designerApp/components/svg/imageSvg.vue';
import bgImageSvg from '@/views/designerApp/components/svg/bgImageSvg.vue';
import textSvg from '@/views/designerApp/components/svg/textSvg.vue';

export function useStatic() {
  return {
    menu: useMenu(),
    tab: useTab(),
  };
}

function useMenu() {
  const menus = {
    product: '选择产品',
    image: '选择图片',
    bg: '选择背景',
    text: '添加文字',
  };

  const menuList = [
    { label: '选择产品', value: menus.product, icon: templateSvg },
    { label: '选择图片', value: menus.image, icon: imageSvg },
    { label: '选择背景', value: menus.bg, icon: bgImageSvg },
    { label: '添加文字', value: menus.text, icon: textSvg },
  ];

  // menu菜单
  const activeMenu = ref(menus.product);

  return {
    menus,
    menuList,
    activeMenu,
  };
}

function useTab() {
  const tabs = {
    product: {
      common: '1',
      custom: '2',
      collect: '3',
    },
    image: {
      my: '1',
      platform: '2',
      collect: '3',
    },
    bg: {
      image: '1',
      color: '2',
      collect: '3',
    },
    text: {
      text: '1',
    },
  };

  const productTabList = [
    { label: '通用产品', value: tabs.product.common },
    { label: '定制模板', value: tabs.product.custom },
    { label: '收藏产品', value: tabs.product.collect },
  ];

  const imageTabList = [
    { label: '我的图库', value: tabs.image.my },
    { label: '平台图库', value: tabs.image.platform },
    { label: '收藏图库', value: tabs.image.collect },
  ];

  const bgTabList = [
    { label: '背景图', value: tabs.bg.image },
    { label: '背景色', value: tabs.bg.color },
    { label: '收藏背景', value: tabs.bg.collect },
  ];

  const textTabList = [{ label: '文字', value: tabs.text.text }];

  // tab产品
  const activeTabProduct = ref(tabs.product.common);
  // tab图片
  const activeTabImage = ref(tabs.image.my);
  // tab背景
  const activeTabBg = ref(tabs.bg.image);
  // 文字
  const activeText = ref(tabs.text.text);

  return {
    tabs,
    productTabList,
    imageTabList,
    bgTabList,
    textTabList,
    activeTabProduct,
    activeTabImage,
    activeTabBg,
    activeText,
  };
}
