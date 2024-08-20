export function useAppUtils() {
  return {
    randomImg,
  };
}
// 随机图片
export function randomImg(width = 40, height = '') {
  if (!height) {
    height = width;
  }
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
}
