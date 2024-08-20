import { fnRequest } from '@/fnConfig/fnRequest';
import { setAxiosHeadersAes } from '@/utils/aes';
export const host = process.env.VUE_APP_API_SIT_URL;
export const Ghost = process.env.VUE_APP_API_GEN_URL;
// http method
export const METHOD = {
  GET: 'get',
  POST: 'post',
};
setAxiosHeadersAes();

/**
 * axios请求
 * @param url base请求地址
 * @param method {METHOD} http method
 * @param params 请求参数
 * @param types
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function GRequest(url, method, params = {}, types = {}) {
  return fnRequest(...arguments);
}
