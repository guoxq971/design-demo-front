import { useAxios } from '@vueuse/integrations/useAxios';
import { unref, isRef } from 'vue';
// utils
import { Ghost, METHOD } from '@/utils/request';
import { MessageBox } from 'element-ui';
import { isObject, has } from 'lodash';

export class AppUtil {
  //确认
  static async confirmCollect(msg = '确定取消收藏？') {
    return await MessageBox.confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
  }
  static uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // 获取图片id
  static getImageId(item) {
    // quickimgid是收藏列表进来使用的
    // id是背景图片列表进来使用的
    let id;
    // 这是从收藏列表进来的
    if (item.quickimgid) {
      id = item.seqId;
    } else {
      id = item.id;
    }

    return id;
  }

  // 获取本地用户信息
  static getLocalUserInfo() {
    const local = localStorage.getItem('LOGIN_USER_INFORMATION');
    const notList = ['undefined', 'null', 'NaN', 'false', 'true', '[]', '{}'];
    if (local && !notList.includes(local)) {
      return JSON.parse(local);
    } else {
      return null;
    }
  }

  /**
   * 对象转url
   * @param obj
   * @returns {string}
   */
  static encodeUrl(obj) {
    const str = Object.keys(obj).reduce((pre, cur) => {
      const res = obj[cur] || '';
      return pre + `${cur}=${res}&`;
    }, '');
    return `?${encodeURI(str)}`;
  }

  /**
   * 获取模板图片
   * @param item
   * @returns {{image: string, texture: string}|*|{}}
   */
  static getShowImage(item) {
    if (!item) return {};
    return item.templateImages?.length
      ? {
          image: this.setStartHttp(item.templateImages[1]),
          texture: this.setStartHttp(item.templateImages[0]),
        }
      : item.appearances[0].views[0];
  }

  /**
   * 如果不是http开头就添加一个
   * @param {string} url
   * @returns {string}
   */
  static setStartHttp(url) {
    return url && url.startsWith('http') ? url : process.env.VUE_APP_API_BASE_IMG_URL + url;
  }

  // 判断是否图片
  static isImageUrlPass(url) {
    if (!url) return false;
    return !!(
      url.startsWith('http') &&
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(
        url
          .split('.')
          .pop()
          .toLowerCase(),
      )
    );
  }

  /**
   * 获取可用图片
   * @param detail 图片详情
   * @returns {null|*|string}
   */
  static getImageUrl(detail) {
    if (AppUtil.isImageUrlPass(detail.hdDesignImage)) return detail.hdDesignImage;
    if (AppUtil.isImageUrlPass(detail.designImg)) return detail.designImg;
    if (AppUtil.isImageUrlPass(detail.previewImg)) return detail.previewImg;
    throw new Error('获取可用图片失败');
  }

  /**
   * 对象是否包含某个属性
   * @param obj
   * @param key
   * @returns {boolean}
   */
  static hasOwn(obj, key) {
    return has(obj, key);
  }

  /**
   * 是否对象
   * @param value
   * @returns {boolean}
   */
  static isObject(value) {
    return isObject(value);
  }

  /**
   * 生成 about
   * @returns {{cancel: (function(): *), set: (function(null=): null)}}
   */
  static generateAbout() {
    let about = null;
    const cancel = () => about && about();
    const set = (aboutFn = null) => (about = aboutFn);
    return { cancel, set };
  }

  /**
   * 通用接口封装
   * @param config
   * @param consumer
   * @param callback
   * @returns {Promise<unknown>}
   */
  static async fetch(config, consumer, callback = () => {}) {
    if (typeof config === 'string') {
      config = { url: config, method: METHOD.GET, params: {} };
    } else if (AppUtil.isObject(config) && !config.method) {
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
      if (AppUtil.hasOwn(resp, 'retState')) {
        if (resp.retState !== '0') return Promise.reject('error1');
        callback(resp);
        return resp;
      } else if (AppUtil.hasOwn(resp, 'code')) {
        if (resp.code !== 0) return Promise.reject('error2');
        callback(resp.data);
        return resp.data;
      }
    } finally {
      _loading.close();
      consumer.about?.set();
    }
  }
}
