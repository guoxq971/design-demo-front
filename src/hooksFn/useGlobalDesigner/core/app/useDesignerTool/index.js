import { createGenerateBase64 } from '@/hooksFn/useGlobalDesigner/core/app/useViewBase64';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { setNodeClipFunc } from '@/hooksFn/useGlobalDesigner/core/app/useCanvas/canvasClip';
import { useDebounceFn } from '@vueuse/core';
import { Message, MessageBox } from 'element-ui';
import { getImageSize } from '@/hooksFn/useGlobalDesigner/core/app/useDesign/imageSize';

// 设计帮助函数
export function useDesignerAppTool(view) {
  // 获取激活的节点
  function getActiveNode() {
    const { activeDesignId, activeTemplate, activeViewId } = useGlobalDesigner().app;
    return activeTemplate.value.viewList.find((v) => v.id === activeViewId.value).designList.find((d) => d.uuid === activeDesignId.value);
  }
  // 获取视图
  function getView() {
    return view ? view : useGlobalDesigner().app.activeView.value;
  }

  /**
   * 选中节点 【transformer】
   * @param node
   * @param view
   */
  function setNode(node = null, view = null) {
    view = view || useGlobalDesigner().app.activeView.value;
    const { transformer } = view.canvasNodes;
    const { activeDesignId, activeTemplate, activeViewId } = useGlobalDesigner().app;
    const { modes } = useGlobalDesigner().app.config;

    const nodes = node ? [node] : [];
    const visible = !!node;
    transformer.nodes(nodes);
    transformer.visible(visible);
    // 设置当前激活的设计图;
    if (nodes.length) {
      activeDesignId.value = nodes[0].attrs.uuid;
    } else {
      activeDesignId.value = '';
    }
    // 隐藏其他视图的选中框;
    activeTemplate.value.viewList.forEach((v) => {
      v.id !== activeViewId.value && v.canvasNodes.transformer.nodes([]);
    });

    setMode(modes.edit, view);
  }

  //节点是否选中
  function isNodeActive(node) {
    const { activeDesignId } = useGlobalDesigner().app;
    return node.attrs.uuid === activeDesignId.value;
  }

  // base64
  const { generateBase64Debounce, generateBase64, generateBase64Fn } = createGenerateBase64(view);

  /**
   * 设置模式
   */
  function setModeEdit() {
    setMode(useGlobalDesigner().app.config.modes.edit);
  }
  function setMode(mode, view = null) {
    view = view ? view : useGlobalDesigner().app.activeView.value;
    const { modes, createCanvasIds } = useGlobalDesigner().app.config;
    const targetNodes = [view.canvasNodes.designGroup, view.canvasNodes.bgGroup, view.canvasNodes.bgcGroup];

    // three
    if (useGlobalDesigner().app.activeTemplate.value.three) {
      switch (mode) {
        // 预览模式
        case modes.preview:
          useGlobalDesigner().app.activeTemplate.value.three.animateFlag = true;
          break;
        // 编辑模式
        case modes.edit:
          useGlobalDesigner().app.activeTemplate.value.three.animateFlag = false;
          break;
      }
    }

    // 设置裁剪属性
    const d = has3d() ? get3dViewConfig(view.id)?.uvD : view.print_d;
    switch (mode) {
      // 预览模式
      case modes.preview:
        if (d) {
          targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, d));
        } else {
          targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, null));
        }
        break;
      // 编辑模式
      case modes.edit:
        // 如果是全幅产品
        if (view.printout) {
          // targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, { width: view.width, height: view.height, gap: 2 }));
          targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, null));
        } else {
          if (d) {
            targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, d));
          } else {
            targetNodes.forEach((targetNode) => setNodeClipFunc(targetNode, null));
          }
        }
        break;
    }

    // 设置车线
    const design_printout_d = view.canvasNodes.staticLayer.findOne((node) => node.attrs.type === createCanvasIds.design_printout_d);
    const design_printout_v = view.canvasNodes.staticLayer.findOne((node) => node.attrs.type === createCanvasIds.design_printout_v);
    const design_draw_black = view.canvasNodes.staticLayer.findOne((node) => node.attrs.type === createCanvasIds.design_draw_black);
    switch (mode) {
      // 预览模式
      case modes.preview:
        design_printout_d?.visible(false);
        design_printout_v?.visible(false);
        design_draw_black?.visible(false);
        break;
      // 编辑模式
      case modes.edit:
        design_printout_d?.visible(true);
        design_printout_v?.visible(true);
        design_draw_black?.visible(true);
        break;
    }

    // 设置模式
    useGlobalDesigner().app.mode.value = mode;
    // 生成base64
    useGlobalDesigner()
      .app.tool(view)
      .generateBase64Debounce();

    // 获取3d的view配置
    function get3dViewConfig(viewId) {
      if (has3d()) {
        return useGlobalDesigner().app.activeTemplate.value.config.viewList.find((v) => v.viewId == viewId);
      }
    }
    function has3d() {
      return useGlobalDesigner().app.activeTemplate.value.has3d();
    }
  }

  // 是否收藏
  function isCollect(design) {
    if (design.detail.isBg) {
      return useGlobalDesigner().collectBgImage.isCollect(design.detail);
    } else {
      return useGlobalDesigner().collectImage.isCollect(design.detail);
    }
  }

  // 收藏
  const setCollect = useDebounceFn(_setCollect, 300);
  async function _setCollect(design) {
    const isBg = design.detail.isBg;
    const _isCollect = isCollect(design);
    let api;
    let getList;
    if (isBg) {
      if (_isCollect) {
        api = useGlobalDesigner().collectBgImage.collectCancel(design.detail);
        getList = useGlobalDesigner().collectBgImage.getList;
      } else {
        api = useGlobalDesigner().collectBgImage.collect(design.detail);
        getList = useGlobalDesigner().collectBgImage.getList;
      }
    } else {
      if (_isCollect) {
        api = useGlobalDesigner().collectImage.collectCancel(design.detail);
        getList = useGlobalDesigner().collectImage.getList;
      } else {
        api = useGlobalDesigner().collectImage.collect(design.detail);
        getList = useGlobalDesigner().collectImage.getList;
      }
    }
    api?.then((_) => {
      Message.success('操作成功');
      getList();
    });
  }

  // 上移
  function upDesign(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.moveUp();
  }

  // 下移
  function downDesign(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.moveDown();
  }

  // 置顶
  function topDesign(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.moveToTop();
  }

  // 置底
  function bottomDesign(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.moveToBottom();
  }

  // 显示隐藏
  function visibleDesign(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    const { designs } = useGlobalDesigner().app.config;
    const visible = !design.visible;

    if ([designs.image, designs.bgImage].includes(design.type)) {
      design.node.setAttr('visible', visible);
      !visible && setNode();
    } else if ([designs.bgColor].includes(design.type)) {
      useGlobalDesigner().app.activeTemplate.value.viewList.forEach((view) => {
        view.canvasNodes.bgcGroup.children.forEach((item) => {
          item.attrs.type === designs.bgColor && item.setAttr('visible', visible);
        });
      });
    }
  }

  // 删除
  function delDesign(design) {
    design = design ? design : getActiveNode();
    if (!design) return;

    const { designs } = useGlobalDesigner().app.config;
    const isActive = isNodeActive(design.node);

    if (design.type === designs.image) {
      design.node.destroy();
      isActive && setNode();
      const tool = useGlobalDesigner().app.tool();
      tool.generateBase64Debounce();
    } else if ([designs.bgImage].includes(design.type)) {
      useGlobalDesigner().app.activeTemplate.value.viewList.forEach((view) => {
        const d = view.designList.find((d) => d.type === designs.bgImage);
        const tool = useGlobalDesigner().app.tool(view);
        // 如果是激活元素
        if (d.uuid === useGlobalDesigner().app.activeDesignId.value) {
          tool.setNode();
        }
        // 销毁
        d && d.node.destroy();
        // 生成base64
        tool.generateBase64Debounce();
      });
    } else if ([designs.bgColor].includes(design.type)) {
      useGlobalDesigner().app.activeTemplate.value.viewList.forEach((view) => {
        const d = view.designList.find((d) => d.type === designs.bgColor);
        const tool = useGlobalDesigner().app.tool(view);
        // 销毁
        d && d.node.destroy();
        // 生成base64
        tool.generateBase64Debounce();
      });
    }
  }

  // 水平居中
  function centerX(design) {
    view = getView();
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.x(view.width / 2);
  }

  // 垂直居中
  function centerY(design) {
    view = getView();
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.y(view.height / 2);
  }

  // 水平垂直居中
  function centerXY(design) {
    view = getView();
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.x(view.width / 2);
    design?.node.y(view.height / 2);
  }

  // 放大
  function scaleUp(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.setAttrs({
      scaleX: Math.abs(design.node.scaleX() + 0.01 * (design.node.scaleX() < 0 ? -1 : 1)) * (design.node.scaleX() < 0 ? -1 : 1),
      scaleY: Math.abs(design.node.scaleY() + 0.01 * (design.node.scaleY() < 0 ? -1 : 1)) * (design.node.scaleY() < 0 ? -1 : 1),
    });
  }

  // 缩小
  function scaleDown(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.setAttrs({
      scaleX: Math.abs(design.node.scaleX() - 0.01 * (design.node.scaleX() < 0 ? -1 : 1)) * (design.node.scaleX() < 0 ? -1 : 1),
      scaleY: Math.abs(design.node.scaleY() - 0.01 * (design.node.scaleY() < 0 ? -1 : 1)) * (design.node.scaleY() < 0 ? -1 : 1),
    });
  }

  // 旋转
  function rotationRight(design, angle = 5) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.rotation(design.node.rotation() + angle);
  }

  // 旋转归0
  function rotationReset(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.rotation(0);
  }

  // 旋转
  function rotationLeft(design, angle = 5) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.rotation(design.node.rotation() - angle);
  }

  // 水平翻转
  function flipX(design) {
    design = design ? design : getActiveNode();
    design?.node.scaleX(-design.node.scaleX());
  }

  // 垂直翻转
  function flipY(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    design?.node.scaleY(-design.node.scaleY());
  }

  // 清空当前视图
  async function clearView() {
    await MessageBox.confirm('是否清空当前视图', '提示', {});
    view = getView();
    const { designGroup, bgGroup, bgcGroup } = view.canvasNodes;
    designGroup.destroyChildren();
    bgGroup.destroyChildren();
    bgcGroup.destroyChildren();
    setNode();
    generateBase64Debounce();
  }

  // 清空全部视图
  async function clearAllView() {
    await MessageBox.confirm('是否清空全部视图', '提示', {});
    const { viewList } = useGlobalDesigner().app.activeTemplate.value;
    viewList.forEach((view) => {
      const { designGroup, bgGroup, bgcGroup } = view.canvasNodes;
      designGroup.destroyChildren();
      bgGroup.destroyChildren();
      bgcGroup.destroyChildren();
      const tool = useGlobalDesigner().app.tool(view);
      tool.setNode();
      tool.generateBase64Debounce();
    });
  }

  // 最大化
  function max(design = null, type = '') {
    design = design ? design : getActiveNode();
    if (!design) return;
    view = getView();
    const { designs } = useGlobalDesigner().app.config;
    if ([designs.text].includes(design?.type)) {
      // Message.warning('文字不能最大化操作');
      return false;
    }

    const dpi = useGlobalDesigner().app.activeTemplate.value.detail.dpi;
    const inch = getImageSize(design.detail.size, dpi, { width: view.width, height: view.height }).inch;
    const maxScale = getScaleMax(type, inch, view, { width: design.node.width(), height: design.node.height() });
    // 最大化
    design.node.setAttrs({
      scaleX: maxScale.scaleX,
      scaleY: maxScale.scaleY,
    });
    // 0度
    design.node.rotation(0);
    // 居中
    design.node.setAttrs({
      x: view.width / 2,
      y: view.height / 2,
    });
  }

  // 复制
  async function copy(design) {
    design = design ? design : getActiveNode();
    if (!design) return;
    const { designs } = useGlobalDesigner().app.config;
    if ([designs.bgImage, designs.bgColor].includes(design.type)) {
      Message.warning('背景图不能复制');
      return;
    }
    if ([designs.image].includes(design.type)) {
      const attrs = {
        x: design.node.x() + 10,
        y: design.node.y() + 10,
        rotation: design.node.rotation(),
        scaleX: design.node.scaleX(),
        scaleY: design.node.scaleY(),
      };
      await useGlobalDesigner().app.setDesignImage(design.detail, { attrs, isCenter: false });
    }
  }

  return {
    setNode,
    setMode,
    setModeEdit,
    // 复制
    copy,
    // 最大化
    max,
    // 清空
    clearView,
    clearAllView,
    // 翻转
    flipX,
    flipY,
    // 旋转
    rotationRight,
    rotationLeft,
    rotationReset,
    // 缩放
    scaleUp,
    scaleDown,
    // 居中
    centerX,
    centerY,
    centerXY,
    // 图层
    upDesign,
    downDesign,
    topDesign,
    bottomDesign,
    // 显示隐藏
    visibleDesign,
    // 删除
    delDesign,
    // 收藏
    isCollect,
    setCollect,
    // base64
    generateBase64Debounce,
    generateBase64Fn,
    generateBase64,
  };
}

/**
 * 最大化操作的缩放比例
 * @param {string} type width:宽度 height:高度
 */
export function getScaleMax(type = '', inch, print, imageDOM) {
  const iSize = inch;
  const pSize = print;
  const l = iSize.width / pSize.width; // l:设计图宽/打印区宽
  const p = iSize.height / pSize.height; // p:设计图高/打印区高
  let u;
  // 没有d是非全幅，铺满不能出现红线
  if (print?.d) {
    u = Math.min(l, p); // 取较小值
  } else {
    u = Math.max(l, p); // 取较大值[改]
  }
  if ('width' === type) u = l;
  if ('height' === type) u = p;
  if (u < 1) u = 1;

  // 最大化后的宽高
  const width = iSize.width / u;
  const height = iSize.height / u;

  // imageDom是当前使用的DOM的宽高可能是小图的宽高
  const scaleX = width / imageDOM.width;
  const scaleY = height / imageDOM.height;

  return {
    scaleX: scaleX,
    scaleY: scaleY,
  };
}
