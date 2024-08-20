import { parseMulti } from './parseMulti.js';

/**
 * 解析模板详情
 * @param {*} detail
 * @return
 */
export function parseTemplate(detail) {
  const viewList = [];
  const sizeList = [];
  const colorList = [];
  const multiList = [];

  // 视图
  for (let view of detail.views) {
    const print = detail.printAreas.find((e) => e.defaultView.id === view.id);
    const printout = detail.pointoutPrintAreas.find((e) => e.defaultView.id === view.id);
    viewList.push({
      id: view.id,
      name: view.name,
      offsetX: view.viewMaps[0].offset.x,
      offsetY: view.viewMaps[0].offset.y,
      print: print,
      printout: printout,
      width: print?.boundary?.size?.width,
      height: print?.boundary?.size?.height,
      d_2d: print?.boundary?.soft?.content?.svg?.path?.d,
    });
  }

  // 颜色,多角度
  for (let appearance of detail?.appearances) {
    const multi = parseMulti(appearance);
    colorList.push({
      ...appearance,
      id: appearance.id,
      colorCode: appearance.colors[0].value,
      colorName: appearance.name,
      multiList: multi,
    });
    multiList.push({
      list: multi,
      appearance: appearance,
      colorId: appearance.id,
      colorCode: appearance.colors[0].value,
      colorName: appearance.name,
    });
  }

  // 尺码
  for (let size of detail.sizes) {
    sizeList.push({
      id: size.id,
      name: size.name,
      sizeName: size.name,
      ...size,
    });
  }

  return {
    detail,
    viewList,
    sizeList,
    colorList,
    multiList,
  };
}
