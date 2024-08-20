// 默认首页
export const defaultHome = '/fnHome';
// 控制台
export const defaultControl = '/fn/control';
// 购物车
export const defaultShopCart = '/fn/shoppingCart';
export const defaultShopCart2 = '/fn/shoppingCart2';
// 消息中心
export const defaultMessageCenter = '/fn/messageCenter';
// 批量付款页面
export const defaultBatchPay = '/fn/order/fbm/batchPay';

// 默认登录页
export const defaultLogin = '/fnHome';

// 设计器路由
export const designerUrl = '/designApp/designPlatform/fnDesigner';

// 路由白名单
export const whiteList = [
  { label: '404', value: '/404', isMenu: false }, // isMenu 是否需要刷新菜单栏
  { label: '403', value: '/403', isMenu: false },
  { label: '首页', value: defaultHome, isMenu: false },
  { label: '全部商品', value: '/fn/product/selection/productAll', isMenu: true },
  { label: '设计器', value: designerUrl, isMenu: true },
  { label: '商品详情', value: '/fn/productInfo', isMenu: true },
  { label: '批量付款页面', value: defaultBatchPay, isMenu: false },
];

// 路由白名单(登录状态下)
export const whiteListLogin = [
  //
  { label: '控制台', value: defaultControl },
  { label: '购物车', value: defaultShopCart },
  { label: '购物车2', value: defaultShopCart2 },
  { label: '消息中心', value: defaultMessageCenter },
];
export const whiteListLoginRoutes = whiteListLogin.map((item) => item.value);

// 白名单路由集合
export const whiteListRoutes = whiteList.map((item) => item.value);
