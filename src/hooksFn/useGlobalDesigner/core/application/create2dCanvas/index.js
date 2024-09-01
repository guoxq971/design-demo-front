import { useDesignerContainerEl } from '@/hooksFn/useGlobalDesigner/core/contaienr';
import { addWatchStage, createCanvasNode } from '@/hooksFn/useGlobalDesigner/core/application/create2dCanvas/createNodes';
import { setNodeClipFunc } from '@/hooksFn/useGlobalDesigner/core/application/create2dCanvas/canvasClip';
import { nextTick } from 'vue';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 创建2d画布
 * @typedef {import('d').view.create2DCanvas}
 * @param {import('d').view} view
 */
export function create2dCanvas(view) {
  // 2d容器
  const { drawWidth, drawHeight } = useDesignerContainerEl().containerRect.value;
  // 创建节点
  view.canvasNodes = createCanvasNode(view);
  // 设置裁剪属性
  setNodeClipFunc(view.canvasNodes.designLayer, { width: drawWidth, height: drawHeight });
  // 设置监听
  nextTick(() => addWatchStage(view));
  // 设置默认预览模式
  nextTick(() => view.setMode(useDesignerAppConfig().mode_type_preview));
  // console.log('创建2d画布成功', view);
}
