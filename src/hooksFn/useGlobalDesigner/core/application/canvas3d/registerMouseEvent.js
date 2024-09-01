import { nextTick } from 'vue';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 注册鼠标事件
 * @param {HTMLElement} dom
 * @returns {(function(): void)|*}
 */
export function registerMouseEvent(dom) {
  const mouseDownPos = { x: '', y: '' };
  function fn1(e) {
    mouseDownPos.x = e.clientX;
    mouseDownPos.y = e.clientY;
  }
  function fn2(e) {
    if (mouseDownPos.x === e.clientX && mouseDownPos.y === e.clientY) {
      useDesignerApplication().activeView.value.setMode(useDesignerAppConfig().mode_type_edit);
    }
  }

  nextTick(() => {
    // dom 注册鼠标按下和鼠标抬起事件，如果按下和抬起的坐标一致，则打印一下
    dom.addEventListener('mousedown', fn1);
    dom.addEventListener('mouseup', fn2);
  });

  // 返回销毁
  return () => {
    dom.removeEventListener('mousedown', fn1);
    dom.removeEventListener('mouseup', fn2);
  };
}
