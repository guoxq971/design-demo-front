import Konva from 'konva';

class AddDesignImageCommand {
  constructor(editor, view, imageDetail = {}) {
    this.editor = editor;
    this.view = view;
    this.group = null;
    this.node = null;
    this.tile = null;
    this.detail = imageDetail;

    // this.execute();
  }

  execute() {
    const view = this.view;
    const stage = view.stage;
    const layer = view.layer;
    const transformer = view.transformer;
    const uuid = this.editor.utils.uuid();

    const attrs = {
      url: 'https://cdn.pixabay.com/photo/2023/08/11/08/29/highland-cattle-8183107_1280.jpg',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
    };

    const image = new Image();
    image.src = attrs.url;
    image.onload = () => {
      console.log('image loaded');
    };
    image.onerror = () => {
      console.log('image load error');
    };

    // 设计-group
    const group = new Konva.Group({
      uuid: uuid,
      x: 0,
      y: 0,
    });

    // 设计-节点
    const node = new Konva.Image({
      type: 'design',
      x: attrs.x,
      y: attrs.y,
      width: attrs.width,
      height: attrs.height,
      fill: 'transparent',
      draggable: true,
      image: image,
    });

    group.add(node);
    layer.add(group);

    transformer.select(node);

    this.group = group;
    this.node = node;
    this.editor.designs[uuid] = this;
  }

  on() {
    const transformer = this.view.transformer.transformer;
    transformer.on('mouseup transformend', this.tile.bind(this));
  }

  undo() {}
  redo() {}
}

export { AddDesignImageCommand };
