import { ref } from 'vue';
// utils
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { Message } from 'element-ui';

export function useContextmenu() {
  const visible = ref(false);
  const list = ref([]);

  function isLogin() {
    return true;
  }

  // 模板
  function onContextmenuTemplate(event, data) {
    if (!isLogin()) return;
    event.preventDefault();
    const item = { key: '1', icon: 'el-icon-caret-left', text: '', fn: null };
    list.value = [item];
    item.fn = () => {
      const collectFlag = useGlobalDesigner().collectTemplate.isCollect(data);
      let api;
      const msg = collectFlag ? '取消收藏成功' : '收藏成功';
      if (collectFlag) {
        api = useGlobalDesigner().collectTemplate.collectCancel(data);
      } else {
        api = useGlobalDesigner().collectTemplate.collect(data);
      }
      api.then((_) => {
        Message.success(msg);
        useGlobalDesigner().collectTemplate.getList();
      });
      visible.value = false;
    };
    item.text = useGlobalDesigner().collectTemplate.isCollect(data) ? '取消收藏' : '收藏';
    visible.value = true;
  }

  // 图片
  function onContextmenuImage(event, data) {
    if (!isLogin()) return;
    event.preventDefault();
    const item = { key: '1', icon: 'el-icon-caret-left', text: '', fn: null };
    list.value = [item];
    item.fn = () => {
      let api;
      const collectFlag = useGlobalDesigner().collectImage.isCollect(data);
      const msg = collectFlag ? '取消收藏成功' : '收藏成功';
      if (collectFlag) {
        api = useGlobalDesigner().collectImage.collectCancel(data);
      } else {
        api = useGlobalDesigner().collectImage.collect(data);
      }
      api.then((_) => {
        Message.success(msg);
        useGlobalDesigner().collectImage.getList();
      });
      visible.value = false;
    };
    item.text = useGlobalDesigner().collectImage.isCollect(data) ? '取消收藏' : '收藏';
    visible.value = true;
  }

  // 背景图
  function onContextmenuBgImage(event, data) {
    if (!isLogin()) return;
    event.preventDefault();
    const item = { key: '1', icon: 'el-icon-caret-left', text: '', fn: null };
    list.value = [item];
    item.fn = () => {
      let api;
      const collectFlag = useGlobalDesigner().collectBgImage.isCollect(data);
      const msg = collectFlag ? '取消收藏成功' : '收藏成功';
      if (collectFlag) {
        api = useGlobalDesigner().collectBgImage.collectCancel(data);
      } else {
        api = useGlobalDesigner().collectBgImage.collect(data);
      }
      api.then((_) => {
        Message.success(msg);
        useGlobalDesigner().collectBgImage.getList();
      });
      visible.value = false;
    };
    item.text = useGlobalDesigner().collectBgImage.isCollect(data) ? '取消收藏' : '收藏';
    visible.value = true;
  }

  return {
    visible,
    list,
    onContextmenuTemplate,
    onContextmenuImage,
    onContextmenuBgImage,
  };
}
