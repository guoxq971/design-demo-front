const keyword = 'renderings';
// 设计图路径是否包含关键字
export const isRenderings = (path) => {
  return path && path.indexOf(keyword) > -1;
};

/**
 * 传入两个路径
 * - 如果path1满足isRenderings，返回path1
 * - 如果path2满足isRenderings，返回''
 * - 如果都不满足，返回path1
 * @param path
 * @param path2
 * @returns {*|string}
 */
export const getPathByRenderings = (path, path2) => {
  let result1 = isRenderings(path);
  let result2 = isRenderings(path2);
  if (result1) {
    return path;
  } else if (result2) {
    return '';
  } else {
    return path;
  }
};
