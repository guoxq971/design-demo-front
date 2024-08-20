import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';

export const apis = {
  // 模板
  // 模板列表-通用
  template_list_by_common: () => '/base-web/CMProductTemplateAct/selectTemplateList4Design.act',
  // 模板列表-收藏
  template_list_by_collect: () => '/base-web/CMProductTemplateAct/selectTemplateList4Design.act',
  // 收藏模板
  template_collect: () => `/base-web/cm/cmProductTemplateCollect/save`,
  // 取消收藏模板
  template_cancel_collect: (seqId) => `/base-web/cm/cmProductTemplateCollect/delete/${seqId}`,
  // 模板列表-定制
  template_list_by_custom: (pageNum, pageSize) => `/basic-web/template/cmProductTemplateCustom/customTemplateList/${pageNum}/${pageSize}`,
  // 模板列表-定制详情
  template_list_by_custom_detail: (pageNum, pageSize) => `/basic-web/template/cmProductTemplateCustom/customDetailList/${pageNum}/${pageSize}`,
  // 模板分类
  template_category_list: () => '/base-web/CMProductTemplateTypeAct/productTypeDepartments.act',

  // 设计图
  // 设计图列表-我的
  image_list_by_my: (params) => `/base-web/CMDesignImageAct/getDesignImageList.act${AppUtil.encodeUrl(params)}`,
  // 设计图列表-我的-专属共享类
  image_list_by_exclusive: (params) => `/base-web/CMDesignImageAct/getTopicDesignerShareList.act${AppUtil.encodeUrl(params)}`,
  // 账号列表
  account_list: () => `/base-web/YZAccountAct/getAccountList4Designer`,
  // 设计图列表-平台
  image_list_by_platform: (params) => `/base-web/CMDesignImageAct/getPlatformDesignImageList.act${AppUtil.encodeUrl(params)}`,
  // 设计图列表-收藏
  image_list_by_collect: () => `/base-web/CMDesignImageQuickAct/queryQuickImageListSJ.act`,
  //设计图-取消收藏
  image_collect: () => `/base-web/CMDesignImageQuickAct/saveQuickDesignImageSJ.act`,
  //设计图-取消收藏
  image_cancel_collect: (quickimgid) => `/base-web/CMDesignImageQuickAct/deleteImage.act?seqId=${quickimgid}`,
  // 背景图列表-通用
  bg_image_list_by_common: (params) => `/base-web/CMDesignImageAct/getBgDesignsList.act${AppUtil.encodeUrl(params)}`,
  // 背景图列表-收藏
  bg_image_list_by_collect: () => `/base-web/CMDesignImageQuickAct/queryQuickImageList.act`,
  // 背景图-收藏
  bg_image_collect: () => `/base-web/CMDesignImageQuickAct/saveQuickDesignImage.act`,
  // 背景图-取消收藏
  bg_image_cancel_collect: (quickimgid) => `/base-web/CMDesignImageQuickAct/deleteImage.act?seqId=${quickimgid}`,
};
