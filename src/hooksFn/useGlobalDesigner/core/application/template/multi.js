import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { DRequest, METHOD } from '@/utils/request';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 渲染多角度
 * @typedef {import('d').template.renderMulti}
 * @param {import('d').template} template
 */
export async function renderMulti(template) {
  try {
    const activeColor = useDesignerApplication().activeColor.value;
    useDesignerApplication().renderLoading.value = true;
    const data = template.getSubmitData(template, useDesignerAppConfig().save_template_type_render);
    console.log('多角度接口请求参数', JSON.parse(JSON.stringify(data)));
    const res = await DRequest(`/designer-web/CMDesignAct/realTimeCutMulti2.act?mediaType=json`, METHOD.POST, data, { timeout: 3 * 60 * 1000 });
    if (res.data.retState !== '0') return Promise.reject('渲染多角度失败');
    // console.log('activeColor', activeColor);
    console.log('多角度接口返回值', JSON.parse(JSON.stringify(res.data)));
    for (let item of activeColor.multiImageList) {
      const d = res.data.cutList.find((e) => e.composeId === item.composeId || item.multiId === e.multiId);
      item.designImg = d?.img;
    }
  } finally {
    useDesignerApplication().renderLoading.value = false;
  }
}
