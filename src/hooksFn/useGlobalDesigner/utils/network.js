import { isRef, unref } from 'vue';
import { useAxios } from '@vueuse/integrations/useAxios';
// utils
import { Ghost, METHOD } from '@/utils/request';
import { isObject } from 'lodash';

/**
 * 通用接口封装
 * @param config
 * @param consumer
 * @param callback
 * @returns {Promise<unknown>}
 */
export async function fnFetch(config, consumer, callback = () => {}) {
  if (typeof config === 'string') {
    config = { url: config, method: METHOD.GET, params: {} };
  } else if (isObject(config) && !config.method) {
    config.method = METHOD.GET;
  }
  const { url, method, params } = config;

  const _loading = {
    open: () => {
      isRef(consumer.loading) ? (consumer.loading.value = true) : (consumer.loading = true);
    },
    close: () => {
      isRef(consumer.loading) ? (consumer.loading.value = false) : (consumer.loading = false);
    },
  };

  try {
    consumer.about?.cancel();
    _loading.open();
    const { execute, abort, data } = useAxios({ baseURL: Ghost });
    consumer.about?.set(abort);
    let _config = {};
    if (method === METHOD.GET) {
      _config = { params: params, method: method };
    } else if (method === METHOD.POST) {
      _config = { data: params, method: method };
    }
    const result = await execute(url, _config);
    const resp = unref(result.data);
    if (Reflect.has(resp, 'retState')) {
      if (resp.retState !== '0') return Promise.reject('error1');
      callback(resp);
      return resp;
    } else if (Reflect.has(resp, 'code')) {
      if (resp.code !== 0) return Promise.reject('error2');
      callback(resp.data);
      return resp.data;
    }
  } finally {
    _loading.close();
    consumer.about?.set();
  }
}

/**
 * 生成 about
 * @returns {{cancel: (function(): *), set: (function(null=): null)}}
 */
export function generateAbout() {
  let about = null;
  const cancel = () => about && about();
  const set = (aboutFn = null) => (about = aboutFn);
  return { cancel, set };
}
