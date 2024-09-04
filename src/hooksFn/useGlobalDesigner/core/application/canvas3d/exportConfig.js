import { GRequest, METHOD } from '@/utils/request';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

/**
 * 获取模板导出配置
 * @param {import('d').template} template 模板
 */
export async function getExportConfig(template) {
  try {
    useDesignerApplication().exportLoading.value = true;
    // 如果可以加载,请求接口,是否配置 导出模型截图
    const size = template.size || '';
    const res2 = await GRequest(`/base-web/template3d/cmProductTemplate3dAngle/query3dAngleConfig`, METHOD.POST, {
      templateId: template.detail.seqId,
      size: size,
    });
    if (res2.data.code !== 0) {
      console.error('获取模板导出配置失败');
      return;
    }
    if (res2.data.data.length !== 0) {
      // 过滤出未禁用数据
      template.exportConfig = res2.data.data.filter((e) => e.useflag === 0);
    }
    template.isGetExportConfig = true;
  } catch (e) {
    console.error('获取模板导出配置失败', e);
  } finally {
    useDesignerApplication().exportLoading.value = false;
  }
}
