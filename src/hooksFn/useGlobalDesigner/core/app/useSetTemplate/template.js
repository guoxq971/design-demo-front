import { shallowRef, ShallowRef } from 'vue';
export class Template {
  // 模板类型
  type = '';
  // 模板尺码
  size = '';
  // 模板编号
  templateNo;
  // 模板详情
  detail = null;
  /**@type {View[]} 视图列表*/
  viewList = null;
  // 尺码列表
  sizeList = null;
  /**@type {Color[]} 颜色列表*/
  colorList = null;
  /**@type {Config} 模板配置*/
  config = null;
  // 3d是否可用
  has3d = () => {
    let result;
    const config3d = this?.config;
    result = config3d?.hasUpload3d === 1 && config3d?.openflag3d === 0 && config3d?.uvdflag === 1 && config3d?.glbPath;
    return result;
  };
  /** @type {CreateThree|null}*/
  three = shallowRef(null);
}

export class Color {
  /**@type {string}*/
  id;
  /**@type {string}*/
  colorCode;
  /**@type {string}*/
  colorName;
  /**@type {array}*/
  multiList;
}

export class View {
  /**@type {string}*/
  id;
  /**@type {string}*/
  name;
  /**@type {string}*/
  offsetX;
  /**@type {string}*/
  offsetY;
  /**@type {object}*/
  print;
  /**@type {object}*/
  printout;
  /**@type {string}*/
  width;
  /**@type {string}*/
  height;
  /**@type {string}*/
  d_2d;
  /**@type {string}*/
  printout_d;
  /**@type {string}*/
  printout_v;
  /**@type {string}*/
  print_d;
  /**@type {string}*/
  print_width;
  /**@type {string}*/
  print_height;
  /**@type {string}*/
  base64;
  /**@type {CanvasNodes}*/
  canvasNodes;
  /**@type {ShallowRef<HTMLCanvasElement>}*/
  textureCanvas;
  /**@type {array}*/
  designList;
}

class CanvasNodes {
  /**@type {Konva.Layer}*/
  designLayer;
}

class Config {
  templateNo;
  glbPath;
  zipPath;
  openflag2d;
  openflag3d;
  uvdflag;
  hasUpload2d;
  hasUpload3d;
  seqId;
  /**@type {ConfigViewItem[]}*/
  viewList;
  /**@type {ConfigColorItem[]}*/
  colorList;
}
class ConfigViewItem {
  /**@type {string}*/
  seqId;
  /**@type {string}*/
  templateId;
  /**@type {string}*/
  templateNo;
  /**@type {number}*/
  viewId;
  /**@type {string}*/
  viewRelation;
  /**@type {string}*/
  viewName;
  /**@type {string}*/
  materialName;
  /**@type {string}*/
  uvD;
  /**@type {string}*/
  uvV;
  /**@type {number}*/
  useflag;
  /**@type {number}*/
  sortNo;
  /**@type {string}*/
  createUser;
  /**@type {string}*/
  createTime;
  /**@type {string}*/
  updateUser;
  /**@type {string}*/
  updateTime;
  /**@type {string}*/
  cameraPosition;
  /**@type {string}*/
  cameraRotation;
  /**@type {number}*/
  configType;
  /**@type {string}*/
  size;
}

class ConfigColorItem {
  /**@type {string|null}*/
  colorCode;
  /**@type {string}*/
  colorName;
  /**@type {ConfigColorListItem[]}*/
  list;
}

class ConfigColorListItem {
  /**@type{string}*/
  seqId;
  /**@type{string}*/
  templateId;
  /**@type{string}*/
  templateNo;
  /**@type{string}*/
  colorName;
  /**@type{number}*/
  viewId;
  /**@type{string}*/
  colorCode;
  /**@type{number}*/
  useflag;
  /**@type{string}*/
  sortNo;
  /**@type{string}*/
  createUser;
  /**@type{string}*/
  createTime;
  /**@type{string}*/
  updateUser;
  /**@type{string}*/
  updateTime;
  /**@type{string}*/
  viewName;
  /**@type{string}*/
  materialName;
  /**@type{number}*/
  configType;
  /**@type{string}*/
  size;
}
