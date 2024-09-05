import Konva from 'konva';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

const canvas_type_transformer_text = 'canvas-transformer-text';
export function createNodeTransformer() {
  const transformer = new Konva.Transformer({
    id: useDesignerAppConfig().canvas_nodes_transformer,
    nodes: [],
    visible: false,
    draggable: false, // 是否可拖拽
    flipEnabled: false, // 允许翻转
    ignoreStroke: false, // 忽略边框 (锚点不会被边框遮挡)
    shouldOverdrawWholeArea: true, // 是否允许绘制超出图形边界的区域
    // 锚点
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    anchorFill: '#ffffff', // 锚点的填充色
    anchorStroke: useDesignerAppConfig().primary_color, // 锚点的边框颜色
    anchorCornerRadius: 2, // 锚点的圆角
    anchorStrokeWidth: 1.5, // 锚点的边框宽度
    anchorSize: 15, // 锚点的大小
    // 旋转
    useSingleNodeRotation: true, // 是否使用单节点旋转
    rotateAnchorOffset: 50, // 旋转按钮的偏移量
    rotateAnchorCursor: 'pointer', // 旋转按钮的光标
    // 边框
    borderDash: [4], // 边框的虚线
    borderStrokeWidth: 2, // 边框的宽度
    borderStroke: useDesignerAppConfig().primary_color, // 边框的颜色
    // 缩放
    keepRatio: true, // 保持比例 (缩放时保持比例)
    centeredScaling: true, // 是否启用中心缩放
    // 限制缩放的最大值 (缩放, 旋转时都会触发)
    boundBoxFunc: (oldBox, newBox) => {
      // 是否放大
      const isUp = newBox.width > oldBox.width || newBox.height > oldBox.height;
      // 是否缩小
      const isDown = newBox.width < oldBox.width || newBox.height < oldBox.height;

      const node = transformer.nodes()[0];
      if (!node) return oldBox;

      if (isUp || isDown) {
        // $app.transformerStartType = TRANSFORMER_TYPE.scale;
        // // 最小检测
        // if (isDown && (Math.abs(newBox.width) < 50 || Math.abs(newBox.height) < 50)) {
        //   return oldBox; // 返回旧的
        // }
        //
        // // 最大检测
        // if (
        //   isUp &&
        //   node &&
        //   [
        //     //
        //     DESIGN_TYPE.image,
        //     DESIGN_TYPE.backgroundImage,
        //   ].includes(node.attrs.type) &&
        //   isMax(node)
        // ) {
        //   return oldBox; // 返回旧的
        // } else {
        //   return newBox; // 返回新的(成功放大)
        // }

        return newBox;
      } else {
        // $app.transformerStartType = TRANSFORMER_TYPE.rotation;
        // 绘制旋转角度
        drawRotation(transformer, oldBox, newBox);
        return newBox; // 返回新的(旋转)
      }
    },
  });

  const transformerText = createRotateText();
  transformer.add(transformerText);
  function delText() {
    const text = transformer.findOne(`.${canvas_type_transformer_text}`);
    if (text) {
      text.text('');
    }
  }

  // 按下|抬起
  transformer.on('mousedown', (e) => {
    // 鼠标按下选中当前坐标的最上面那个设计
    // transformMousedown(obj.transformer, obj.stage, obj.designList, e);
    // 辅助线
    // opt.$view.drawLine(LINE_TYPE.down, obj.transformer.node().attrs.$design);
  });
  transformer.on('mouseup', (e) => {
    // 辅助线
    // opt.$view.drawLine(LINE_TYPE.up, obj.transformer.node().attrs.$design);
  });

  // 拖转
  transformer.on('dragend', () => {
    // 更新模型
    // obj.transformer.node()?.attrs?.$design?.updateMesh();
    // 超出红线
    // overRed(obj.transformer, viewInfo.print);
  });
  transformer.on('dragmove', () => {
    // 超出红线
    // overRed(obj.transformer, viewInfo.print);
    // 磁吸
    // opt.$view.magnet(obj.transformer.node()?.attrs?.$design);
  });

  // 缩放|旋转
  transformer.on('transformstart', () => {
    // transformer-旋转|缩放-开始
    // opt.$app.transformerStartDown = true;
  });
  transformer.on('transform', () => {
    // 超出红线
    // overRed(obj.transformer, viewInfo.print);
  });
  // 旋转，缩放结束
  transformer.on('transformend', (transform) => {
    // if (opt.$app.transformerStartType === TRANSFORMER_TYPE.scale) {
    //   obj.transformer.node()?.attrs?.$design?.tileClass?.change(true);
    // } else {
    //   obj.transformer.node()?.attrs?.$design?.tileClass?.change();
    // }
    // 选中框操作类型-重置为空
    // opt.$app.transformerStartType = TRANSFORMER_TYPE.none;
    // transformer-旋转|缩放-结束
    // opt.$app.transformerStartDown = false;
    // 更新模型
    // obj.transformer.node()?.attrs?.$design?.updateMesh();
    // 移除旋转角度
    delText();
    // 更新键监听值
    // obj.transformer.node()?.attrs?.$design?.updateWatch();
    // 记录
    // setTimeout(() => opt.$app.handleHistoryServe.debounceLog());
  });

  return transformer;
}

/**
 * 绘制旋转角度
 * @param transformer
 * @param oldBox
 * @param newBox
 */
function drawRotation(transformer, oldBox, newBox) {
  const text = transformer.children.find((e) => e.attrs.name === canvas_type_transformer_text);
  if (text && transformer.node()) {
    const node = transformer.node();

    // 如果当前是旋转操作
    if (oldBox.rotation !== newBox.rotation) {
      // 旋转的角度和坐标
      let t = node.rotation().toFixed();
      if (t < 0) {
        t = 360 + +t;
      }
      text.text(t + '°');
      text.offsetX((text.width() - newBox.width) / 2);
    }
  }
}

// 正上方添加旋转角度的text
export function createRotateText() {
  return new Konva.Text({
    name: canvas_type_transformer_text,
    text: '',
    fontSize: 20,
    fontFamily: 'Calibri',
    align: 'center',
    fill: useDesignerAppConfig().primary_color,
    offset: { x: 0, y: 100 },
  });
}
