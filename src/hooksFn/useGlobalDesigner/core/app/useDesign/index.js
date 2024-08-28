import { cloneDeep } from 'lodash';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { Message } from 'element-ui';
import { setImage } from '@/hooksFn/useGlobalDesigner/core/app/useDesign/setImage';
import { setBgColor } from '@/hooksFn/useGlobalDesigner/core/app/useDesign/setBgColor';

export function useDesign() {
  return {
    setDesignImage,
    setDesignBgColor,
  };
}

// 设置背景颜色
function setDesignBgColor(color, view = null) {
  useGlobalDesigner().app.activeTemplate.value.viewList.forEach((view) => setBgColor(color, view));
}

/**
 * 设置设计图
 * @param detail
 * @param {setImageOptions} options
 * @returns {Promise<{node: *}>}
 */
async function setDesignImage(detail, options = {}) {
  options = Object.assign({ attrs: {}, isCenter: true }, options);

  // console.log('设置设计图', cloneDeep(detail));
  // 是否背景图
  const isBg = detail.isBg;
  if (!isBg) {
    if (!imgMax()) return Promise.reject('设计图数量限制');
    const view = useGlobalDesigner().app.activeView.value;
    return await setImage(detail, view, options);
  } else {
    if (!bgImgMax()) return Promise.reject('背景图数量限制');
    useGlobalDesigner().app.activeTemplate.value.viewList.forEach((view) => setImage(detail, view, options));
  }
}

// 背景图限制
function bgImgMax(view = null) {
  const { activeTemplate, activeView } = useGlobalDesigner().app;
  view = view || activeView.value;

  // 设计图数量限制
  for (let i = 0; i < activeTemplate.value.viewList.length; i++) {
    const v = activeTemplate.value.viewList[i];
    if (v.designList.length >= 5) {
      Message.warning(`每个图层最多5张设计图, 图层${i + 1}已达到最大数量`);
      return false;
    }
  }
  // 背景图唯一限制
  const isSome = view.designList.some((e) => e?.detail?.isBg);
  if (isSome) {
    Message.warning('背景图已存在,只能添加一个背景图');
    return false;
  }
  return true;
}
// 设计图限制
function imgMax(view = null) {
  view = view || useGlobalDesigner().app.activeView.value;
  // 设计图数量限制
  if (view.designList.length >= 5) {
    Message.warning('每个图层最多5张设计图');
    return false;
  }
  return true;
}
