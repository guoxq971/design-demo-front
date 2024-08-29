import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { createEventHook, useDebounceFn } from '@vueuse/core';
import { shallowRef } from 'vue';

// 生成base64
export function createGenerateBase64(view = null) {
  async function generateBase64() {
    const { containerRect } = useGlobalDesigner().app.container;
    view = view ? view : useGlobalDesigner().app.activeView.value;
    // 设计区域画布宽度, 距离左上的偏移量
    const canvas = view.canvasNodes.designLayer._toKonvaCanvas({
      width: containerRect.value.drawWidth,
      height: containerRect.value.drawHeight,
      x: containerRect.value.offsetX,
      y: containerRect.value.offsetY,
      pixelRatio: useGlobalDesigner().app.config.canvasDefine.previewPixelRatio,
    });
    const canvasDom = document.getElementById(`preview_canvas_${view.id}`);
    const ctx2 = canvasDom.getContext('2d');
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.drawImage(canvas._canvas, 0, 0);
  }

  // 防抖生成base64
  const generateBase64Result = createEventHook();
  generateBase64Result.on(
    useDebounceFn(() => {
      useGlobalDesigner().app.watchBase64Event.trigger({ viewId: view.id });
      generateBase64();
    }, 100),
  );

  // 生成base64
  const generateBase64FnResult = createEventHook();
  generateBase64FnResult.on(() => {
    useGlobalDesigner().app.watchBase64Event.trigger({ viewId: view.id, isAll: true });
    generateBase64();
  });

  return {
    generateBase64Debounce: generateBase64Result.trigger,
    generateBase64Fn: generateBase64FnResult.trigger,
    generateBase64,
  };
}
