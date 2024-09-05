import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { DRequest, METHOD } from '@/utils/request';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { computed } from 'vue';

/**
 * 渲染多角度
 * @typedef {import('d').template.renderMulti}
 * @param {import('d').template} template
 */
export async function renderMulti(template) {
  try {
    const activeColor = useDesignerApplication().activeColor.value;
    useDesignerApplication().renderLoading.value = true;
    const data = await template.getSubmitData(useDesignerAppConfig().save_template_type_render);
    console.log('多角度接口请求参数', data);
    const res = await DRequest(`/designer-web/CMDesignAct/realTimeCutMulti2.act?mediaType=json`, METHOD.POST, data, { timeout: 3 * 60 * 1000 });
    if (res.data.retState !== '0') return Promise.reject('渲染多角度失败');
    // console.log('activeColor', activeColor);
    // console.log('多角度接口返回值', JSON.parse(JSON.stringify(res.data)));
    template.multi2DList = res.data.cutList;
    for (let item of activeColor.multiImageList) {
      const d = template.multi2DList.find((e) => e.composeId === item.composeId || item.multiId === e.multiId);
      item.designImg = d?.img;
    }
  } finally {
    useDesignerApplication().renderLoading.value = false;
  }
}

// 多角度处理
export function useMultiUtil() {
  // 多角度-3d
  const { getMultiContainerId } = useDesignerAppConfig();
  // 获取多角度
  const getMulti3d = computed(() => {
    /**@param {import('d').colorMultiImageItem} item*/
    return (item) => {
      return useDesignerApplication().activeTemplate.value?.multi3DList.find((m) => m.multiId === item.multiId || m.composeId === item.composeId);
    };
  });
  // 是否多角度3d
  const isMulti3D = computed(() => {
    /**@param {import('d').colorMultiImageItem} item*/
    return (item) => getMulti3d.value(item)?.config.glbPath;
  });

  return {
    getMulti3d,
    isMulti3D,
    getMultiContainerId,
  };
}
