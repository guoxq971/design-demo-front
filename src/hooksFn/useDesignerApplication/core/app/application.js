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
import { createBgColor } from '@/hooksFn/useDesignerApplication/core/app/utils/craeteBgColor';
import { CreateText } from '@/hooksFn/useDesignerApplication/core/app/utils/createText';
// packages
import { useContainerEL } from './packages/containerEl';
import { useTemplateGroup } from './packages/templateGroup';
import { useTemplateData } from './packages/templateData';

export const useGlobalApplication = createGlobalState(() => {
  // 模板基础数据
  const templateData = useTemplateData();
  // 模板组合数据
  const templateGroupData = useTemplateGroup(templateData);
  // 设置模板
  const { setTemplate } = useSetTemplate(templateData);
  // 设置设计
  const { setDesignImage, setDesignBgColor, setDesignText, designHandle } = useSetDesign(templateData);
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
    setDesignBgColor,
    setDesignText,
    // 设计图操作
    designHandle,
  };
});

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

  // 设置设计图
  async function setDesignImage(detail, view = null) {
    view = view === null ? activeView.value : view;
    const dpi = activeTemplate.value.detail.dpi;
    if (!detail.isBg) {
      if (!imgMax(view)) return Promise.reject('设计图数量限制');
      await createImage(detail, view, dpi);
    } else {
      if (!bgImgMax()) return Promise.reject('背景图数量限制');
      activeTemplate.value.viewList.forEach((view) => {
        createImage(detail, view, dpi);
      });
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
      const isSome = view.designList.some((e) => e?.detail?.isBg);
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

  // 设置背景色
  function setDesignBgColor(color) {
    activeTemplate.value.viewList.forEach((view) => {
      createBgColor(color, view);
    });
  }

  // 设置文字
  function setDesignText(param, view = null) {
    view = view === null ? activeView.value : view;
    CreateText(param, view);
  }

  // 设计图操作
  const designHandle = useDesignHandle(templateData);

  return {
    setDesignImage,
    setDesignBgColor,
    setDesignText,
    designHandle,
  };
}

// 设计图操作
function useDesignHandle(templateData) {
  const { activeView, activeTemplate } = templateData;
  const { designs } = useGlobalData().defineData;

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
    // 删除背景图
    if (design.type === designs.image) _delFn(_view, design.uuid);
    // 删除设计图
    else if (design.type === designs.bgImage) _delBgImg();
    // 删除背景色
    else if (design.type === designs.bgColor) _delBgColor();

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
        const attrs = _view2.designList.find((e) => e.type === designs.bgImage);
        _delFn(_view2, attrs.uuid);
      });
    }
    // 删除背景色
    function _delBgColor() {
      activeTemplate.value.viewList.forEach((_view2) => {
        const attrs = _view2.designList.find((e) => e.type === designs.bgColor);
        _delFn(_view2, attrs.uuid);
      });
    }
  }

  // 显示隐藏
  function visibleDesign(design, _view = null) {
    // 非背景图
    if (design.type === designs.image) _visibleFn(_view, design.uuid);
    // 背景图
    else if (design.type === designs.bgImage) _visibleBgImg();
    // 背景色
    else if (design.type === designs.bgColor) _visibleBgColor();

    // 显示隐藏函数
    function _visibleFn(_view, uuid) {
      const { helper, view } = _getHelper(_view);
      // vue数据通过proxy
      // 隐藏节点
      helper.setVisible(uuid);
    }
    // 显示隐藏背景图
    function _visibleBgImg() {
      activeTemplate.value.viewList.forEach((_view2) => {
        const attrs = _view2.designList.find((e) => e.type === designs.bgImage);
        _visibleFn(_view2, attrs.uuid);
      });
    }
    // 显示隐藏背景色
    function _visibleBgColor() {
      activeTemplate.value.viewList.forEach((_view2) => {
        const attrs = _view2.designList.find((e) => e.type === designs.bgColor);
        _visibleFn(_view2, attrs.uuid);
      });
    }
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
