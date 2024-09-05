import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { getCommon3dConfig, getRefineConfig, getTemplateDetailWithSize } from '@/hooksFn/useGlobalDesigner/core/application/template/getTemplateConfig';
import { Message } from 'element-ui';
import { parseTemplateDetail } from '@/hooksFn/useGlobalDesigner/core/application/template/parseTemplateDetail';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { nextTick } from 'vue';
import { getTemplateInterface } from '@/hooksFn/useGlobalDesigner/core/application/template/templateInterface';
import { getExportConfig } from '@/hooksFn/useGlobalDesigner/core/application/canvas3d/exportConfig';
import { GRequest, METHOD } from '@/utils/request';
import { cloneDeep, pick } from 'lodash';

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
    // 临时保留上一个模板的设计
    const prevTemplate = cloneDeep(useDesignerApplication().activeTemplate.value?.getFnData());
    // 清空上一个模板
    useDesignerApplication().templateList.value?.forEach((t) => t.destroy && t.destroy());
    useDesignerApplication().templateList.value = [];
    useDesignerApplication().templatePriceList.value = [];
    useDesignerApplication().templateCraft.value = '';

    // 获取模板价格
    useDesignerApplication().priceLoading.value = true;
    GRequest(`/base-web/CMDesignerAct/listTemplatePrice`, METHOD.GET, { templateNo })
      .then((res) => {
        if (res.data.code !== 0) return;
        // 模板价格返回为空
        if (Object.keys(res.data.data).length === 0) {
          useDesignerApplication().templateSpecialType.value = '';
          useDesignerApplication().templatePriceList.value = [];
          return;
        }
        useDesignerApplication().templateSpecialType.value = res.data.data.templateType;
        useDesignerApplication().templatePriceList.value = res.data.data.resList.map((e) => {
          return {
            prop: e.templateProperty,
            list: e.priceList, //{price,num}
          };
        });
      })
      .finally(() => {
        useDesignerApplication().priceLoading.value = false;
      });

    // 获取模板工艺
    useDesignerApplication().craftLoading.value = true;
    GRequest(`/base-web/CMProductTemplateAct/getTemplateCraftFirstType.act`, METHOD.POST, { templateId: detail.seqId })
      .then((res) => {
        if (res.data.retState !== '0') return (this.firstTypeNames = '');
        useDesignerApplication().templateCraft.value = res.data.firstTypeNames;
      })
      .catch((e) => {
        console.error('获取工艺失败', e);
        useDesignerApplication().templateCraft.value = '';
      })
      .finally(() => {
        useDesignerApplication().craftLoading.value = false;
      });

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
      await useTemplate(template, prevTemplate);
    }
    // 精细模板可用
    else if (refineConfig.list.length) {
      const template = useDesignerApplication().templateList.value[0];
      await useTemplate(template, prevTemplate);
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
 * @param {{viewList:import('d').template.viewList}} prevTemplate
 */
export async function useTemplate(template, prevTemplate) {
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

  // 如果有上一个模板的数据
  if (prevTemplate) {
    nextTick(() => {
      // 未命中的视图
      const missViewList = [];
      // 是否提示未找到视图
      let isFlag = false;
      // 遍历当前模板,匹配上一个模板的视图
      template.viewList.forEach((view) => {
        const fdView = prevTemplate.viewList.find((v) => v.id == view.id);
        if (fdView) {
          const _designList = fdView.designList.map((d, i) => {
            return {
              ...d,
              attrs: {
                ...pick(d.attrs, ['uuid', 'type', 'zIndex', 'detail', 'fill', 'text', 'viewId']),
              },
            };
          });
          if (_designList.length) isFlag = true;
          view.designList.push(..._designList);
        } else {
          missViewList.push(view);
        }
      });
      template.unsleep({
        isCenter: true,
        isSort: false,
      });

      // 如果有未找到的视图
      if (isFlag) {
        Message.warning(`已将设计迁移到新模板`);
      }
    });
  }

  console.log('使用模板', useDesignerApplication());
}
