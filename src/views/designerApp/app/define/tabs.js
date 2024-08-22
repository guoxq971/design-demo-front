export const tabs = {
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

export const productTabList = [
  { label: '通用产品', value: tabs.product.common },
  { label: '定制模板', value: tabs.product.custom },
  { label: '收藏产品', value: tabs.product.collect },
];

export const imageTabList = [
  { label: '我的图库', value: tabs.image.my },
  { label: '平台图库', value: tabs.image.platform },
  { label: '收藏图库', value: tabs.image.collect },
];

export const bgTabList = [
  { label: '背景图', value: tabs.bg.image },
  { label: '背景色', value: tabs.bg.color },
  { label: '收藏背景', value: tabs.bg.collect },
];

export const textTabList = [{ label: '文字', value: tabs.text.text }];
