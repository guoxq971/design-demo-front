import { createInjectionState } from '@vueuse/core';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';
import { useCommonTemplateService } from '@/hooksFn/useDesignerApp/core/service/template/commonTemplateService';
import { reactive } from 'vue';
import { useCustomTemplateService } from '@/hooksFn/useDesignerApp/core/service/template/customTemplateService';
import { useCollectTemplateService } from '@/hooksFn/useDesignerApp/core/service/template/collectTemplateService';
import { useCategoryService } from '@/hooksFn/useDesignerApp/core/service/template/templateCategoryService';
import { useHoverService } from '@/hooksFn/useDesignerApp/core/service/common/hoverService';
import { useContextmenuService } from '@/hooksFn/useDesignerApp/core/service/common/contextmenuService';
import { useMyImageService } from '@/hooksFn/useDesignerApp/core/service/image/myImageService';
import { usePlatformImageService } from '@/hooksFn/useDesignerApp/core/service/image/platformImageService';
import { useCollectImageService } from '@/hooksFn/useDesignerApp/core/service/image/collectImageService';
import { useBgImageService } from '@/hooksFn/useDesignerApp/core/service/bg/bgImageService';
import { useCollectBgImageService } from '@/hooksFn/useDesignerApp/core/service/bg/collectBgImageService';
// import { useAppService } from '@/hooksFn/useDesignerApp/core/service/app/appService';
import { useAppService } from '@/hooksFn/useDesignerApp/core/service/app/appService2';
import { designs, modes, templates } from '@/hooksFn/useDesignerApp/core/service/app/define';

// bus
export function useDesignerApp() {
  // 设计器
  const app = useAppService();

  // 设计图
  const myImage = useMyImageService();
  const platformImage = usePlatformImageService();
  const collectImage = useCollectImageService();

  // 背景图
  const bgImage = useBgImageService();
  const collectBgImage = useCollectBgImageService();

  // 模板
  const commonTemplate = useCommonTemplateService();
  const customTemplate = useCustomTemplateService();
  const collectTemplate = useCollectTemplateService();
  // 模板分类
  const categoryTemplate = useCategoryService();

  // 通用
  const hover = useHoverService();
  const contextmenu = useContextmenuService({
    //
    collectTemplateService: collectTemplate,
    collectImageService: collectImage,
    collectBgImageService: collectBgImage,
  });

  const service = reactive({
    template: {
      common: commonTemplate,
      custom: customTemplate,
      collect: collectTemplate,
      category: categoryTemplate,
      hover,
      contextmenu,
    },
    image: {
      my: myImage,
      platform: platformImage,
      collect: collectImage,
    },
    bg: {
      image: bgImage,
      collect: collectBgImage,
    },
    hover,
    contextmenu,
    app,
    defines: {
      designs,
      modes,
      templates,
    },
  });
  return {
    AppUtil,
    service,
  };
}

// provide/inject
const _ = (_) => _;
const [useProvideApp, useInjectApp] = createInjectionState(_, { injectionKey: 'designer-app' });
export { useProvideApp, useInjectApp };
