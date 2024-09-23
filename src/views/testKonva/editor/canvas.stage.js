import Konva from 'konva';

/**
 * 创建画布
 */
class CanvasStage {
  constructor(editor, container, view) {
    this.editor = editor;

    this.view = view;

    this.stage = null;
    this.layer = null;
    this.staticLayer = null;
    this.container = container;

    // this.execute();
  }

  execute() {
    const stage = new Konva.Stage({
      container: this.container,
      width: 500,
      height: 500,
    });

    const layer = new Konva.Layer();
    const staticLayer = new Konva.Layer();
    stage.add(layer);
    stage.add(staticLayer);

    this.stage = stage;
    this.layer = layer;
    this.staticLayer = layer;

    this.view.stage = stage;
    this.view.layer = layer;
    this.view.staticLayer = staticLayer;
  }
}

export { CanvasStage };
