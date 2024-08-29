import { ComputedRef, Ref, computed, ref } from 'vue';
import { useSetTemplate } from './useSetTemplate';
import { useContainer } from './useContainer';
import { useDesign } from '@/hooksFn/useGlobalDesigner/core/app/useDesign';
import { useDesignerAppTool } from '@/hooksFn/useGlobalDesigner/core/app/useDesignerTool';
import { Template } from '@/hooksFn/useGlobalDesigner/core/app/useSetTemplate/template';
import { createEventHook } from '@vueuse/core';

export function useApp() {
  // 配置
  const config = useConfig();
  const watchBase64Event = createEventHook();

  const loading = ref(false);
  const threeLoading = ref(false);
  /**@type {Ref<Template[]>}*/
  const templateList = ref([]);
  const activeTemplateId = ref('');
  const activeViewId = ref('');
  const activeColorId = ref('');
  const activeSizeId = ref('');
  const activeDesignId = ref('');
  const mode = ref(config.modes.preview);

  /**@type {ComputedRef<Template>} 当前激活的模板*/
  const activeTemplate = computed(() => templateList.value.find((item) => item.detail?.id === activeTemplateId.value));
  /**当前激活的视图*/
  const activeView = computed(() => activeTemplate.value?.viewList.find((item) => item.id === activeViewId.value));
  // 当前激活的颜色
  const activeColor = computed(() => activeTemplate.value?.colorList.find((item) => item.id === activeColorId.value));
  // 当前激活的颜色
  // 当前使用的产品图,根据颜色和视图获取
  const getActiveColorViewImage = computed(() => {
    return (viewId) => {
      const result = activeColor.value?.views.find((item) => item.id === viewId);
      return {
        texture: result?.texture,
        image: result?.image,
      };
    };
  });
  // 获取指定视图的base64
  const getBase64ByViewId = computed(() => {
    return (viewId) => {
      return activeTemplate.value.viewList.find((item) => item.id === viewId)?.base64;
    };
  });

  // 设置视图id
  function setViewId(viewId) {
    activeViewId.value = viewId;
  }
  // 设置颜色id
  function setColorId(colorId) {
    activeColorId.value = colorId;
  }
  // 设置尺码id
  function setSizeId(sizeId) {
    activeSizeId.value = sizeId;
  }

  // 设计
  const design = useDesign();

  // 销毁所有数据
  function destroy() {
    templateList.value.forEach((template) => {
      // 销毁3d
      if (template.three) {
        template.three.destroy();
        template.three = null;
      }
      // 销毁2d
      template.viewList?.forEach((view) => {
        // 销毁设计
        if (view.designList && view.designList.length) {
          view.designList.forEach((design) => {
            if (design.design) {
              design.design.destroy();
            }
          });
        }
        // 销毁base64
        if (view.base64) {
          URL.revokeObjectURL(view.base64);
        }
        view.base64 = null;
        // 销毁节点
        if (view.canvasNodes) {
          Object.keys(view.canvasNodes).forEach((key) => {
            view.canvasNodes[key]?.destroy();
          });
          view.canvasNodes = null;
        }
      });
    });
    templateList.value = [];
  }

  return {
    watchBase64Event,
    destroy,
    loading,
    threeLoading,
    // 模式
    mode,
    // 模板
    templateList,
    activeTemplateId,
    activeTemplate,
    // 视图
    activeViewId,
    activeView,
    setViewId,
    getBase64ByViewId,
    // 颜色
    activeColorId,
    activeColor,
    getActiveColorViewImage,
    setColorId,
    // 尺码
    activeSizeId,
    setSizeId,
    // 设计
    activeDesignId,
    // 操作
    setTemplate: useSetTemplate,
    setDesignImage: design.setDesignImage,
    setDesignBgColor: design.setDesignBgColor,
    tool: useDesignerAppTool,
    container: useContainer(),
    config,
  };
}

function useConfig() {
  // 配置
  const CANVAS_SIZE = 600;
  const canvas_SIZE_ORG = 500;
  const PREVIEW_CANVAS_SIZE = 90;
  const canvas_big_size = 1200;
  const config = {
    templateType: {
      common: 'common',
      refine: 'refine',
    },
    // 设计类型
    designs: {
      image: 'image',
      bgImage: 'bgImage',
      bgColor: 'bgColor',
      text: 'text',
    },
    // 模式
    modes: {
      preview: 'preview',
      edit: 'edit',
    },
    canvas_SIZE_ORG,
    DEBOUNCE_TIME: 100,
    PRIMARY_COLOR: '#fc6b20',
    canvasDefine: {
      // 大图分辨率
      bigPixelRatio: canvas_big_size / CANVAS_SIZE,
      // 预览图分辨率
      previewPixelRatio: PREVIEW_CANVAS_SIZE / CANVAS_SIZE,
      // 画布宽高
      width: CANVAS_SIZE,
      height: CANVAS_SIZE,
      size: CANVAS_SIZE,
      // 画布与原设计区域比例
      scale: CANVAS_SIZE / canvas_SIZE_ORG,
    },
    // 画布与原设计区域比例
    canvas_scale: CANVAS_SIZE / canvas_SIZE_ORG,
    canvas_big_size: canvas_big_size,
    canvas_preview_size: PREVIEW_CANVAS_SIZE,
    // canvas容器
    getCanvasContainerId(id) {
      return 'canvasContainerId' + id;
    },
    // 画布ID
    createCanvasIds: {
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
      // 车线-printout-d
      design_printout_d: 'canvas-design-printout-d',
      // 车线-printout-v
      design_printout_v: 'canvas-design-printout-v',
      // 车线-黑色-绘制区域
      design_draw_black: 'canvas-design-draw-black',
    },
  };

  return config;
}
