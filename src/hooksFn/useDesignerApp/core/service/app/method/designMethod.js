export function desginMethod(data) {
  const {
    // data
    templateList,
    activeTemplateId,
    activeViewId,
    activeSizeId,
    activeColorId,
    activeDesignId,
    // computed
    activeTemplate,
    activeView,
    activeSize,
    activeColor,
  } = data;

  function sortDesignListByDesignNodeList(designList, designGroup) {
    designGroup
      .getChildren()
      .map((node) => ({ uuid: node.attrs.uuid, zIndex: node.getZIndex() }))
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((item, index) => {
        const design = designList.find((design) => design.uuid === item.uuid);
        design.zIndex = index;
      });
  }

  /**
   * 获取设计信息
   * @param {*} design
   * @returns
   */
  function getDesignInfo(design) {
    const { templateId, viewId, uuid } = design;
    const template = templateList.value.find((item) => item.detail.id === templateId);
    const view = template.viewList.find((item) => item.id === viewId);
    const { helper, designList } = view;
    const { findNode, canvasNode } = helper;
    const node = findNode(uuid);

    return {
      template,
      view,
      node,
      helper: view.helper,
      uuid,
    };
  }

  /**
   * 显示/隐藏
   */
  function visible(design) {
    const { node, helper, uuid } = getDesignInfo(design);
    const { hasCheckNode, setNode } = helper;

    const visible = !node.visible();
    node.visible(visible);
    if (!visible) {
      hasCheckNode(uuid) && setNode(null);
    } else {
      setNode(node);
    }
  }

  /**
   * 置顶
   */
  function top(design) {
    const { node } = getDesignInfo(design);
    node.moveToTop();
  }

  /**
   * 置底
   * */
  function bottom(design) {
    const { node } = getDesignInfo(design);
    node.moveToBottom();
  }

  /**
   * 上移
   */
  function up(design) {
    const { node } = getDesignInfo(design);
    node.moveUp();
  }

  /**
   * 下移
   */
  function down(design) {
    const { node } = getDesignInfo(design);
    node.moveDown();
  }

  return {
    visible,
    top,
    bottom,
    up,
    down,
  };
}

