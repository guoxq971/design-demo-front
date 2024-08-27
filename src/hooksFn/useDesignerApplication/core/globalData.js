import { computed, ref } from 'vue';
import { createGlobalState } from '@vueuse/core';
// utils
import { menus } from '@/views/designerApp/app/define/menu';
import { tabs } from '@/views/designerApp/app/define/tabs';
import { designers } from '@/views/designerApp/app/define/designer';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { Message, MessageBox } from 'element-ui';
import { useGlobalCollectTemplate } from '@/hooksFn/useDesignerApplication/core/template/collectTemplate';
import { useGlobalCollectImage } from '@/hooksFn/useDesignerApplication/core/image/collectImage';
import { useGlobalCollectBgImage } from '@/hooksFn/useDesignerApplication/core/bg/bgImageCollect';

export const useGlobalData = createGlobalState(() => {
  // 菜单tabs
  const { activeMenu, activeTabProduct, activeTabImage, activeTabBg, activeText } = useMenuData();

  // 模式
  const modeData = useModeData();

  // 鼠标经过
  const hover = useHover();

  // 右键菜单
  const contextmenu = useContextmenu();

  // 常量
  const defineData = useDefine();

  return {
    // 全局菜单
    activeMenu,
    activeTabProduct,
    activeTabImage,
    activeText,
    activeTabBg,
    // 模式
    modeData,
    // 鼠标经过
    hover,
    hovers: hover.hovers,
    // 右键菜单
    contextmenu,
    contextmenus: contextmenu.contextmenus,
    // 常量
    defineData,
  };
});

// 模式
function useModeData() {
  const mode = ref(designers.mode.design);
  const onMode = (val) => (mode.value = val);
  return {
    mode,
    onMode,
  };
}

// 菜单tabs
function useMenuData() {
  // menu菜单
  const activeMenu = ref(menus.product);
  // tab产品
  const activeTabProduct = ref(tabs.product.common);
  // tab图片
  const activeTabImage = ref(tabs.image.my);
  // tab背景
  const activeTabBg = ref(tabs.bg.image);
  const activeText = ref(tabs.text.text);

  return {
    activeMenu,
    activeTabProduct,
    activeTabImage,
    activeTabBg,
    activeText,
  };
}

// hover
function useHover() {
  const hovers = {
    template: 'template',
    custom: 'template_custom_detail',
    image: 'image',
  };

  const detail = ref(null);
  let time = null;

  // 类型
  const type = ref(null);
  const isTemplate = computed(() => detail.value && type.value === hovers.template);
  const isCustom = computed(() => detail.value && type.value === hovers.custom);
  const isImage = computed(() => detail.value && type.value === hovers.image);

  // 进入,离开
  const enter = (item, hoverType) => {
    hoverType && (type.value = hoverType);
    clearTimeout(time);
    if (item) detail.value = item;
  };
  const leave = () => {
    time = setTimeout(() => {
      detail.value = null;
      type.value = null;
    }, 300);
  };

  return {
    hovers,
    type,
    isTemplate,
    isCustom,
    isImage,
    detail,
    enter,
    leave,
  };
}

