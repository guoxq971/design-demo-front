import { Message } from 'element-ui';
import { resStatusList } from '@/fnConfig/fnRequest/util';

// 响应拦截器(请求回来之后) resolve
export function interceptorsResponseFulfilled(response) {
  // el-upload 自定义上传
  if (!response) {
    return {
      code: 0,
      data: '',
      bmNotResponse: true,
    };
  }
  // 文件下载
  else if (response.headers['content-disposition']) {
    return response;
  }
  // 设计器
  else if (response.config.url.indexOf('designer-web') !== -1) {
    if (!response.data.status) {
      Message.error({
        dangerouslyUseHTMLString: true,
        title: '错误',
        message: response.data.msg || '设计接口出现错误',
        showClose: true,
      });
    }
  } else {
    let msg = '';
    const codes = [
      { label: '箱标识别失败', value: 100001 },
      { label: '风控校验失败,请重新校验', value: 100002 },
    ];
    // code 类型
    const newApiCondition = Reflect.has(response.data, 'code') && response.data.code !== 0 && !codes.map((e) => e.value).includes(response.data.code);
    // retState 类型
    const oldApiCondition = Reflect.has(response.data, 'retState') && response.data.retState !== '0';
    if (newApiCondition) {
      msg = response.data.msg || response.data.message || response.data.retMsg;
    } else if (oldApiCondition) {
      msg = response.data.msg || response.data.message || response.data.retMsg;
    }
    if (msg) {
      addMessage(response.status, msg, MESSAGE_INS_TYPE_ERROR);
    }
  }
  return response;
}

// 响应拦截器(请求回来之后) reject
export function interceptorsResponseError(error) {
  const { response } = error;

  // 接口超时
  const originalRequest = error.config;
  if (error.message && error.message.indexOf('timeout') != -1 && !originalRequest._retry) {
    addMessage(response?.status, '请求超时！', MESSAGE_INS_TYPE_ERROR);
    originalRequest._retry = true;
  }

  if (response) {
    // 状态码
    const { status } = response;
    const resStatus = resStatusList.find((item) => item.status === status);
    if (!resStatus) {
      addMessage(response.status, MESSAGE_0, MESSAGE_INS_TYPE_ERROR);
    }
    if (resStatus) {
      const type = response.data?.msg ? MESSAGE_INS_TYPE_ERROR : MESSAGE_INS_TYPE_WARNING;
      const msg = response.data?.msg || resStatus.errMsg;
      addMessage(response.status, msg, type);
    }
    if (resStatus?.fn) {
      resStatus.fn(response);
    }
  }

  return Promise.reject(error);
}

const MESSAGE_INS_TYPE_ERROR = 'error';
const MESSAGE_INS_TYPE_WARNING = 'warning';
const MESSAGE_0 = '未知错误';
const messageList = [];
function getMessage(status, msg) {
  return messageList.find((item) => item.status === status && item.message === msg);
}
function addMessage(status, msg, type) {
  if (!msg) {
    return;
  }
  const d = getMessage(status, msg);
  // 不存在，直接创建
  if (!d) {
    const obj = { status: status, message: msg, ins: null };
    obj.ins = Message[type]({
      message: msg,
      showClose: true,
      onClose: () => (obj.ins = null),
    });
    messageList.push(obj);
  }
  // 存在，但是ins还在，不处理
  else if (d.ins) {
    //
  }
  // 存在，但是ins已经销毁，重新创建
  else if (!d.ins) {
    d.ins = Message[type]({
      message: msg,
      showClose: true,
      onClose: () => (d.ins = null),
    });
  } else {
    console.log('else');
  }
}
