import { createGlobalState } from '@vueuse/core';
// utils
import { useCommonTemplateTab } from '@/hooksFn/useGlobalDesigner/core/tabs/useCommonTemplateTab';
import { useStatic } from '@/hooksFn/useGlobalDesigner/core/tabs/useStatic';
import { useContextmenu } from '@/hooksFn/useGlobalDesigner/core/contextmenu';
import { useTemplateCategory } from '@/hooksFn/useGlobalDesigner/core/tabs/useTemplateCategory';
import { useCollectTemplate } from '@/hooksFn/useGlobalDesigner/core/tabs/useCollectTemplate';
import { useHover } from '@/hooksFn/useGlobalDesigner/core/hover';
import { useCustomTemplate } from '@/hooksFn/useGlobalDesigner/core/tabs/useCustomTemplate';
import { useMyImage } from '@/hooksFn/useGlobalDesigner/core/tabs/useMyImage';
import { useCollectImage } from '@/hooksFn/useGlobalDesigner/core/tabs/useCollectImage';
import { usePlatformImage } from '@/hooksFn/useGlobalDesigner/core/tabs/usePlatformImage';
import { useBgImage } from '@/hooksFn/useGlobalDesigner/core/tabs/useBgImage';
import { useCollectBgImage } from '@/hooksFn/useGlobalDesigner/core/tabs/useCollectBgImage';
import { useTemplateHistory } from '@/hooksFn/useGlobalDesigner/core/templateHistory/templateHistory';

export const useGlobalDesigner = createGlobalState(() => {
  // 静态
  const staticData = useStatic();

  // 通用模板
  const commonTemplate = useCommonTemplateTab();
  // 收藏模板
  const collectTemplate = useCollectTemplate();
  // 定制模板
  const customTemplate = useCustomTemplate();
  // 模板分类
  const templateCategory = useTemplateCategory();
  // 我的图库
  const myImage = useMyImage();
  // 收藏图库
  const collectImage = useCollectImage();
  // 平台图库
  const platformImage = usePlatformImage();
  // 背景图库
  const bgImage = useBgImage();
  const collectBgImage = useCollectBgImage();

  // 右键菜单(收藏)
  const contextmenu = useContextmenu();
  // 鼠标经过
  const hover = useHover();
  // 保存模板-历史记录
  const templateHistory = useTemplateHistory();

  return {
    // 模板历史记录
    templateHistory,
    // 静态变量
    staticData,
    // 模板
    commonTemplate,
    collectTemplate,
    customTemplate,
    templateCategory,
    // 图库
    myImage,
    collectImage,
    platformImage,
    // 背景图图库
    bgImage,
    collectBgImage,
    // 工具
    contextmenu,
    hover,
  };
});
