import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 最大化操作的缩放比例
 * @param {import('d').design_max_type} type width:宽度 height:高度
 * @param {{width:number,height:number}} inch
 * @param {import('d').view} view
 * @param {{width:number,height:number}} imageDOMSize
 */
export function getScaleMax(type = useDesignerAppConfig().design_max_type_width, inch, view, imageDOMSize) {
  const iSize = inch;
  const pSize = view;
  const l = iSize.width / pSize.width; // l:设计图宽/打印区宽
  const p = iSize.height / pSize.height; // p:设计图高/打印区高
  let u;
  // 没有d是非全幅，铺满不能出现红线
  if (view?.print_d) {
    u = Math.min(l, p); // 取较小值
  } else {
    u = Math.max(l, p); // 取较大值[改]
  }
  if (useDesignerAppConfig().design_max_type_width === type) u = l;
  if (useDesignerAppConfig().design_max_type_height === type) u = p;
  if (u < 1) u = 1;

  // 最大化后的宽高
  const width = iSize.width / u;
  const height = iSize.height / u;

  // imageDom是当前使用的DOM的宽高可能是小图的宽高
  const scaleX = width / imageDOMSize.width;
  const scaleY = height / imageDOMSize.height;

  return {
    scaleX: scaleX,
    scaleY: scaleY,
  };
}
