import { getImageSize } from '@/hooksFn/useDesignerApp/core/service/app/util/designUtil/inchSize';
import { useImage } from '@vueuse/core';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { CreateDesignImageNode } from '@/hooksFn/useDesignerApp/core/service/app/util/designUtil/createDesignImageNode';

export class DesignUtil {
  /**
   * 创建图片
   * @param param
   */
  static async createDesignImage(param) {
    const { detail, viewWidth, viewHeight, dpi, helper } = param;

    // 获取图片在设计区域的大小
    const imageSize = getImageSize(detail.size, dpi, { width: viewWidth, height: viewHeight });
    const { width, height } = imageSize.size;
    // 获取可用图片地址
    const src = AppUtil.getImageUrl(detail);

    // 加载图片到设计区域
    return useImage({ src, crossorigin: true, width, height }).then((result) => {
      const { isReady, state } = result;
      if (!isReady.value) return;

      // 创建图片节点到canvas
      const _attrs = { image: state.value, width, height };
      const { onSort, onUpdate, attrs } = CreateDesignImageNode(_attrs, helper);

      return {
        attrs,
        onUpdate,
        onSort,
      };
    });
  }
}
