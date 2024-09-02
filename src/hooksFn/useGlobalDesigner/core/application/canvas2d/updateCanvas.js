import { useDesignerContainerEl } from '@/hooksFn/useGlobalDesigner/core/contaienr';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 更新2D画布
 * @typedef {import('d').view.update2DCanvas}
 * @param {import('d').view} view
 */
export function update2DCanvas(view) {
  // 更新预览2d画布
  const { containerRect } = useDesignerContainerEl();
  // 设计区域画布宽度, 距离左上的偏移量
  const canvas = view.canvasNodes?.designLayer._toKonvaCanvas({
    width: containerRect.value.drawWidth,
    height: containerRect.value.drawHeight,
    x: containerRect.value.offsetX,
    y: containerRect.value.offsetY,
    pixelRatio: useDesignerAppConfig().preview_canvas_pixel_ratio,
  });
  if (!canvas) {
    console.error('更新2d画布失败, canvas还未生成');
    return;
  }
  const canvasDom = document.getElementById(useDesignerAppConfig().getPreviewContainerId(view.id));
  const ctx2 = canvasDom.getContext('2d');
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.drawImage(canvas._canvas, 0, 0);

  // 3d
  if (view.update3DCanvasDebounce) {
    view.update3DCanvasDebounce();
  }

  // 同步attrs
  view.syncAttrs();
}
