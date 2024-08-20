import axios from 'axios';
import { Ghost, METHOD } from '@/utils/request';
import { setAxiosHeadersAes } from '@/utils/aes';
import { getLoginKey } from '@/fnConfig/fnRequest/util';
import { interceptorsResponseError, interceptorsResponseFulfilled } from '@/fnConfig/fnRequest/mapper';

// GRequest
export function fnRequest(url, method, params = {}, types = {}) {
  switch (method) {
    case METHOD.GET:
      return axios.get(Ghost + url, { params, ...types });
    case METHOD.POST:
      return axios.post(Ghost + url, params, types);
    default:
      return axios.get(Ghost + url, { params, ...types });
  }
}

export function loadInterceptors() {
  // 请求拦截器(请求发出去之前)
  axios.interceptors.request.use(
    (config) => {
      // 请求头添加token
      config.headers['ssotoken'] = getLoginKey();
      setAxiosHeadersAes();
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
  // 响应拦截器(请求回来之后)
  axios.interceptors.response.use(
    (response) => {
      return interceptorsResponseFulfilled(response);
    },
    (error) => {
      return interceptorsResponseError(error);
    },
  );
}

/**
 * router.js
 * 校验菜单权限
 * 校验登陆状态
 * 白名单
 * 进度条
 *
 *
 * 登陆成功
 * 存储用户信息
 */
