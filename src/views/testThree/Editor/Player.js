import { Editor } from './Editor';
import { DemoPlugin } from './Plugin.demo';
import { ScenePlugin } from './Plugin.Scene';

function Player() {
  // 初始化
  const editor = new Editor();
  // demo插件
  editor.use(DemoPlugin);
  // scene插件
  editor.use(ScenePlugin);
}

export { Player };
