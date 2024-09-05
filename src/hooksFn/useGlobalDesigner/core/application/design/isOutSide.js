/**
 * 获取设计信息
 * @param {import('d').design.node} node
 * @returns {{bbox:import('d').bbox}}
 */
export function getBox(node) {
  const scaleX = Math.abs(node.attrs.scaleX);
  const scaleY = Math.abs(node.attrs.scaleY);
  const offsetX = node.attrs.offsetX * scaleX;
  const offsetY = node.attrs.offsetY * scaleY;
  const design = {
    x: node.attrs.x,
    y: node.attrs.y,
    size: {
      width: node.attrs.width,
      height: node.attrs.height,
    },
    scaleX: scaleX,
    scaleY: scaleY,
  };
  // designPos
  const dp = {
    x: design.x - offsetX,
    y: design.y - offsetY,
    w: design.size.width * design.scaleX,
    width: design.size.width * design.scaleX,
    h: design.size.height * design.scaleY,
    height: design.size.height * design.scaleY,
    x2: design.x - offsetX + design.size.width * design.scaleX,
    y2: design.y - offsetY + design.size.height * design.scaleY,
    cx: design.x - offsetX + (design.size.width * design.scaleX) / 2,
    cy: design.y - offsetY + (design.size.height * design.scaleY) / 2,
  };
  return {
    bbox: dp,
  };
}

/**
 * 获取产品信息
 * @param {import('d').view} viewInfo
 * @returns {{bbox:import('d').bbox}}
 */
export function getPrintBox(viewInfo) {
  const ps = {
    x: 0,
    y: 0,
    w: viewInfo.print_width,
    width: viewInfo.print_width,
    h: viewInfo.print_height,
    height: viewInfo.print_height,
    x2: viewInfo.print_width,
    y2: viewInfo.print_height,
    cx: viewInfo.print_width / 2,
    cy: viewInfo.print_height / 2,
  };
  return {
    bbox: ps,
  };
}

/**
 * 判断一个矩形是否在一个大矩形之外(不包含边界,整体在外面)
 * @param {import('d').bbox} rect
 * @param {import('d').bbox} bigRect
 * @returns {boolean} true:在外面 false:在里面
 */
export function isOutSideNode(rect, bigRect) {
  return rect.x2 < bigRect.x || rect.x > bigRect.x2 || rect.y2 < bigRect.y || rect.y > bigRect.y2;
}

/**
 * 是否超出范围
 * @param {import('d').design} design
 */
export function hasOverRange(design) {
  // console.log('design', getBox(design).bbox);
  // console.log('view', getPrintBox(design.$view).bbox);
  const result = isOutSideNode(getBox(design.node).bbox, getPrintBox(design.$view).bbox);
  // console.log('是否超出', result);
  return result;
}
