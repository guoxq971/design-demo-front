import { createEventHook, createGlobalState, useDebounceFn, useElementBounding } from '@vueuse/core';
import { watchEffect, ref, computed, reactive, nextTick, set, isRef } from 'vue';
// utils
import { parseTemplate, createCanvas, useCanvasHelper } from './utils/utils';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
import { createImage } from '@/hooksFn/useDesignerApplication/core/app/utils/createImage';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { useGlobalCollectBgImage } from '@/hooksFn/useDesignerApplication/core/bg/bgImageCollect';
import { useGlobalCollectImage } from '@/hooksFn/useDesignerApplication/core/image/collectImage';
import { Message } from 'element-ui';

export const useGlobalApplication = createGlobalState(() => {
  // 模板基础数据
  const templateData = useTemplateData();
  // 模板组合数据
  const templateGroupData = useTemplateGroup(templateData);
  // 设置模板
  const { setTemplate } = useSetTemplate(templateData);
  // 设置设计
  const { setDesignImage, setDesignBgImage, designHandle } = useSetDesign(templateData);
  // 容器
  const containerElData = useContainerEL();

  return {
    // 容器
    containerElData,
    // 模板基础数据
    templateData,
    templateGroupData,
    // 设置模板
    setTemplate,
    // 添加设计图
    setDesignImage,
    setDesignBgImage,
    // 设计图操作
    designHandle,
  };
});

// 模板基础数据
function useTemplateData() {
  // 模板列表[通用,精细]
  const templateList = ref([]);
  // 模板id
  const activeTemplateId = ref('');
  // 模板 (模板列表>模板)
  const activeTemplate = computed(() => templateList.value?.find((item) => item.detail.id === activeTemplateId.value));
  // 设置模板id
  const setTemplateId = (templateId) => (activeTemplateId.value = templateId);

  // 视图列表
  const activeViewList = computed(() => activeTemplate.value?.viewList);
  // 视图id
  const activeViewId = ref('');
  // 视图 (模板>视图列表>视图)
  const activeView = computed(() => activeViewList.value?.find((item) => item.id === activeViewId.value));
  // 设置视图id
  const setViewId = (viewId) => (activeViewId.value = viewId);

  // 尺码列表
  const activeSizeList = computed(() => activeTemplate.value?.sizeList);
  //尺码id
  const activeSizeId = ref('');
  // 尺码 (模板>尺码列表>尺码)
  const activeSize = computed(() => activeSizeList.value?.find((item) => item.id === activeSizeId.value));
  // 设置尺码id
  const setSizeId = (sizeId) => (activeSizeId.value = sizeId);

  // 颜色列表
  const activeColorList = computed(() => activeTemplate.value?.colorList);
  // 颜色id
  const activeColorId = ref('');
  // 颜色 (模板>颜色列表>颜色)
  const activeColor = computed(() => activeColorList.value?.find((item) => item.id === activeColorId.value));
  // 设置颜色id
  const setColorId = (colorId) => (activeColorId.value = colorId);

  return {
    // 模板
    templateList,
    activeTemplateId,
    activeTemplate,
    setTemplateId,
    // 视图
    activeViewId,
    activeView,
    setViewId,
    // 尺码
    activeSizeId,
    activeSize,
    setSizeId,
    // 颜色
    activeColorId,
    activeColor,
    setColorId,
  };
}

// 模板组合数据
function useTemplateGroup(templateData) {
  const { templateList, activeTemplateId, activeTemplate, setViewId, activeViewId, activeView, activeSizeId, activeSize, activeColorId, activeColor } = templateData;

  // 产品图,背景图: 根据当前激活的颜色和视图获取
  const getViewImageByActiveColor = computed(() => {
    return (viewId) => {
      const result = activeColor.value?.views.find((item) => item.id === viewId);
      return {
        texture: result?.texture,
        image: result?.image,
      };
    };
  });

  // 获取base64
  const getBase64ByViewId = computed(() => {
    return (viewId) => activeTemplate.value?.viewList?.find((item) => item.id === viewId)?.base64;
  });

  // 设计列表(激活的)
  const activeViewDesignList = computed(() => activeView.value?.designList || []);
  // 翻转 activeViewDesignList
  const activeViewDesignListReverse = computed(() => activeViewDesignList.value.slice().reverse());

  return {
    getViewImageByActiveColor,
    getBase64ByViewId,
    activeViewDesignList,
    activeViewDesignListReverse,
  };
}

