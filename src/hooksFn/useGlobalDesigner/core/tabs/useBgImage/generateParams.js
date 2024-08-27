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
