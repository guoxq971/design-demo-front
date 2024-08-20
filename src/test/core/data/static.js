// 静态数据
export function useStaticData() {
  const canvass = {
    // 模板canvas 500x500
    template: 'template_canvas',
    // 用作材质的canvas 1500x1500
    material: 'material_canvas',
  };
  const threes = {
    // 模板three
    template: 'template_three',
  };
  const types = {
    canvas: canvass,
    canvas_by_viewId: (viewId) => `canvas_view_${viewId}`,
    three: threes,
  };

  // canvas
  const canvasMap = new Map();
  canvasMap.set(canvass.template, new Map());
  canvasMap.set(canvass.material, new Map());

  // three
  const threeMap = new Map();
  threeMap.set(threes.template, new Map());

  return {
    canvass,
    threes,
    types,
    canvasMap,
    threeMap,
  };
}
