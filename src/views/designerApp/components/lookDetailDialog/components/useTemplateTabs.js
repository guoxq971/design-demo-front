import { TemplateDescType } from './util';
import { GRequest, METHOD } from '@/utils/request';

/*
 * 获取详情数据
 * @param {string} seqId - 模板id
 * */
export async function getDetail(seqId) {
  let detail = {};
  let res = await GRequest('/base-web/cm/cmTemplateDescribe/getDetail', METHOD.POST, [seqId]);
  if (res.data.code !== 0) return;
  let rep = res.data.data[0];
  detail = assistDisposeDetailData(rep);
  return { detail };
}

/*
 * 辅助函数-处理详情数据
 * */
function assistDisposeDetailData(data) {
  const _detail = new TemplateDescType();
  // 如果 fbaList 有值，直接回显
  if (data.fbaList.length > 0) {
    data.fbaList.forEach((item) => {
      // 类型转换，让重量类型为数字
      item.weightType = item.weightType ? Number(item.weightType) : item.weightType;
    });
  }
  // 如果没有值，需要根据 sizeList 进行初始化
  else {
    data.fbaList = data.sizeList.map((item) => {
      let obj = _detail?.fbaList?.length ? _detail.fbaList[0] : {};
      return {
        ...obj,
        size: item,
        templateId: data.templateId,
      };
    });
  }
  return data;
}
