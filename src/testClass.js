import { ref, shallowReactive, shallowRef, watch } from 'vue';
import { createGlobalState } from '@vueuse/core';

export const useGlobalTest = createGlobalState(() => {
  const test = ref({
    name: '张三',
    age: 15,
    obj: shallowReactive({
      test: 123,
      testObj: { name: '12' },
    }),
  });
  watch(
    () => test.value.obj.testObj.name,
    (val) => {
      // console.log('val', val);
      // console.log('test', test);
    },
    { immediate: true, deep: true },
  );
  function onTest() {
    const { test } = useGlobalTest();
    test.value.obj.testObj.name = 456;
  }

  // console.log('useGlobalTest');
  return {
    test,
    onTest,
  };
});

/**
模型数据 shallowRef

components
packages
  core
    tabs
    template
    model
    canvas
    tool
    history
    define
  utils
    index.js
      request
      about
      is
      uuid
      proxy
*/

// 常量配置
function useDefine() {}

// 通用模板
function useCommonTemplate() {}
// 收藏模板
function useCollectTemplate() {}
// 定制模板
function useCustomTemplate() {}

// 我的图库
function useMyImage() {}
// 收藏图库
function useCollectImage() {}
// 平台图库
function usePlatformImage() {}

// 背景图库
function useBgImage() {}
// 收藏背景图库
function useCollectBgImage() {}
// 背景色
function useBgColor() {}

// 文字
function useText() {}

// 模板数据
function useTemplateData() {}
// 设置模板
function useSetTemplate() {}
// 切换模板类型
function useSwitchTemplateType() {}
// 设置设计 (设计图,背景图,背景色,文字)
function useSetDesign() {}
// 设计操作
function useDesignOperation() {}
// 保存产品
function useSaveProduct() {}
// 保存定制模板
function useSaveCustomTemplate() {}

// 模板模型
function useTemplateModel() {}
// 多角度模型
function useMultiAngleModel() {}
// 导出模型
function useExportModel() {}

// 创建视图画布
function useCreateViewCanvas() {}
// 画布辅助线
function useCanvasGuideLine() {}
// 画布磁吸
function useCanvasMagnetic() {}

// 右键菜单
function useContextMenu() {}
// hover模板和设计图
function useHover() {}
// 取色器
function useColorPicker() {}

// 设计操作历史记录
function useDesignHistory() {}
// 保存产品历史记录
function useSaveProductHistory() {}
