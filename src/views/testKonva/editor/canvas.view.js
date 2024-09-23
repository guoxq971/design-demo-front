import { CanvasStage } from './canvas.stage';
import { CanvasTransformer } from './canvas.transformer';

class CanvasView {
  constructor(editor, container) {
    this.editor = editor;
    this.container = container;

    this.view = {
      stage: null,
      layer: null,
      staticLayer: null,
      transformer: null,
    };
    this.editor.views[this.editor.utils.uuid()] = this.view;
  }

  execute() {
    // 舞台
    new CanvasStage(this.editor, this.container, this.view).execute();
    // 变换器
    new CanvasTransformer(this.editor, this.view).execute();
  }
}

export { CanvasView };
