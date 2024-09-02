import { fnRequest } from '@/fnConfig/fnRequest';
import { setAxiosHeadersAes } from '@/utils/aes';
import axios from 'axios';
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

/**
 * axios请求
 * @param url order请求
 * @param method {METHOD} http method
 * @param params 请求参数
 * @returns {Promise<AxiosResponse<T>>GET
 */
export async function DRequest(url, method, params, types = {}) {
  switch (method) {
    case METHOD.GET:
      return axios.get(process.env.VUE_APP_API_DESIGNER_URL + url, { params });
    case METHOD.POST:
      return axios.post(process.env.VUE_APP_API_DESIGNER_URL + url, params, types);
    default:
      return axios.get(process.env.VUE_APP_API_DESIGNER_URL + url, { params });
  }
}
