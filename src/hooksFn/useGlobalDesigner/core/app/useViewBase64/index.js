import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { createEventHook, useDebounceFn } from '@vueuse/core';

// 生成base64
export function createGenerateBase64(view = null) {
  // 生成预览图【view】【designLayer】【drawWidth】【drawHeight】【offsetX】【offsetY】
  function generateBase64(pixelRatio = null) {
    // 全局配置
    const { canvasDefine } = useGlobalDesigner().app.config;
    pixelRatio = pixelRatio ? pixelRatio : canvasDefine.previewPixelRatio;

    view = view || useGlobalDesigner().app.activeView.value;
    const { bd, designLayer } = view.canvasNodes;

    // 设计区域画布宽度, 距离左上的偏移量
    const drawWidth = bd.width();
    const drawHeight = bd.height();
    const offsetX = designLayer.x();
    const offsetY = designLayer.y();

    if (view.base64) {
      view.base64 = null;
    }
    let _base64 = designLayer?.toDataURL({
      x: offsetX,
      y: offsetY,
      width: drawWidth,
      height: drawHeight,
      pixelRatio: pixelRatio,
    });
    view.base64 = _base64;
    // console.log('生成预览图', view.base64);
  }

  // 防抖生成base64
  const generateBase64Result = createEventHook();
  generateBase64Result.on(useDebounceFn(() => generateBase64(), 100));

  return {
    generateBase64Debounce: generateBase64Result.trigger,
    generateBase64,
  };
}
