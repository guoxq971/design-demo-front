import { useImage } from '@vueuse/core';

/**
 * 加载图片
 * @param {string} src
 * @param {string|number} width
 * @param {string|number} height
 * @returns {Promise<HTMLImageElement>}
 */
export async function loadImage(src, width, height) {
  // 加载图片
  const result = await useImage({ src, crossorigin: true, width, height });
  if (!result.isReady.value) return Promise.reject('图片加载失败1');
  if (!result.state.value) return Promise.reject('图片加载失败2');
  return result.state.value;
}
