import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { loadImage } from '@/hooksFn/useGlobalDesigner/core/application/design/loadImage';
import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/application/design/imageSize';
import { pick } from 'lodash';

const config = {
  stage_width: 500,
  stage_height: 500,
  pixel_ratio: 1200 / 500,
};

/**
 * 离屏渲染模板为base64
 * @param {import('d').template} template
 * @returns {Promise<import('d').offScreenTemplate>}
 */
export function offScreenTemplateToBase64(template) {
  const result = {
    ...pick(template, ['isCommon', 'isRefine', 'size', 'sizeType', 'is3d', 'detail', 'config', 'exportConfig', 'templateNo', 'uuid']),
    viewList: [],
  };
  return new Promise(async (resolve, reject) => {
    try {
      for (let view of template.viewList) {
        // 创建stage
        const { container, stage, layer, designGroup, bgcGroup, bgGroup } = createStage(view);
        // 添加设计图
        for (let design of view.designList.toReversed()) {
          if (design.isImage) {
            // console.log('设计图');
            const { node } = await addImage(design, view);
            designGroup.add(node);
          } else if (design.isBackgroundColor) {
            // console.log('背景色');
            const { node } = addBgc(design);
            bgcGroup.add(node);
          } else if (design.isBackgroundImage) {
            // console.log('背景图');
            const { node } = await addImage(design, view);
            bgGroup.add(node);
          }
        }
        // 等待渲染完成
        setTimeout(() => {
          layer.toDataURL({
            pixelRatio: config.pixel_ratio,
            callback: function(dataUrl) {
              // console.log('dataUrl', dataUrl);
              // 销毁
              container.remove();
              stage.destroyChildren();
              stage.destroy();
              // 添加
              result.viewList.push({
                viewId: view.id,
                base64: dataUrl,
                destroy: () => {
                  // 銷毀base64
                  URL.revokeObjectURL(dataUrl);
                },
              });
              // 判断是否全部渲染完成
              if (result.viewList.length === template.viewList.length) {
                resolve(result);
              }
            },
          });
        });
      }
    } catch (e) {
      console.error('离屏渲染模板为base64出现错误', e);
      reject(e);
    }
  });
}

/**
 * 创建stage
 * @param view
 * @returns {{container: HTMLDivElement, bgcGroup: Konva.Group, stage: Konva.Stage, bgGroup: Konva.Group, designGroup: Konva.Group, layer: Konva.Layer}}
 */
function createStage(view) {
  const container = document.createElement('div');
  const stage = new Konva.Stage({
    container,
    width: config.stage_width,
    height: config.stage_height,
  });
  const layer = new Konva.Layer();
  stage.add(layer);
  // 设计组
  const designGroup = new Konva.Group({
    x: view.offsetX,
    y: view.offsetY,
  });
  // 背景色组
  const bgcGroup = new Konva.Group({
    x: view.offsetX,
    y: view.offsetY,
  });
  // 背景图组
  const bgGroup = new Konva.Group({
    x: view.offsetX,
    y: view.offsetY,
  });
  layer.add(bgcGroup);
  layer.add(bgGroup);
  layer.add(designGroup);

  return {
    container,
    stage,
    layer,
    designGroup,
    bgcGroup,
    bgGroup,
  };
}

/**
 * 添加图片
 * @param {import('d').design} design
 * @param {import('d').view} view
 * @returns {Promise<{node:Konva.Image}>}
 */
async function addImage(design, view) {
  const src = AppUtil.getImageUrl(design.detail);
  const dpi = view.$template.detail.dpi;
  const printSize = view;
  const imgSize = design.detail.size;
  const parseSize = getImageSize(imgSize, dpi, printSize).size;
  const image = await loadImage(src, parseSize.width, parseSize.height);
  const node = new Konva.Image({
    // x: design.attrs.x,
    // y: design.attrs.y,
    // scaleX: design.attrs.scaleX,
    // scaleY: design.attrs.scaleY,
    // rotation: design.attrs.rotation,
    // width: parseSize.width,
    // height: parseSize.height,
    image: image,
    ...design.attrs,
  });

  return { node };
}

/**
 * 添加背景色
 * @param {import('d').design} design
 * @returns {Promise<{node:Konva.Rect}>}
 */
function addBgc(design) {
  const node = new Konva.Rect({
    // x: design.attrs.x,
    // y: design.attrs.y,
    // width: design.attrs.width,
    // height: design.attrs.height,
    // fill: design.attrs.fill,
    ...design.attrs,
  });
  return { node };
}
