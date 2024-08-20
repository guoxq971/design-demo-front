const CryptoJS = require('crypto-js');
// 定义 key 和 IV  key 需要和后台一致
const key = 'H9QHXHHSRH0BVLVP';
//随机盐 需要和后台一致
const iv = 'ito11zi4kgiumomjtr7mc40be5pff7rre';
const pre = 'r6zhwuq8w';
import axios from 'axios';

/**
 * 设置axios请求头
 */
export const setAxiosHeadersAes = () => {
  const { key, sign } = getAes();
  axios.defaults.headers['X-Ca-Key'] = key;
  axios.defaults.headers['X-Ca-Sign'] = sign;
};

/**
 * 获取加密数据
 * @returns {{sign: *, key: number}}
 */
export const getAes = () => {
  // 当前时间的 Unix timestamp
  const now = Math.floor(new Date().getTime() / 1000);
  // 定义待加密数据
  const data =
    pre +
    '_' +
    Math.random()
      .toString(36)
      .substring(2, 8) +
    '_' +
    now;
  const sign = encryptData(data, key, iv);
  return {
    key: now,
    sign: sign,
  };
};

// 加密函数
function encryptData(data, key, st) {
  let i = doSalt(st),
    r = CryptoJS.enc.Utf8.parse(key),
    n = CryptoJS.enc.Utf8.parse(i),
    a = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(a, r, {
    iv: n,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

//iv加盐算法
function doSalt(t) {
  let e = '9ih' + t.substr(5, 13);
  return CryptoJS.SHA256(e)
    .toString()
    .substr(0, 16)
    .toUpperCase();
}
