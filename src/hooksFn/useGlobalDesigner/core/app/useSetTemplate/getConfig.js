import { GRequest, METHOD } from '@/utils/request';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';

/**
 * 获取通用模板3d配置
 * @returns {Promise<{isFlag: boolean, config: *}>}
 */
export async function getCommon3dConfig(templateNo) {
  // 通用模板的3d数据
  const res = await GRequest(`/base-web/template/cmProductTemplateConfig/get3dConfig/${templateNo}`, METHOD.GET);
  if (res.data.code !== 0) return Promise.reject('获取通用模板3d配置失败');
  const resp = res.data.data;
  // 是否可用
  const isFlag = resp.hasUpload2d === 1 && resp.openflag2d === 0;

  return {
    config: resp,
    isFlag,
  };
}

/**
 * 获取精细化配置
 * @param templateNo
 * @returns {Promise<{list: T[]}>}
 */
export async function getRefineConfig(templateNo) {
  const { templateType } = useGlobalDesigner().app.config;
  // 获取精细配置
  const res = await GRequest(`/base-web/cm/cmProductTemplate/getSizeListByTemplateNo/${templateNo}`, METHOD.GET);
  if (res.data.code !== 0) return Promise.reject('获取精细化3d配置失败');
  let resp = res.data.data || [];
  // 过滤掉不可用
  resp = resp.filter((e) => {
    e.type = templateType.refine;
    e.isFlag = e.hasUpload2d === 1 && e.openflag2d === 0;
    return e.isFlag;
  });
  const isUseRefine = resp.length > 0;
  // console.log('精细 (可用)', refineConfigList);

  return {
    list: resp,
  };
}
