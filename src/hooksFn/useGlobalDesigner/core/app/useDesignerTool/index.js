import { createGenerateBase64 } from '@/hooksFn/useGlobalDesigner/core/app/useViewBase64';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
import { setNodeClipFunc } from '@/hooksFn/useGlobalDesigner/core/app/useCanvas/canvasClip';
import { useDebounceFn } from '@vueuse/core';
import { Message } from 'element-ui';

// 设计帮助函数
export function useDesignerAppTool(view) {
  /**
   * 选中节点 【transformer】
   * @param node
   * @param view
   */
  function setNode(node = null, view = null) {
    view = view || useGlobalDesigner().app.activeView.value;
    const { transformer } = view.canvasNodes;
    const { activeDesignId, activeTemplate, activeViewId } = useGlobalDesigner().app;

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
  }

  //节点是否选中
  function isNodeActive(node) {
    const { activeDesignId } = useGlobalDesigner().app;
    return node.attrs.uuid === activeDesignId.value;
  }

  // base64
  const { generateBase64Debounce, generateBase64 } = createGenerateBase64(view);

  /**
   * 设置模式
   */
  function setMode(mode, view = null) {
    view = view ? view : useGlobalDesigner().app.activeView.value;
    const { modes } = useGlobalDesigner().app.config;
    const targetNode = view.canvasNodes.designGroup;
    switch (mode) {
      // 预览模式
      case modes.preview:
        if (view.d_2d) {
          setNodeClipFunc(targetNode, view.d_2d);
        } else {
          setNodeClipFunc(targetNode, null);
        }
        break;
      // 编辑模式
      case modes.edit:
        if (view.printout) {
          setNodeClipFunc(targetNode, { width: view.width, height: view.height, gap: 2 });
        } else {
          setNodeClipFunc(targetNode, null);
        }
        break;
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
    design.node.moveUp();
  }

  // 下移
  function downDesign(design) {
    design.node.moveDown();
  }

  // 置顶
  function topDesign(design) {
    design.node.moveToTop();
  }

  // 置底
  function bottomDesign(design) {
    design.node.moveToBottom();
  }

  // 显示隐藏
  function visibleDesign(design) {
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

  return {
    setNode,
    setMode,
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
    generateBase64,
  };
}
