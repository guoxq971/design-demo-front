import { computed, nextTick, shallowRef } from 'vue';
// utils
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { parseTemplate } from './parseTemplateDeatil';
import { useCanvas } from '../useCanvas';
import { GRequest, METHOD } from '@/utils/request';
import { Message } from 'element-ui';
import * as THREE from 'three';
import { getCommon3dConfig, getRefineConfig } from '@/hooksFn/useGlobalDesigner/core/app/useSetTemplate/getConfig';
import { getDesignList } from '@/hooksFn/useGlobalDesigner/core/app/useSetTemplate/getDesignList';
import { Template } from '@/hooksFn/useGlobalDesigner/core/app/useSetTemplate/template';
import { CreateThree } from '@/hooksFn/useGlobalDesigner/core/app/useThree/CreateThree';
import { useDebounceFn, useImage } from '@vueuse/core';
import { getMaterialName, getMeshByViewId, getViewByMaterialName, updateMesh } from '@/hooksFn/useGlobalDesigner/core/app/useThree/updateMesh';
import { registerMouseEvent } from '@/hooksFn/useGlobalDesigner/core/app/useThree/registerMouseEvent';
import { createTemplateThree } from '@/hooksFn/useGlobalDesigner/core/app/useThree';

export async function useSetTemplate(detail) {
  try {
    useGlobalDesigner().app.loading.value = true;
    // 解析模板详情
    const templateNo = detail.templateNo;
    const { templateType } = useGlobalDesigner().app.config;

    // 通用模板的3d数据
    const commonResult = await getCommon3dConfig(templateNo);
    // 通用模板可用
    if (commonResult.isFlag) {
      useGlobalDesigner().app.destroy();
      const template = new Template();
      template.templateNo = detail.templateNo;
      template.type = templateType.common;
      template.config = commonResult.config;
      template.detail = detail;
      useGlobalDesigner().app.templateList.value.push(template);
      useTemplate(template);
      console.log('使用通用模板');
    }
    // 精细模板的配置
    const refineResult = await getRefineConfig(templateNo);
    // 通用模板不可用, 且精细模板不存在可用
    if (!commonResult.isFlag && !refineResult.list.length) {
      console.log('模板不可用');
      Message.warning(`模板${templateNo}不可用`);
    }
    // 通用模板不可用, 精细模板可用
    else if (!commonResult.isFlag && refineResult.list.length) {
      console.log('通用模板不可用, 精细模板可用');
      useGlobalDesigner().app.destroy();
      refineResult.list.forEach((refine) => {
        const template = new Template();
        template.templateNo = detail.templateNo;
        template.type = templateType.refine;
        template.size = refine.size;
        template.config = refine;
        useGlobalDesigner().app.templateList.value.push(template);
      });
    }
    // 通用模板可用, 精细模板可用
    else if (commonResult.isFlag && refineResult.list.length) {
      console.log('通用模板可用, 精细模板可用');
      refineResult.list.forEach((refine) => {
        const template = new Template();
        template.templateNo = detail.templateNo;
        template.type = templateType.refine;
        template.size = refine.size;
        template.config = refine;
        useGlobalDesigner().app.templateList.value.push(template);
      });
    } else {
      console.log('特殊情况');
    }
  } finally {
    useGlobalDesigner().app.loading.value = false;
  }
}

/**
 * 使用模板
 * @param {Template} template
 */
function useTemplate(template) {
  const app = useGlobalDesigner().app;
  const isCommon = template.type === app.config.templateType.common;
  const isRefine = template.type === app.config.templateType.refine;

  // 详情不存在,通用模板
  if (!template.detail && isCommon) {
    console.error('通用模板,模板详情不存在');
    return;
  }
  // 详情不存在,精细模板
  else if (!template.detail && isRefine) {
    // TODO: 精细模板详情
  }
  // 视图不存在
  else if (!template.viewList) {
    const parse = parseTemplate(template.detail);
    template.viewList = parse.viewList;
    template.sizeList = parse.sizeList;
    template.colorList = parse.colorList;
    template.viewList.forEach((view) => {
      view.base64 = ''; // 预览图
      view.textureCanvas = shallowRef(null); // 3d texture canvas
      view.canvasNodes = null; // canvas节点
      // 设计列表
      view.designList = getDesignList(view);
    });
  }

  // 销毁上一个3d
  if (app.activeTemplateId.value && app.activeTemplate.value?.three) {
    app.activeTemplate.value.three.destroy();
  }

  // 初始化
  app.activeTemplateId.value = template.detail.id;
  app.activeViewId.value = template.viewList[0].id;
  app.activeColorId.value = template.colorList[0].id;
  app.activeSizeId.value = template.sizeList[0].id;

  // 加载2d
  nextTick(() => {
    template.viewList.forEach((view) => {
      view.canvasNodes = useCanvas().create(view);
    });
  });

  // 加载3d
  if (template.has3d() && !template.three) {
    nextTick(() => createTemplateThree(template));
  }
}
