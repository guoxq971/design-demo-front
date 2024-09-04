import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { getCommon3dConfig, getRefineConfig, getTemplateDetailWithSize } from '@/hooksFn/useGlobalDesigner/core/application/template/getTemplateConfig';
import { Message } from 'element-ui';
import { parseTemplateDetail } from '@/hooksFn/useGlobalDesigner/core/application/template/parseTemplateDetail';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { nextTick } from 'vue';
import { getTemplateInterface } from '@/hooksFn/useGlobalDesigner/core/application/template/templateInterface';
import { getExportConfig } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/exportConfig';

/**
 * 设置模板
 * @param {import('d').templateDetail} detail
 */
export async function setTemplate(detail) {
  try {
    useDesignerApplication().loading.value = true;
    const templateNo = detail.templateNo;

    // TODO:需要做一个 about 取消掉之前的请求
    // 获取通用模板
    const commonConfig = await getCommon3dConfig(templateNo);
    // 获取精细模板
    const refineConfig = await getRefineConfig(templateNo);
    // 清空上一个模板
    useDesignerApplication().templateList.value?.forEach((t) => t.destroy && t.destroy());
    useDesignerApplication().templateList.value = [];

    // 如果有精细模板
    if (refineConfig.list.length) {
      refineConfig.list.forEach((config) => {
        const template = getTemplateInterface();
        template.type = useDesignerAppConfig().template_type_refine;
        template.isRefine = true;
        template.size = config.size;
        template.sizeType = config.sizeType;
        template.is3d = config.is3dFlag;
        template.config = config;
        useDesignerApplication().templateList.value.push(template);
      });
    }

    // 通用模板可用
    if (commonConfig.is2dFlag) {
      const template = parseTemplateDetail(detail);
      template.type = useDesignerAppConfig().template_type_common;
      template.isCommon = true;
      template.size = '';
      template.sizeType = '';
      template.config = commonConfig.config;
      template.is3d = commonConfig.is3dFlag;
      useDesignerApplication().templateList.value.push(template);
      await useTemplate(template);
    }
    // 精细模板可用
    else if (refineConfig.list.length) {
      const template = useDesignerApplication().templateList.value[0];
      await useTemplate(template);
    }
    // 都不可用
    else {
      Message.warning(`模板${templateNo}不可用`);
    }
  } catch (e) {
    console.error('设置模板 出现错误 e', e);
  } finally {
    useDesignerApplication().loading.value = false;
  }
}

/**
 * 使用模板
 * @param {import('d').template} template
 */
export async function useTemplate(template) {
  // 如果是精细模板, 获取模板详情
  if (!template.detail && template.isRefine) {
    try {
      useDesignerApplication().loading.value = true;
      template.detail = await getTemplateDetailWithSize(template.config.templateNo, template.size);
      const t = parseTemplateDetail(template.detail);
      template.viewList = t.viewList;
      template.colorList = t.colorList;
      // 过滤掉不可用的尺码
      const refineList = useDesignerApplication()
        .templateList.value.filter((t) => t.isRefine)
        .map((t) => t.size);
      template.sizeList = t.sizeList.filter((s) => refineList.includes(s.size));
      template.id = t.id;
      template.templateNo = t.templateNo;
      template.detail = t.detail;
    } catch (e) {
      console.error('使用模板 出现错误 e', e);
    } finally {
      useDesignerApplication().loading.value = false;
    }
  }

  // 获取模板导出配置
  if (!template.isGetExportConfig) {
    await getExportConfig(template);
  }

  // 清除上一个模板的数据,2dCanvas,3dCanvas,3dMesh,3dTexture;保存2d设计数据
  const old_t = useDesignerApplication().activeTemplate.value;
  if (old_t) old_t.sleep();

  // 初始化激活数据
  useDesignerApplication().activeTemplateId.value = template.uuid;
  nextTick(() => {
    useDesignerApplication().activeViewId.value = template.viewList[0].id;
    useDesignerApplication().activeColorId.value = template.colorList[0].id;
    useDesignerApplication().activeSizeId.value = template.sizeList[0].id;
    useDesignerApplication().activeDesignId.value = '';
  });

  // 加载2d
  nextTick(() => {
    template.viewList.forEach((view) => view.create2DCanvas());
  });

  // 加载模板3d
  nextTick(() => {
    template.create3D().then((_) => {
      // 加载模板多角度3d
      template.createMulti3D();
    });
  });

  // 激活的模板是否是睡眠状态
  nextTick(() => template.isSleep && template.unsleep());

  console.log('使用模板', useDesignerApplication());
}
