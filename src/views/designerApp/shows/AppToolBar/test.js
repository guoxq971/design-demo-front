import { Message } from 'element-ui';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { pick } from 'lodash';
import { useDesignerContainerEl } from '@/hooksFn/useGlobalDesigner/core/contaienr';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { loadImage } from '@/hooksFn/useGlobalDesigner/core/application/design/loadImage';
import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/application/design/imageSize';
import { offScreenTemplateToBase64 } from '@/hooksFn/useGlobalDesigner/core/application/offScreen/templateToBase64';

export async function onTest() {
  // 离屏渲染模板视图为base64
  const templateList = useDesignerApplication().templateList.value;
  for (let template of templateList) {
    if (template.hasDesign()) {
      const result = await offScreenTemplateToBase64(template);
      console.log(result);
    }
  }

  // 离屏创建three-携带相机(多角度,导出)
  // 创建three
  // 加载模型
  // 模型加载成功后,创建canvas, canvas底色取值对应模板配置(默认第一个), canvas上填充对应视图的base64
  // 渲染器渲染
  // 截图
  // 销毁three
  // 销毁base64

  // 上传three的截图给后端
}
