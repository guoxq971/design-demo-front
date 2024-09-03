import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { DRequest, METHOD } from '@/utils/request';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { MessageBox } from 'element-ui';

/**
 * 保存产品
 * @param {import('d').save_template_type} type 保存类型
 */
export async function saveTemplate(type = useDesignerAppConfig().save_template_type_save) {
  const { activeTemplate, saveLoading, templateList } = useDesignerApplication();
  /** @type {import('d').template} template */
  const template = activeTemplate.value;
  // 保存产品
  if (type === useDesignerAppConfig().save_template_type_save) {
    // 通用
    if (template.isCommon) {
      await saveTemplateCommon(template);
    }
    // 精细
    else if (template.isRefine) {
      try {
        saveLoading.value = true;
        // 校验-至少设计一个尺码
        if (!templateList.value.some((t) => t.isRefine && t.detail && t.hasDesign())) {
          Message.warning('请至少设计一个尺码');
          return;
        }
        // 校验-未设计视图弹窗
        await refineTip(template);
        // 保存产品
        const paramList = [];
        for (let t of templateList.value.filter((t) => t.isRefine && t.detail)) {
          const param = await t.getSubmitData();
          param.productType.size = t.size;
          param.productType.sizeType = t.sizeType;
          paramList.push(param);
        }
        // 保存产品
        const res = await DRequest(`/designer-web/CMProductWithSizeAct/saveProductWithSize.act`, METHOD.POST, paramList, { timeout: 3 * 60 * 1000 });
        if (!res.data.status) {
          Message.warning('保存产品失败');
          return;
        }
        Message.success('保存成功');
      } catch (e) {
        console.error('保存产品失败-精细产品', e);
      } finally {
        saveLoading.value = false;
      }
    }
  }
  // 全颜色保存
  else if (type === useDesignerAppConfig().save_template_type_color) {
    if (!template?.detail?.isCanSynthesis) {
      Message.warning('当前产品不支持全颜色保存');
      return;
    }
    await saveTemplateCommon(template, useDesignerAppConfig().save_template_type_color);
  } else {
    Message.warning('保存产品失败, type 错误');
    console.error('保存产品失败, type 错误');
  }
}

/**
 * 保存通用产品
 * @param {import('d').template} template
 * @param {import('d').save_template_type} saveType
 * @returns {Promise<void>}
 */
async function saveTemplateCommon(template, saveType = useDesignerAppConfig().save_template_type_save) {
  try {
    useDesignerApplication().saveLoading.value = true;
    const param = await template.getSubmitData(saveType);
    const res = await DRequest(`/designer-web/CMProductAct/saveProduct.act`, METHOD.POST, param, { timeout: 3 * 60 * 1000 });
    if (!res.data.status) {
      Message.warning('保存产品失败');
      return;
    }
    Message.success('保存成功');
  } catch (e) {
    console.error('保存产品失败-通用产品', e);
  } finally {
    useDesignerApplication().saveLoading.value = false;
  }
}

/**
 * 精细提示
 * @param {import('d').template} template
 * @returns {Promise<void>}
 */
async function refineTip(template) {
  const sizeCount = template.sizeList.length;
  const viewCount = template.viewList.length;
  const trList = useDesignerApplication().templateList.value.filter((t) => t.isRefine);
  const vIsDesign = (v) => v.designList.some((d) => d.attrs.visible);
  const contentList = trList.map(
    (t) => `
                      <div>
                        <span>${t.size}</span>
                        <span>：</span>
                        ${t.viewList.map((v) => `<span style="color:${vIsDesign(v) ? '#06D072' : '#E01F21'}">【${v.name}】</span>`)}
                      </div>`,
  );
  await MessageBox.confirm(
    `
            <div>
                <div>当前【精细设计】模式</div>
                <div>该产品 ${sizeCount} 个尺码，各 ${viewCount} 个设计面</div>
                ${contentList.map((c) => `<div>${c}</div>`).join('')}
                <div>是否继续保存?</div>
            </div>
              `,
    '提示',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    },
  );
}
