// utils
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';

// 鼠标经过
export function useHover(hoverType) {
  // 鼠标经过
  const { hover, hovers } = useGlobalData();
  // 鼠标经过
  const { enter, leave } = hover;
  const onMouseenter = (e, item) => enter(item, hoverType);
  const onMouseleave = (e, item) => leave();

  return {
    onMouseenter,
    onMouseleave,
    hovers,
  };
}

// 右键菜单
export function useContextmenu(type) {
  // 右键菜单
  const { contextmenu, contextmenus } = useGlobalData();
  const { onContextmenu: onContextmenuFn } = contextmenu;
  const onContextmenu = (e, item) => onContextmenuFn(e, item, type);

  return {
    onContextmenu,
    contextmenus,
  };
}
