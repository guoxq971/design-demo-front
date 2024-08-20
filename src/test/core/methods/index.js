// 操作方法
export function useMethods(reactiveData, staticData) {
  // 选择模板
  function setTemplate(templateDetail) {}

  // 选择设计-图
  function setDesignImage(imageDetail) {}
  // 选择设计-颜色
  function setDesignColor(colorCode) {}
  // 选择设计-背景图
  function setDesignBgImage(imageDetail) {}
  // 选择设计-文字
  function setDesignText(textDetail) {}

  return {
    // 模板
    setTemplate,
    // 设计
    setDesignImage,
    setDesignColor,
    setDesignBgImage,
    setDesignText,
  };
}
