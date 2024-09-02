import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { Message } from 'element-ui';
import { pick, omit } from 'lodash';
import lodash from 'lodash';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

/**
 * 获取提交数据
 * @typedef {import('d').template.getSubmitData}
 * @param {import('d').template} template
 * @param {import('d').save_template_type} saveType
 */
export function getSubmitData(template, saveType) {
  // console.log('getSubmitData', template);
  // 保存类型
  // const saveType = useDesignerAppConfig().save_template_type_color;
  // 是否异步
  let asyncFlag = true;
  // 是否自产
  let isSelf = true;
  // 是否拷贝
  let isNeedCopy = false;
  // 是否有管理图库的图参与设计
  let adminImage = '';

  // 校验-批量设计-禁用全颜色合成
  const static_batchid = localStorage.getItem('static_batchid') || '';
  if (static_batchid) {
    if (saveType === useDesignerAppConfig().save_template_type_color) {
      Message.warning('批量设计时，禁用全颜色合成！');
      return Promise.reject('批量设计时，禁用全颜色合成！');
    }
    asyncFlag = false;
  }
  // 校验-自产|外采
  if (template.detail.templateType === useDesignerAppConfig().template_source_type_out) isSelf = false;
  if (saveType === useDesignerAppConfig().save_template_type_org) isSelf = false;
  // 校验-设计图数量检查(至少一个视图进行设计)
  if (isSelf) {
    // 设计图数量(visible=true)
    const designLength = template.viewList.reduce((pre, v) => (pre += v.designList.filter((d) => d.attrs.visible).length), 0);
    if (designLength === 0) {
      Message.warning('请至少选择一个视图进行设计，再进行保存操作！');
      return Promise.reject('请至少选择一个视图进行设计，再进行保存操作！');
    }
    // 多面设计判断 (当前产品是对面设计,并且只设计了一个视图) isNeedCopy=空拷贝
    isNeedCopy = template.detail.emptyCopy === '1' && designLength === 1;
  }
  // 校验-设计图碰撞检测
  // 校验-是否有管理图库的图参与设计
  adminImage = template.viewList.some((v) => v.designList.filter((d) => d.attrs.visible && d.detail?.isAdminOrg).length) ? 1 : '';
  // 组装设计图
  const configurations = [];
  for (let view of template.viewList.toReversed()) {
    /**@type {import('d').design[]}*/
    let designList = view.designList.filter((d) => d.attrs.visible);
    const bgList = [];
    const list = [];
    designList.forEach((d) => {
      if (d.isBackgroundColor) bgList.unshift(getSubmitDataBackgroundColor(d));
      else if (d.isBackgroundImage) bgList.unshift(getSubmitDataImage(d));
      else if (d.isImage) list.push(getSubmitDataImage(d));
    });
    configurations.unshift(...bgList, ...list.toReversed());
  }
  if (configurations.length === 0) {
    Message.warning('请至少选择一个视图进行设计，再进行保存操作！');
    return Promise.reject('请至少选择一个视图进行设计，再进行保存操作！');
  }
  // 是否否空拷贝
  if (isNeedCopy && isSelf) {
    // 有设计的view
    const tempView = template.viewList.find((view) => view.designList.some((d) => d.attrs.visible));
    const tempCgs = configurations.find((e) => e.printArea.id === tempView.id);
    for (let view of template.viewList.toReversed()) {
      // 跳过有设计的view
      if (view.id === tempView.id) continue;
      // 复制一份
      const configurationItem = lodash.cloneDeep(tempCgs);
      configurationItem.isCopy = '1';
      configurationItem.printArea.id = view.id; //当前设计所在的视图id
      configurations.unshift(configurationItem);
    }
  }
  // 组装提交信息
  const data = {
    asyncFlag: asyncFlag,
    appearance: { id: useDesignerApplication().activeColorId.value },
    defaultValues: { defaultView: { id: useDesignerApplication().activeViewId.value } },
    templateType: template.detail.templateType,
    productType: { id: template.detail.id },
    isUseMirror: '',
    isNeedCopy: isNeedCopy,
    static_batchid: static_batchid,
    saveNumBtn: saveType,
    adminImage: adminImage,
    configurations: configurations,
    // 固定值
    creator: 'Tablomat8',
    fullSvg: {},
    restrictions: {
      freeColorSelection: false,
      example: false,
    },
  };
  console.log('data', data);

  return data;
}

/**
 * 获取提交数据-背景色
 * @param {import('d').design} design
 */
function getSubmitDataBackgroundColor(design) {
  const data = {
    type: useDesignerAppConfig().submit_design_type_background_color,
    printArea: { id: design.attrs.viewId },
    offset: { x: 1, y: 1, unit: 'mm' },
    content: {
      dpi: design.$template.detail.dpi,
      unit: 'mm',
      svg: design.attrs.fill,
    },
    printType: { id: 17 },
    isCopy: '',
    isText: false,
    textId: '',
    restrictions: { changeable: true },
  };
  data.fnData = { ...design.attrs, node: '' };
  return data;
}

/**
 * 获取提交数据-设计图
 * @param {import('d').design} design
 */
function getSubmitDataImage(design) {
  const width = lodash.round(design.attrs.width * Math.abs(design.attrs.scaleX), 2);
  const height = lodash.round(design.attrs.height * Math.abs(design.attrs.scaleY), 2);
  const designId = design.detail.seqId || design.detail.id; //收藏id || 列表id
  const x = lodash.round(design.attrs.x - width / 2, 2);
  const y = lodash.round(design.attrs.y - height / 2, 2);
  const rotation = design.attrs.rotation || 0;

  const data = {
    type: useDesignerAppConfig().submit_design_type_design,
    printArea: { id: design.attrs.viewId },
    offset: { x: x, y: y, unit: 'mm' },
    content: {
      dpi: design.$template.detail.dpi,
      unit: 'mm',
      svg: {
        image: {
          designId: designId,
          width: width,
          height: height,
          isBg: Number(design.detail.isBg),
          transform: `rotate(${rotation},${width / 2},${height / 2})`,
          hspacing: 0,
          vspacing: 0,
          printColorRGBs: '',
          tileType: '',
        },
      },
    },
    printType: { id: 17 },
    isCopy: '',
    isText: false,
    textId: '',
    restrictions: { changeable: true },
  };
  data.fnData = { ...design.attrs, node: '' };
  return data;
}
