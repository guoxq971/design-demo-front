import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { nextTick } from 'vue';
import { createDesign } from '@/hooksFn/useGlobalDesigner/core/application/design/createDesign';

/**
 * 添加文字设计
 * @typedef {import('d').view.addText}
 * @param {import('d').textOptions} textOptions
 * @param {import('d').view} view
 * @param {import('d').addImageOptions} options
 */
export async function addText(textOptions, view, options = {}) {
  // console.log('添加文字 textOptions', textOptions);
  options = Object.assign(
    {
      isCenter: true,
      isSetMode: true,
      isSet: true,
      isSort: true,
      attrs: {},
      attrsList: [],
    },
    options,
  );
  /**@type {import('d').design} design */
  let design;
  if (textOptions.uuid) {
    design = view.designList.find((d) => d.attrs.uuid === textOptions.uuid);
    if (design) {
      design.node.setAttrs({
        text: textOptions.text,
        fill: textOptions.fill,
        fontSize: textOptions.fontSize,
        fontFamily: textOptions.fontFamily,
        fontStyle: textOptions.fontItalic + ' ' + textOptions.fontWeight, // 样式
        textDecoration: textOptions.textDecoration,
        fontItalic: textOptions.fontItalic, //自定义
        fontWeight: textOptions.fontWeight, //自定义
        ...options.attrs,
      });
    }
  } else {
    const parent = view.canvasNodes.designGroup;
    /**@type {import('d').design.node} 创建节点*/
    const node = new Konva.Text({
      draggable: true,
      x: 0,
      y: 0,
      fill: textOptions.fill,
      text: textOptions.text,
      fontSize: textOptions.fontSize,
      fontFamily: textOptions.fontFamily,
      fontStyle: textOptions.fontItalic + ' ' + textOptions.fontWeight, // 样式
      textDecoration: textOptions.textDecoration,
      visible: true,
      type: useDesignerAppConfig().design_type_text,
      uuid: AppUtil.uuid(),
      fontItalic: textOptions.fontItalic, //自定义
      fontWeight: textOptions.fontWeight, //自定义
      ...options.attrs,
    });
    // 创建设计
    design = createDesign(node, view);
    // 添加到父节点
    parent.add(node);
    // 添加到view
    view.designList.push(design);
    // 注册监听事件
    design.node.on('mousedown', () => {
      view.setNode(design);
      view.setMode(useDesignerAppConfig().mode_type_edit);
    });
    // 设置选中
    options.isSet && view.setNode(design);
    // 居中
    options.isCenter && design.center();
    // 设置模式
    options.isSetMode && view.setMode(useDesignerAppConfig().mode_type_edit);
  }
  // 设置大小和偏移量
  setSizeAndOffset(design, textOptions);
  // 触发更新canvas
  view.update2DCanvasDebounce();
  // 设置index
  options.isSort && view.setDesignListIndex();
}

/**
 * 文字参数
 * @returns {import('d').textOptions}
 */
export function getTextOptions(textOptions = {}) {
  const _textOptions = Object.assign(
    {
      uuid: '',
      text: textOptions.text,
      fill: textOptions.fill || '#000',
      fontSize: textOptions.fontSize || 20,
      fontFamily: textOptions.fontFamily || 'sans-serif',
      // fontStyle: textOptions.fontItalic + ' ' + textOptions.fontWeight, // 样式
      fontItalic: textOptions.fontItalic || 'normal',
      fontWeight: textOptions.fontWeight || 'normal',
      textDecoration: textOptions.textDecoration || 'none', // 下划线
    },
    textOptions,
  );
  return {
    uuid: _textOptions.uuid,
    text: _textOptions.text,
    fill: _textOptions.fill,
    fontSize: _textOptions.fontSize,
    fontFamily: _textOptions.fontFamily,
    fontItalic: _textOptions.fontItalic,
    fontWeight: _textOptions.fontWeight,
    textDecoration: _textOptions.textDecoration,
  };
}

/**
 * 修正宽度和偏移量
 * @param {import('d').design} design
 * @param {import('d').textOptions} textOptions
 */
function setSizeAndOffset(design, textOptions) {
  // console.log('修正宽度和偏移量', textOptions);
  const node = design.node;
  // 获取原来的文字和字体大小
  const text = node.text();
  const fontSize = node.fontSize();

  // 如果文字和字体大小不一样
  if (text !== textOptions.text || fontSize !== textOptions.fontSize) {
    // 创建一个临时的文字对象
    let tempText = new Konva.Text({
      text: textOptions.text,
      fill: textOptions.fill || '#000',
      fontSize: textOptions.fontSize || 20,
      fontFamily: textOptions.fontFamily || 'Calibri',
      fontStyle: textOptions.fontItalic + ' ' + textOptions.fontWeight, // 样式
      textDecoration: textOptions.textDecoration || 'none', // 下划线
      // textAnchor: textOptions.textAlign || 'left', // 文字对齐方式
      // letterSpacing: textOptions.letterSpacing || 0, // 字间距
      // lineHeight: textOptions.lineHeight || 1, // 行间距
    });
    console.log(tempText.width(), tempText.height());
    node.setAttrs({
      width: tempText.width(),
      height: tempText.height(),
    });
    // 释放
    tempText.destroy();
    tempText = null;
  }

  // 设置偏移量
  nextTick(() => {
    node.setAttrs({
      offsetX: node.width() / 2,
      offsetY: node.height() / 2,
    });
  });
}
