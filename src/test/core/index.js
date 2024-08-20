import { useReactiveData } from './data/reactive';
import { useStaticData } from './data/static';
import { useMethods } from './methods';
import { useApis } from '@/test/core/api';

// 设计器
export function useDesignerApp() {
  // 响应式数据
  const reactiveData = useReactiveData();
  // 静态数据
  const staticData = useStaticData();
  const data = {
    vue: reactiveData,
    static: staticData,
  };
  // 接口
  const apis = useApis();
  // 方法
  const methods = useMethods(reactiveData, staticData);

  return {
    methods,
    reactiveData,
    staticData,
    apis,
    data,
  };
}

function demo() {
  // 获取 viewId = 1 的 canvas
  const { data, types } = useDesignerApp();
  const canvas = data.static.canvasMap.get(types.canvas.template).get(types.canvas_by_viewId('id'));
}
