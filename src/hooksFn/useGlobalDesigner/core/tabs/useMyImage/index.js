import { ref } from 'vue';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { METHOD } from '@/utils/request';
import { fnFetch, generateAbout } from '@/hooksFn/useGlobalDesigner/utils';

export function useMyImage() {
  const list = ref([]);
  const total = ref(0);
  const params = ref(generateParams());
  const loading = ref(false);
  const about = generateAbout();
  // 账号列表
  const accountListService = useAccountListService();

  async function getList() {
    const _params = {
      ...params.value,
      offset: (params.value.pageNum - 1) * params.value.pageSize || 0,
      limit: params.value.pageSize,
    };

    // 专属共享类判断
    const { isExclusive, __params } = useExclusive()._isExclusive(_params);

    // 正常获取列表
    if (!isExclusive) {
      await _normalGetList(__params);
    }
    // 专属共享类
    else {
      await _exclusiveGetList(__params);
    }
  }
  function onSearch() {
    params.value.pageNum = 1;
    getList();
  }
  // 正常获取列表
  async function _normalGetList(_params) {
    const config = {
      url: `/base-web/CMDesignImageAct/getDesignImageList.act${AppUtil.encodeUrl(_params)}`,
      method: METHOD.GET,
      // params: _params,
    };
    const { designs, count } = await fnFetch(config, { about, loading });
    list.value = designs;
    total.value = count;
  }
  // 专属共享类
  async function _exclusiveGetList(_params) {
    const config = {
      url: `/base-web/CMDesignImageAct/getTopicDesignerShareList.act${AppUtil.encodeUrl(_params)}`,
      method: METHOD.GET,
      // params: _params,
    };
    const { list: l, count } = await fnFetch(config, { about, loading });
    list.value = l;
    total.value = count;
  }

  return {
    list,
    total,
    params,
    loading,
    about,
    getList,
    onSearch,
    accountListService,
  };
}

// 账号列表
function useAccountListService() {
  const list = ref([]);
  const loading = ref(false);
  const about = generateAbout();
  async function getList() {
    const config = {
      url: `/base-web/YZAccountAct/getAccountList4Designer`,
      method: METHOD.POST,
      // params: _params,
    };
    let arr = await fnFetch(config, { about, loading });
    arr = arr.filter((e) => e.id !== '').map((item) => ({ label: item.name, value: item.id, right: item.userName }));
    arr.unshift({ label: useExclusive().exclusives.label, value: useExclusive().exclusives.value, right: '' });
    arr.unshift({ label: '全部图片来源', value: '', right: '' });

    // 设置right
    arr.forEach((e) => {
      const right = e.right ? `(${e.right})` : '';
      e.label = `${e.label}${right}`;
    });
    list.value = arr;
  }
  return {
    loading,
    list,
    getList,
  };
}

export function generateParams() {
  return {
    query: '', //标题、编号
    typeId: '', //【请选择图片来源-专属共享类】所有图案
    customerId: '', //【请选择图片来源-非专属共享类】子账号 (-1=专享共享图)
    imageType: '', //图片格式 全部 .png .jpg
    total: 0,
    pageNum: 1,
    pageSize: 3 * 6,

    mediaType: 'json',
    gxtype1: '', //共享类-一级下拉
    gxtype2: '', //共享类-二级下拉
    basetype: '', //平台图库-一级下拉
    nexttype: '', //平台图库-二级下拉
    gxsx: 0, //共享类-筛选未使用的共享类 0-不筛选 1-筛选
    templateNo: '',
    orderImg: '',
    gxcopyright: '', //共享类-是否侵权 ''-全部 1-是 0-否 2-漂白
    gxImgQuality: '', //共享类-图片质量 0-未分类 1-精品 2-良
    gxSearchText: '',
    designerId: '', //插画师  -1全部 1无风险 2微风险 3较风险 4高风险
    tort_type: -1, //风险等级   -1全部 1无风险 2微风险 3较风险 4高风险
    isAll: '', //是否全幅 ''-全部 1-是 0-否
    copyright: '', //是否侵权 ''-全部 1-是 0-否 2-漂白
    quality: '', //图片质量 0-未分类 1-精品 2-良
    'qty[from]': '', //出单次数开始
    'qty[to]': '', //出单次数开始
    'width[from]': '', //宽度范围开始
    'width[to]': '', //宽度范围结束
    'height[from]': '', //高度范围开始
    'height[to]': '', //高度范围结束
    'created[from]': '', //上传时间范围开始
    'created[to]': '', //上传时间范围开始
    'modified[from]': '', //最近修改时间范围开始
    'modified[to]': '', //最近修改时间范围开始
  };
}

function useExclusive() {
  const exclusives = {
    label: '专属共享图片',
    value: 'fn-EXCLUSIVE_TYPE-not',
  };

  // 专属共享类判断
  function _isExclusive(_params) {
    let __params = { ..._params };
    let isExclusive = false;
    let typeId = _params.typeId;
    let customerId = _params.customerId;
    if (_params.customerId === exclusives.value && _params.customerId !== '') {
      isExclusive = true;
      typeId = _params.customerId;
      customerId = '';
    }
    _params.typeId = typeId;
    _params.customerId = customerId;

    return { isExclusive, __params };
  }

  return {
    exclusives,
    _isExclusive,
  };
}