// 设置模板
function useSetTemplate(templateData) {
  const { templateList, activeTemplateId, activeViewId, activeColorId, activeSizeId } = templateData;
  const { modes } = useGlobalData().defineData;

  // 设置模板
  function setTemplate(detail) {
    // 解析模板详情
    const template = parseTemplate(detail);
    const { viewList, colorList, sizeList } = template;
    viewList.forEach((view) => {
      view.base64 = ''; // 预览图
      view.designList = []; // 设计列表
      view.canvasNodes = null; // canvas节点
    });
    // 数据初始化
    templateList.value = [];
    templateList.value.push(template);
    activeTemplateId.value = detail.id;
    activeViewId.value = template.viewList[0].id;
    activeColorId.value = template.colorList[0].id;
    activeSizeId.value = template.sizeList[0].id;
    // 设置canvas
    nextTick(() => {
      template.viewList.forEach((view) => {
        createCanvas(view);
      });
    });
  }

  return {
    setTemplate,
  };
}

// 设置设计
function useSetDesign(templateData) {
  // 模板基础数据
  const { templateList, activeTemplateId, activeTemplate, activeViewId, activeView, activeColorId, activeSizeId } = templateData;
  const { defineData } = useGlobalData();
  const { designs, DEBOUNCE_TIME } = defineData;

  // 设置图片 (默认是设计图)
  async function _setImage(detail, view = null) {
    view = view === null ? activeView.value : view;
    // 帮助函数
    const helper = useCanvasHelper(view);
    // 模板dpi
    const templateDpi = activeTemplate.value?.detail.dpi;
    // 创建设计图片节点
    const { attrs, onUpdate, onSort } = await createImage(detail, view, templateDpi);
    attrs['type'] = designs.image; //类型
    attrs['url'] = AppUtil.getImageUrl(detail); //节点使用的图片地址
    attrs['previewUrl'] = detail.previewImg; //预览图地址
    attrs['name'] = detail.name; //图片名称
    attrs['detail'] = detail; //图片详情
    attrs['viewId'] = view.id;
    attrs['templateId'] = activeTemplateId.value;
    view.designList.push(attrs);

    // 设计更新时,同步设计属性
    onUpdate(useDebounceFn(({ key, value }) => attrs && set(attrs, key, value), DEBOUNCE_TIME));
    // 设计排序时,同步下标
    onSort(() => helper.sortDesignList(view.designList));

    return {
      attrs,
    };
  }

  // 设置设计图
  async function setDesignImage(detail, view = null) {
    view = view === null ? activeView.value : view;
    if (!detail.isBg) {
      if (imgMax(view)) await _setImage(detail);
    } else {
      if (bgImgMax()) await setDesignBgImage(detail);
    }
    // 背景图限制
    function bgImgMax() {
      // 设计图数量限制
      for (let i = 0; i < activeTemplate.value.viewList.length; i++) {
        const v = activeTemplate.value.viewList[i];
        if (v.designList.length >= 5) {
          Message.warning(`每个图层最多5张设计图, 图层${i + 1}已达到最大数量`);
          return false;
        }
      }
      // 背景图唯一限制
      const isSome = view.designList.some((e) => e.detail.isBg);
      if (isSome) {
        Message.warning('背景图已存在,只能添加一个背景图');
        return false;
      }
      return true;
    }

    // 设计图限制
    function imgMax(view) {
      // 设计图数量限制
      if (view.designList.length >= 5) {
        Message.warning('每个图层最多5张设计图');
        return false;
      }
      return true;
    }
  }

  // 设置背景图
  async function setDesignBgImage(detail) {
    const uuidBg = AppUtil.uuid();
    for (const view of activeTemplate.value.viewList) {
      _setImage(detail, view).then(({ attrs }) => {
        attrs['type'] = designs.bgImage;
        attrs['previewUrl'] = detail.designImg;
        attrs['name'] = detail.imageName; //图片名称
        attrs['uuidBg'] = uuidBg;
      });
    }
  }

  // 设置背景色
  function setDesignBgColor(color) {}

  // 设计图操作
  const designHandle = useDesignHandle(templateData);

  return {
    setDesignImage,
    designHandle,
  };
}

