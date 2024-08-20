import { createEventHook, useDebounceFn } from '@vueuse/core';
import { canvasDefine, DEBOUNCE_TIME } from '@/hooksFn/useDesignerApp/core/service/app/define';

export function createGenerateBase64(canvasNode, view) {
  const { bd, designLayer } = canvasNode;

  // 设计区域画布宽度, 距离左上的偏移量
  const drawWidth = bd.width();
  const drawHeight = bd.height();
  const offsetX = designLayer.x();
  const offsetY = designLayer.y();

  // 生成预览图【view】【designLayer】【drawWidth】【drawHeight】【offsetX】【offsetY】
  function generateBase64(pixelRatio = canvasDefine.previewPixelRatio) {
    if (view.base64) {
      view.base64 = null;
    }
    view.base64 = designLayer?.toDataURL({
      x: offsetX,
      y: offsetY,
      width: drawWidth,
      height: drawHeight,
      pixelRatio: pixelRatio,
    });
    // console.log('生成预览图', view.base64);
  }

  // 防抖生成base64
  const generateBase64Result = createEventHook();
  generateBase64Result.on(useDebounceFn(() => generateBase64(), DEBOUNCE_TIME));

  return {
    generateBase64Debounce: generateBase64Result.trigger,
    generateBase64,
  };
}
