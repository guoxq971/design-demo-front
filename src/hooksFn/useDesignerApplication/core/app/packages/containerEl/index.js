import { reactive, ref, watchEffect } from 'vue';
import { createEventHook, useElementBounding } from '@vueuse/core';

// 容器
export function useContainerEL() {
  // canvas容器(konva舞台)
  const canvasElRef = ref(null);
  // img(产品图)
  const imgElRef = ref(null);

  // 组装属性
  const canvasRect = reactive(useElementBounding(canvasElRef));
  const imgRect = reactive(useElementBounding(imgElRef));

  // 钩子
  const event = createEventHook();

  // 容器rect
  const containerRect = ref({});
  watchEffect(
    () => {
      // 舞台的宽高
      const stageWidth = canvasRect.width;
      const stageHeight = canvasRect.height;

      // 产品绘制区域的宽高
      const drawWidth = imgRect.width;
      const drawHeight = imgRect.height;

      // 产品绘制区域相当于舞台的偏移量
      const offsetX = imgRect.left - canvasRect.left;
      const offsetY = imgRect.top - canvasRect.top;

      const result = {
        canvasRect,
        imgRect,
        stageWidth,
        stageHeight,
        drawWidth,
        drawHeight,
        offsetX,
        offsetY,
      };

      // 触发钩子
      event.trigger(result);

      containerRect.value = result;
    },
    { flush: 'post' },
  );

  return {
    canvasElRef,
    imgElRef,
    containerRect,
    onUpdate: event.on,
  };
}
