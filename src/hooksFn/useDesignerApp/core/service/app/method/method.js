import { nextTick, set, shallowRef } from 'vue';
import { TemplateUtil } from '../util/templateUtil.js';
import { CanvasUtil } from '../util/canvasUtil/canvasUtil.js';
import { DesignUtil } from '@/hooksFn/useDesignerApp/core/service/app/util/designUtil/designUtil';
import { useDebounceFn } from '@vueuse/core';
import { DEBOUNCE_TIME, designs } from '@/hooksFn/useDesignerApp/core/service/app/define';
import { desginMethod } from './designMethod.js';
import { AppUtil } from '@/hooksFn/useDesignerApp/core/util';

export function useMethod(data) {
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

  // 切换视图
  function setViewId(viewId) {
    activeViewId.value = viewId;
  }
  // 切换颜色
  function setColorId(colorId) {
    activeColorId.value = colorId;
  }
  // 切换尺码
  function setSizeId(sizeId) {
    activeSizeId.value = sizeId;
  }

  /**
   * 设置模板
   * @param {Object} detail
   */
  function setTemplate(detail) {
    // 解析模板详情
    const template = TemplateUtil.parseTemplate(detail);
    const { viewList, colorList, sizeList } = template;
    viewList.forEach((view) => {
      view.base64 = ''; // 预览图
      view.designList = []; // 设计列表
      view.helper = null; // 工具
    });

    // 初始化数据
    templateList.value = [];
    templateList.value.push(template);
    activeTemplateId.value = detail.id;
    activeViewId.value = viewList[0].id;
    activeColorId.value = colorList[0].id;
    activeSizeId.value = sizeList[0].id;

    // 创建canvas
    nextTick(() => {
      template.viewList.forEach((view) => {
        const { helper } = CanvasUtil.createCanvas({ view });
        view.helper = shallowRef(helper);
      });
    });
  }

  /**
   * 添加设计图
   * @param detail
   */
  async function setDesignImage(detail) {
    const { width: viewWidth, height: viewHeight, helper, designList } = activeView.value;
    const { dpi } = activeTemplate.value.detail;
    const { getDesignChildren } = helper;

    // 创建attrs, 添加到view.designList
    const { attrs, onUpdate, onSort } = await DesignUtil.createDesignImage({ detail, viewWidth, viewHeight, dpi, helper });
    attrs['type'] = designs.image; //类型
    attrs['url'] = AppUtil.getImageUrl(detail); //节点使用的图片地址
    attrs['previewUrl'] = detail.previewImg; //预览图地址
    attrs['name'] = detail.name; //图片名称
    attrs['detail'] = detail; //图片详情
    attrs['viewId'] = activeViewId.value;
    attrs['templateId'] = activeTemplateId.value;
    designList.push(attrs);

    // 设计更新时,同步设计属性
    onUpdate(useDebounceFn(({ key, value }) => attrs && set(attrs, key, value), DEBOUNCE_TIME));
    // 设计排序时,同步下标
    onSort(() => {
      const idxMap = new Map();
      getDesignChildren().forEach((node, i) => idxMap.set(node.attrs.uuid, i));
      // designList 根据zIndex排序
      designList.sort((a, b) => idxMap.get(a.uuid) - idxMap.get(b.uuid));
    });
  }

  /**
   * 创建设计
   * @param detail
   * @param type
   */
  function setDesign(detail, type) {
    if (type === designs.image) {
      setDesignImage(detail);
    }
  }

  // 获取价格
  // 获取通用配置
  // 获取精细配置
  // 选中模板

  return {
    setTemplate,
    setDesignImage,
    setDesign,
    setViewId,
    setColorId,
    setSizeId,
    design: desginMethod(data),
  };
}
