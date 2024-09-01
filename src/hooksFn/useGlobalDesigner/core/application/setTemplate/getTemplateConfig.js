import { GRequest, METHOD } from '@/utils/request';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 获取通用模板3d配置
 * @param {string} templateNo
 * @returns {Promise<{is2dFlag: boolean,is3dFlag: boolean, config: import('d').templateConfig}>}
 */
export async function getCommon3dConfig(templateNo) {
  // 通用模板的3d数据
  const res = await GRequest(`/base-web/template/cmProductTemplateConfig/get3dConfig/${templateNo}`, METHOD.GET);
  if (res.data.code !== 0) return Promise.reject('获取通用模板3d配置失败');
  const resp = res.data.data;
  // 2d是否可用
  const is2dFlag = resp.hasUpload2d === 1 && resp.openflag2d === 0;
  // 3d是否可用
  const is3dFlag = resp?.hasUpload3d === 1 && resp?.openflag3d === 0 && resp?.uvdflag === 1 && resp?.glbPath;

  return {
    config: resp,
    is2dFlag,
    is3dFlag,
  };
}

/**
 * 获取精细化配置
 * @param {string} templateNo
 * @returns {Promise<{list: import('d').templateRefineConfig[]}>}
 */
export async function getRefineConfig(templateNo) {
  // 获取精细配置
  const res = await GRequest(`/base-web/cm/cmProductTemplate/getSizeListByTemplateNo/${templateNo}`, METHOD.GET);
  if (res.data.code !== 0) return Promise.reject('获取精细化3d配置失败');
  let resp = res.data.data || [];
  // 过滤掉不可用
  resp = resp.filter((e) => {
    e.type = useDesignerAppConfig().template_type_refine;
    e.is2dFlag = e.hasUpload2d === 1 && e.openflag2d === 0;
    e.is3dFlag = e.hasUpload3d === 1 && e.openflag3d === 0 && e.uvdflag === 1 && e.glbPath;
    return e.is2dFlag;
  });
  const isUseRefine = resp.length > 0;
  // console.log('精细 (可用)', refineConfigList);

  return {
    list: resp,
  };
}

/**
 * 获取模板详情-根据尺码
 * @param {string} templateNo
 * @param {string} size
 * @returns {Promise<import('d').templateDetail>}
 */
export async function getTemplateDetailWithSize(templateNo, size) {
  const param = {
    templateNo: templateNo,
    size: size,
  };
  const res = await GRequest(`/base-web/CMProductTemplateAct/selectTemplateList4DesignWithSize.act`, METHOD.POST, param);
  if (res.data.retState !== '0') return Promise.reject('获取模板详情失败');
  return res.data;
}