// 右键菜单
function useContextmenu() {
  const contextmenus = {
    template: 'template',
    image: 'image',
    bgImage: 'bgImage',
  };

  const collectTemplateService = useGlobalCollectTemplate();
  const collectImageService = useGlobalCollectImage();
  const collectBgImageService = useGlobalCollectBgImage();

  const visible = ref(false);
  const list = [{ key: '1', icon: 'el-icon-caret-left', text: '', fn: null }];

  // 模板类型
  const isTemplate = (type) => type === contextmenus.template;
  // 图片类型
  const isImage = (type) => type === contextmenus.image;
  // 背景图片类型
  const isBgImage = (type) => type === contextmenus.bgImage;
  // 是否打开是否收藏
  const isOpen = (type) => (isTemplate(type) || isImage(type) || isBgImage(type)) && isLogin();

  // 是否登陆 TODO:是否登陆
  function isLogin() {
    return true;
  }
  // 获取收藏列表
  function getCollectList(type) {
    isTemplate(type) && collectTemplateService.getList();
    isImage(type) && collectImageService.getList();
    isBgImage(type) && collectBgImageService.getList();
  }
  // 是否收藏
  function isCollect(data, type) {
    if (isTemplate(type)) return collectTemplateService.isCollect(data);
    if (isImage(type)) return collectImageService.isCollect(data);
    if (isBgImage(type)) return collectBgImageService.isCollect(data);
  }
  // 收藏
  function collect(data, type) {
    if (isTemplate(type)) return collectTemplateService.collect(data);
    if (isImage(type)) return collectImageService.collect(data);
    if (isBgImage(type)) return collectBgImageService.collect(data);
  }
  // 取消收藏
  function collectCancel(data, type) {
    if (isTemplate(type)) return collectTemplateService.collectCancel(data);
    if (isImage(type)) return collectImageService.collectCancel(data);
    if (isBgImage(type)) return collectBgImageService.collectCancel(data);
  }
  // 注册事件
  function registerFn(data, type) {
    return async () => {
      await isLogin();
      const result = isCollect(data, type);
      if (result) {
        await MessageBox.confirm('确定取消收藏？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        // 取消收藏
        await collectCancel(data, type);
      } else {
        // 收藏
        await collect(data, type);
      }
      Message.success('操作成功');

      // 重新获取收藏列表
      getCollectList(type);
    };
  }

  // 右键菜单事件
  function onContextmenu(e, data, type) {
    if (!isOpen(type)) return;
    e.preventDefault();
    // 注册事件
    const item = list[0];
    item.text = isCollect(data, type) ? '取消收藏' : '收藏';
    item.fn = registerFn(data, type);
    // 打开弹窗
    visible.value = true;
  }

  return {
    list,
    visible,
    onContextmenu,
    contextmenus,
  };
}

// 常量
function useDefine() {
  // 设计类型
  const designs = {
    image: 'image',
    bgImage: 'bgImage',
    bgColor: 'bgColor',
    text: 'text',
  };

  // 模式
  const modes = {
    preview: 'preview',
    edit: 'edit',
  };

  // 模版类型
  const templates = {
    common: 'common',
    refine: 'refine',
  };

  // 默认颜色
  const PRIMARY_COLOR = '#fc6b20';
  // 代理的防抖时间
  const DEBOUNCE_TIME = 100;

  // canvas配置
  function useCanvasConfig() {
    // 画布宽高
    const CANVAS_SIZE = 600;
    const canvas_SIZE_ORG = 500;
    const PREVIEW_CANVAS_SIZE = 90;
    const canvasDefine = {
      // 大图分辨率
      bigPixelRatio: 1500 / CANVAS_SIZE,
      // 预览图分辨率
      previewPixelRatio: (PREVIEW_CANVAS_SIZE / CANVAS_SIZE) * 2,
      // 画布宽高
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      size: CANVAS_SIZE,
      // 画布与原设计区域比例
      scale: CANVAS_SIZE / canvas_SIZE_ORG,
    };

    // 画布ID
    const createCanvasIds = {
      // 边框线
      bd: 'canvas-bd',
      // 选中框
      transformer: 'canvas-transformer',
      // 静态层
      static_layer: 'canvas-static-layer',
      // 设计层
      design_layer: 'canvas-design-layer',
      // 设计-组
      design_group: 'canvas-design-group',
      // 背景图-组
      bg_group: 'canvas-design-background-group',
      // 背景色-组
      bgc_group: 'canvas-design-background-color-group',
      // 设计标识
      design: 'canvas-design',
    };

    // canvas容器
    function getCanvasContainerId(id) {
      return 'canvasContainerId' + id;
    }

    return {
      CANVAS_SIZE,
      canvas_SIZE_ORG,
      PREVIEW_CANVAS_SIZE,
      canvasDefine,
      createCanvasIds,
      getCanvasContainerId,
    };
  }

  return {
    designs,
    modes,
    templates,
    PRIMARY_COLOR,
    DEBOUNCE_TIME,
    canvasConfig: useCanvasConfig(),
  };
}
