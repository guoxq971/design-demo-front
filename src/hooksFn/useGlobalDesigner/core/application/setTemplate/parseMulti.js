// 解析多角度
export function parseMulti(appearance, renderMultiList = []) {
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
