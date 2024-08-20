import { Message, MessageBox } from 'element-ui';
import { ref } from 'vue';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';

export const contextmenus = {
  template: 'template',
  image: 'image',
  bgImage: 'bgImage',
};

export function useContextmenuService({ collectTemplateService, collectImageService, collectBgImageService }) {
  const visible = ref(false);
  const list = [{ key: '1', icon: 'el-icon-caret-left', text: '', fn: null }];

  // 模板类型
  const isTemplate = (type) => type === contextmenus.template;
  // 图片类型
  const isImage = (type) => type === contextmenus.image;
  // 背景图片类型
  const isBgImage = (type) => type === contextmenus.bgImage;
  // 是否打开是否收藏
  const isOpen = (type) => (isTemplate(type) || isImage(type) || isBgImage(type)) && isLogin();

  // 是否登陆 TODO:是否登陆
  function isLogin() {
    return true;
  }
  // 获取收藏列表
  function getCollectList(type) {
    isTemplate(type) && collectTemplateService.getList();
    isImage(type) && collectImageService.getList();
    isBgImage(type) && collectBgImageService.getList();
  }
  // 是否收藏
  function isCollect(data, type) {
    if (isTemplate(type)) return collectTemplateService.isCollect(data);
    if (isImage(type)) return collectImageService.isCollect(data);
    if (isBgImage(type)) return collectBgImageService.isCollect(data);
  }
  // 收藏
  function collect(data, type) {
    if (isTemplate(type)) return collectTemplateService.collect(data);
    if (isImage(type)) return collectImageService.collect(data);
    if (isBgImage(type)) return collectBgImageService.collect(data);
  }
  // 取消收藏
  function collectCancel(data, type) {
    if (isTemplate(type)) return collectTemplateService.collectCancel(data);
    if (isImage(type)) return collectImageService.collectCancel(data);
    if (isBgImage(type)) return collectBgImageService.collectCancel(data);
  }
  // 注册事件
  function registerFn(data, type) {
    return async () => {
      await isLogin();
      const result = isCollect(data, type);
      if (result) {
        await AppUtil.confirmCollect();
        // 取消收藏
        await collectCancel(data, type);
      } else {
        // 收藏
        await collect(data, type);
      }
      Message.success('操作成功');

      // 重新获取收藏列表
      getCollectList(type);
    };
  }

  // 右键菜单事件
  function onContextmenu(e, data, type) {
    if (!isOpen(type)) return;
    e.preventDefault();
    // 注册事件
    const item = list[0];
    item.text = isCollect(data, type) ? '取消收藏' : '收藏';
    item.fn = registerFn(data, type);
    // 打开弹窗
    visible.value = true;
  }

  return {
    list,
    visible,
    onContextmenu,
  };
}
