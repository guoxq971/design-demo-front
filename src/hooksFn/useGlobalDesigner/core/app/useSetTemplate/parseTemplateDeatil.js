const { parseMulti } = useMultiUtil();
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
      printout_d: printout?.soft?.d,
      printout_v: printout?.soft?.v,
      print_d: print?.boundary?.soft?.content?.svg?.path?.d,
      print_width: print?.boundary?.size?.width,
      print_height: print?.boundary?.size?.height,
      base64: null, // 预览图
      canvasNodes: null, // canvas节点
      designList: null, // 设计列表
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
    // multiList,
  };
}

function useMultiUtil() {
  // 解析多角度
  function parseMulti(appearance, renderMultiList = []) {
    // 简单多角度
    const simple = appearance?.multiAngleImages || [];
    // 复杂多角度
    const complex = complexMultiDispose(appearance.multiAngleImages4Compose);
    const resultList = [...simple, ...complex];
    const list = resultList.map((item) => {
      let {
        composeId, //复杂
        multiId, //简单
      } = item;
      let designImg = findMultiDesignImg(renderMultiList, composeId, multiId);
      // 顺序 = image - mask - texture
      // image = background_white_positive
      // mask = mask_white_positive
      // texture = public_texture_white_positive [这张不需要]
      let result = {
        multiId: item.multiId, // 排序id
        composeId: item.composeId,
        id: item.multiId,
        bgImg: item.image,
        designImg: null,
        prodImg: null,
        multiItem: item,
        noShow: false,
      };
      if (composeId) {
        // 复杂
        result.designImg = designImg;
        result.prodImg = item.mask;
      } else {
        // 简单
        result.designImg = designImg || '';
        result.prodImg = item.mask;
      }
      return result;
    });
    list.sort((a, b) => a.multiId - b.multiId);

    return list;
  }

  /**
   * 复杂多角度处理
   * @param {array} list 图片列表
   * @return {array} resultList 处理后的图片列表
   * */
  function complexMultiDispose(list) {
    // 打上组的标签 composeGroup
    list.forEach((item) => (item.composeGroup = item.composeId.split('')[0]));
    // 按标签分组存在 map
    let resultMap = new Map();
    list.forEach((e) => {
      if (!resultMap.has(e.composeGroup)) {
        resultMap.set(e.composeGroup, [e]);
      } else {
        let d = resultMap.get(e.composeGroup);
        d.push(e);
        resultMap.set(e.composeGroup, d);
      }
    });
    let tempList = [...resultMap.values()];
    let resultList = [];
    // 取组的第一个为首选，其余放在字段 multiList 中
    tempList.forEach((e) => resultList.push({ ...e[0], multiList: e }));
    return resultList;
  }

  /**
   * 查找多角度设计图
   * @param {array} multiDesignImgList 多角度设计图组
   * @param {string} composeId 产品的composeId
   * @param {string} multiId 产品的多角度id
   * @return {string} url 设计图的url
   * */
  function findMultiDesignImg(multiDesignImgList, composeId, multiId) {
    let url = '';
    // 复杂多角度查找
    if (composeId) {
      let d = multiDesignImgList.find((e) => e.composeId == composeId);
      if (d) url = d.img;
    }
    // 简单多角度查找
    else {
      let d = multiDesignImgList.find((e) => e.multiId == multiId);
      if (d) url = d.img;
    }
    return url;
  }

  return {
    parseMulti,
  };
}