// 设计图操作
function useDesignHandle(templateData) {
  const { activeView, activeTemplate } = templateData;

  // canvas帮助函数
  function _getHelper(view) {
    view = view === null ? activeView.value : view;
    const helper = useCanvasHelper(view);
    // 查找设计图
    function findDesign(uuid) {
      return view.designList.find((item) => item.uuid === uuid);
    }
    // 查找设计图索引
    function findDesignIndex(uuid) {
      return view.designList.findIndex((item) => item.uuid === uuid);
    }
    return {
      helper,
      view,
      findDesign,
      findDesignIndex,
    };
  }

  // 删除
  function delDesign(design, _view = null) {
    // 删除非背景图
    if (!design.detail.isBg) _delFn(_view, design.uuid);
    // 删除背景图
    else _delBgImg();

    // 删除函数
    function _delFn(_view, uuid) {
      const { findDesignIndex, helper, view } = _getHelper(_view);
      // 删除vue数据
      const idx = findDesignIndex(design.uuid);
      view.designList.splice(idx, 1);
      // 删除canvas节点
      helper.delNode(uuid);
    }
    // 删除背景图
    function _delBgImg() {
      activeTemplate.value.viewList.forEach((_view2) => {
        const attrs = _view2.designList.find((e) => e.uuidBg === design.uuidBg);
        _delFn(_view2, attrs.uuid);
      });
    }
  }

  // 显示隐藏
  function visibleDesign(design, _view = null) {
    const { helper, view } = _getHelper(_view);
    // vue数据通过proxy
    // 隐藏节点
    helper.setVisible(design.uuid);
  }

  // 置顶
  function topDesign(design, _view = null) {
    const { helper, view } = _getHelper(_view);
    // 置顶
    helper.topNode(design.uuid);
  }

  // 置底
  function bottomDesign(design, _view = null) {
    const { helper, view } = _getHelper(_view);
    // 置底
    helper.bottomNode(design.uuid);
  }

  // 是否收藏
  function isCollect(design) {
    if (design.detail.isBg) {
      return useGlobalCollectBgImage().isCollect(design.detail);
    } else {
      return useGlobalCollectImage().isCollect(design.detail);
    }
  }

  // 收藏
  const setCollect = useDebounceFn(_setCollect, 300);
  async function _setCollect(design) {
    const isBg = design.detail.isBg;
    const _isCollect = isCollect(design);
    let api;
    let getList;
    if (_isCollect && isBg) {
      api = useGlobalCollectBgImage().collectCancel(design.detail);
      getList = useGlobalCollectBgImage().getList;
    } else if (!_isCollect && isBg) {
      api = useGlobalCollectBgImage().collect(design.detail);
      getList = useGlobalCollectBgImage().getList;
    } else if (_isCollect && !isBg) {
      api = useGlobalCollectImage().collectCancel(design.detail);
      getList = useGlobalCollectImage().getList;
    } else if (!_isCollect && !isBg) {
      api = useGlobalCollectImage().collect(design.detail);
      getList = useGlobalCollectImage().getList;
    } else {
      console.log('收藏失败');
    }

    api?.then((_) => {
      Message.success('操作成功');
      getList();
    });
  }

  return {
    isCollect,
    delDesign,
    visibleDesign,
    topDesign,
    bottomDesign,
    setCollect,
  };
}

// 容器
function useContainerEL() {
  // canvas容器(konva舞台)
  const canvasElRef = ref(null);
  // img(产品图)
  const imgElRef = ref(null);

  // 组装属性
  const canvasRect = reactive(useElementBounding(canvasElRef));
  const imgRect = reactive(useElementBounding(imgElRef));

  // 钩子
  const event = createEventHook();

  // 容器rect
  const containerRect = ref({});
  watchEffect(
    () => {
      // 舞台的宽高
      const stageWidth = canvasRect.width;
      const stageHeight = canvasRect.height;

      // 产品绘制区域的宽高
      const drawWidth = imgRect.width;
      const drawHeight = imgRect.height;

      // 产品绘制区域相当于舞台的偏移量
      const offsetX = imgRect.left - canvasRect.left;
      const offsetY = imgRect.top - canvasRect.top;

      const result = {
        canvasRect,
        imgRect,
        stageWidth,
        stageHeight,
        drawWidth,
        drawHeight,
        offsetX,
        offsetY,
      };

      // 触发钩子
      event.trigger(result);

      containerRect.value = result;
    },
    { flush: 'post' },
  );

  return {
    canvasElRef,
    imgElRef,
    containerRect,
    onUpdate: event.on,
  };
}
