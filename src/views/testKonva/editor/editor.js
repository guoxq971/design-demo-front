import { AddDesignImageCommand } from './commands/AddDesignImageCommand';
import { SetDesignTileCommand } from './commands/SetDesignTileCommand';
import { uuid } from './utils.uuid';
import { sleep } from './utils.sleep';
import { CanvasView } from './canvas.view';
import { nextTick } from 'vue';

function Editor(container) {
  const editor = {
    views: {},
    designs: {},
    config: {
      canvas_width: 500,
      canvas_height: 500,
    },
    history: {
      undos: [],
    },
    utils: {
      uuid,
      sleep,
    },
  };

  // 视图
  new CanvasView(editor, container).execute();

  nextTick(() => {
    add();
    tile();
  });

  // 新增设计
  function add() {
    const view = Object.values(editor.views)[0];
    new AddDesignImageCommand(editor, view).execute();
  }

  // 平铺设计
  function tile() {
    const design = Object.values(editor.designs)[0];
    new SetDesignTileCommand(editor, design).execute();
  }

  return {
    add,
    tile,
  };
}

export { Editor };
