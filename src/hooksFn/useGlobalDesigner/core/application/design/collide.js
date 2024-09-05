import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';

/**
 * 碰撞检测
 * @param {import('d').design} design
 * @returns {boolean} 是否碰撞 true:碰撞 false:未碰撞
 */
export function isCollide(design) {
  const node = design.node;
  const printWidth = design.$view.print_width;
  const printHeight = design.$view.print_height;
  const offsetX = node.attrs.offsetX * node.attrs.scaleX;
  const offsetY = node.attrs.offsetY * node.attrs.scaleY;
  let x = node.attrs.x - offsetX;
  let y = node.attrs.y - offsetY;
  let width = node.attrs.width * node.attrs.scaleX;
  let height = node.attrs.height * node.attrs.scaleY;
  const rotation = node.attrs.rotation;
  if (rotation !== 0) {
    const rect = getRotatedRectCoords(x, y, width, height, rotation);
    x = rect.x;
    y = rect.y;
    width = rect.width;
    height = rect.height;
  }

  return x < 0 || y < 0 || x + width > printWidth || y + height > printHeight;
}

/**
 * 超出红线
 * @param {import('d').view} view
 */
export function overRed(view) {
  const primary_color = useDesignerAppConfig().primary_color;
  const collideColor = 'red';
  const t = view.canvasNodes.transformer;
  const print_d = view.print_d;
  // 不存在预览轮廓线，需要进行碰撞检测
  if (!print_d) {
    const node = t?.nodes()[0];
    const design = view.designList.find((d) => d.node.attrs.uuid === node.attrs.uuid);
    if (design) {
      if (design.hasCollide()) {
        t.setAttrs({
          borderStroke: collideColor,
          anchorStroke: collideColor,
        });
      } else {
        t.setAttrs({
          borderStroke: primary_color,
          anchorStroke: primary_color,
        });
      }
    } else {
      if (t.attrs.borderStroke === collideColor || t.attrs.anchorStroke === collideColor) {
        t.setAttrs({
          borderStroke: primary_color,
          anchorStroke: primary_color,
        });
      }
    }
  } else {
    if (t.attrs.borderStroke === collideColor || t.attrs.anchorStroke === collideColor) {
      t.setAttrs({
        borderStroke: primary_color,
        anchorStroke: primary_color,
      });
    }
  }
}

/**
 * 获得旋转矩形坐标
 * @param x
 * @param y
 * @param width
 * @param height
 * @param angle
 * @returns {{x: number, width: number, y: number, height: number}}
 */
function getRotatedRectCoords(x, y, width, height, angle) {
  function toNumberFixed(val) {
    return Number(Math.abs(val).toFixed(2));
  }

  // 角度转弧度
  let rad = toNumberFixed((angle * Math.PI) / 180);

  // 中心点
  let cx = x + width / 2;
  let cy = y + height / 2;

  // 四个顶点
  let vertices = [
    { x: x, y: y },
    { x: x + width, y: y },
    { x: x, y: y + height },
    { x: x + width, y: y + height },
  ];

  // 旋转后的顶点
  let rotatedVertices = vertices.map((vertex) => {
    let dx = vertex.x - cx;
    let dy = vertex.y - cy;
    return {
      x: cx + (dx * toNumberFixed(Math.cos(rad)) - dy * toNumberFixed(Math.sin(rad))),
      y: cy + (dx * toNumberFixed(Math.sin(rad)) + dy * toNumberFixed(Math.cos(rad))),
    };
  });

  // 找到旋转后外接矩形的最小和最大坐标
  let minX = Math.min(...rotatedVertices.map((v) => v.x));
  let maxX = Math.max(...rotatedVertices.map((v) => v.x));
  let minY = Math.min(...rotatedVertices.map((v) => v.y));
  let maxY = Math.max(...rotatedVertices.map((v) => v.y));

  // 返回外接矩形的坐标
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
