import Konva from 'konva';

class SetDesignTileCommand {
  static tileAttrs = {
    gapX: 0,
    gapY: 0,
    offset: 0,
    offsetType: 0, //0-x 1-y
    mirrorType: 0, //0-无 1-左右 2-上下 3-左右上下
  };

  constructor(editor, design, tileAttrs = {}) {
    this.editor = editor;
    this.design = design;
    this.view = design.view;
    this.tileNode = null;

    this.tileAttrs = Object.assign(tileAttrs, SetDesignTileCommand.tileAttrs);

    // this.execute();
  }

  execute() {
    this.tile();
    this.on();
  }

  on() {
    this.view.transformer.transformer.on('mouseup transformend', this.tile.bind(this));
  }

  off() {
    this.view.transformer.transformer.off('mouseup transformend', this.tile.bind(this));
  }

  // 平铺
  tile() {
    // 销毁已有
    if (this.tileNode) {
      this.tileNode.destroy();
      this.tileNode = null;
    }

    const node = this.design.node;
    const parent = this.design.node.parent;

    const outerGroup = new Konva.Group({
      listening: false,
      x: node.x(),
      y: node.y(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
      rotation: node.rotation(),
    });

    // 坐标数组
    const posList = this.createPosList();

    // 创建平铺
    posList.forEach((pos) => {
      const x = pos.x;
      const y = pos.y;
      const group = this.createGroup(x, y);
      outerGroup.add(group);
    });

    parent.add(outerGroup);
    outerGroup.moveToBottom();

    this.tileNode = outerGroup;
  }

  // 创建坐标数组
  createPosList() {
    const node = this.design.node;
    const tileAttrs = this.tileAttrs;

    // 画布的宽高
    const canvasWidth = this.editor.config.canvas_width;
    const canvasHeight = this.editor.config.canvas_height;
    // 设计的属性(平铺属性参与计算后)
    const x = node.x();
    const y = node.y();
    const nodeWidth = node.width();
    const nodeHeight = node.height();
    const width = (nodeWidth + tileAttrs.gapX) * 2;
    const height = (nodeHeight + tileAttrs.gapY) * 2;

    // 缩放后的设计宽高
    const scaleWidth = nodeWidth * node.scaleX();
    const scaleHeight = nodeHeight * node.scaleY();

    // 计算平铺数量
    const computedNum = (distance, num) => Math.ceil(distance / num);

    // 计算平铺数量(左右上下)
    const rightCount = computedNum(canvasWidth - x, scaleWidth);
    const leftCount = computedNum(x, scaleWidth);
    const topCount = computedNum(y, scaleHeight);
    const bottomCount = computedNum(canvasHeight - y, scaleHeight);

    // 坐标数组
    const posXList = [];
    const posYList = [];
    for (let i = 0; i < rightCount; i++) {
      const newX = i * width;
      const newY = 0;
      posXList.push({ x: newX, y: newY });
    }
    for (let i = 0; i < leftCount; i++) {
      const newX = -(i + 1) * width;
      const newY = 0;
      posXList.push({ x: newX, y: newY });
    }
    for (let i = 0; i < topCount; i++) {
      const newX = 0;
      const newY = -(i + 1) * height;
      posYList.push({ x: newX, y: newY });
    }
    for (let i = 0; i < bottomCount; i++) {
      const newX = 0;
      const newY = i * height;
      posYList.push({ x: newX, y: newY });
    }

    // 最终坐标数组
    const posList = [];
    posXList.forEach((posX) => {
      posYList.forEach((posY) => {
        posList.push({ x: posX.x, y: posY.y });
      });
    });

    return posList;
  }

  // 创建一组平铺(4个)
  createGroup(x = 0, y = 0) {
    const tileAttrs = this.tileAttrs;
    const attrs = this.design.node.attrs;
    const node = this.design.node;

    const group = new Konva.Group({
      x: x,
      y: y,
    });
    /**
     0 1
     2 3
     */
    const COUNT = 4;
    const getX = (i) => {
      let offset = 0;
      if (tileAttrs.offsetType === 0 && [2, 3].includes(i)) {
        offset = tileAttrs.offset;
      }
      const n = i % 2;
      const x = tileAttrs.gapX + attrs.width;
      return n * x + offset;
    };
    const getY = (i) => {
      let offset = 0;
      if (tileAttrs.offsetType === 1 && [1, 3].includes(i)) {
        offset = tileAttrs.offset;
      }
      const n = Math.floor(i / 2);
      const y = tileAttrs.gapY + attrs.height;
      return n * y + offset;
    };
    for (let i = 0; i < COUNT; i++) {
      const cloneNode = node.clone();
      const x = getX(i);
      const y = getY(i);
      cloneNode.setAttrs({
        x: x,
        y: y,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      });
      group.add(cloneNode);
    }

    return group;
  }
}

export { SetDesignTileCommand };
