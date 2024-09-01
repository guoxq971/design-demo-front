import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { getCommon3dConfig, getRefineConfig } from '@/hooksFn/useGlobalDesigner/core/application/setTemplate/getTemplateConfig';
import { Message } from 'element-ui';
import { parseTemplateDetail } from '@/hooksFn/useGlobalDesigner/core/application/setTemplate/parseTemplateDetail';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { nextTick } from 'vue';
import { getTemplateInterface } from '@/hooksFn/useGlobalDesigner/core/application/setTemplate/template';

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
    useDesignerApplication().activeTemplate.value?.viewList.forEach((view) => view.destroy());
    useDesignerApplication().templateList.value = [];

    // 如果有精细模板
    if (refineConfig.list.length) {
      console.log('如果有精细模板');
      refineConfig.list.forEach((config) => {
        const template = getTemplateInterface();
        template.type = useDesignerAppConfig().template_type_refine;
        template.size = config.size;
        template.is3d = config.is3dFlag;
        template.config = config;
      });
    }

    // 通用模板可用
    if (commonConfig.is2dFlag) {
      const template = parseTemplateDetail(detail);
      template.type = useDesignerAppConfig().template_type_common;
      template.size = '';
      template.config = commonConfig.config;
      template.is3d = commonConfig.is3dFlag;
      useDesignerApplication().templateList.value.push(template);
      useTemplate(template);
    }
    // 精细模板可用
    else if (refineConfig.list.length) {
      //
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
function useTemplate(template) {
  // 初始化激活数据
  useDesignerApplication().activeTemplateId.value = template.id;
  useDesignerApplication().activeViewId.value = template.viewList[0].id;
  useDesignerApplication().activeColorId.value = template.colorList[0].id;
  useDesignerApplication().activeSizeId.value = template.sizeList[0].id;
  useDesignerApplication().activeDesignId.value = '';

  // 加载2d
  nextTick(() => {
    template.viewList.forEach((view) => view.create2DCanvas());
  });

  // 加载3d
  nextTick(() => {});

  console.log('使用模板', useDesignerApplication());
}
