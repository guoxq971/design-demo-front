import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { setNodeClipFunc } from './canvasClip';
import { addWatchStage, createCanvasNode } from './createCanvas';
import { nextTick } from 'vue';

// 模式
const modes = {
  preview: 'preview',
  edit: 'edit',
};

export function useCanvas() {
  // 创建canvas
  function create(view) {
    const { drawWidth, drawHeight } = useGlobalDesigner().app.container.containerRect.value;
    // 创建舞台
    const canvasNodes = createCanvasNode(view);
    // 设置裁剪
    setNodeClipFunc(canvasNodes.designLayer, { width: drawWidth, height: drawHeight });
    // 设置监听
    nextTick(() => addWatchStage(view));
    // 默认预览模式
    nextTick(() =>
      useGlobalDesigner()
        .app.tool(view)
        .setMode(modes.preview),
    );
    return canvasNodes;
  }

  return {
    create,
  };
}
