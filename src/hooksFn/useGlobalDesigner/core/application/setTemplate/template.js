/**
 * 获取模板的基础数据
 * @returns {import('d').template}
 * */
export function getTemplateInterface() {
  return {
    id: '',
    templateNo: '',
    detail: null,
    size: '',
    type: '',
    is3d: false,
    config: null,
    viewList: [],
    colorList: [],
    sizeList: [],
  };
}
