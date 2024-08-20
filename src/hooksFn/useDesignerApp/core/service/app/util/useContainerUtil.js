import { ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { canvasContainerId, canvasImgContainerId } from '@/hooksFn/useDesignerApp/core/service/app/define';

export function useContainerUtil() {
  // canvas容器(konva舞台)
  const canvasEl = ref(document.getElementById(canvasContainerId));
  const canvasRect = useElementBounding(canvasEl);
  // img(产品图)
  const imgEl = ref(document.getElementById(canvasImgContainerId));
  const imgRect = useElementBounding(imgEl);

  // 舞台的宽高
  const stageWidth = canvasRect.width.value;
  const stageHeight = canvasRect.height.value;

  // 产品绘制区域的宽高
  const drawWidth = imgRect.width.value;
  const drawHeight = imgRect.height.value;

  // 产品绘制区域相当于舞台的偏移量
  const offsetX = imgRect.left.value - canvasRect.left.value;
  const offsetY = imgRect.top.value - canvasRect.top.value;

  return {
    canvasEl,
    canvasRect,
    imgEl,
    imgRect,
    stageWidth,
    stageHeight,
    drawWidth,
    drawHeight,
    offsetX,
    offsetY,
  };
}
