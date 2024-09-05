import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { Message } from 'element-ui';
import { pick, omit } from 'lodash';
import lodash from 'lodash';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { changeDpiDataUrl } from '@/hooksFn/useGlobalDesigner/core/application/plugin/changeBase64Dpi';
import { GRequest, METHOD } from '@/utils/request';

/**
 * 获取提交数据
 * @typedef {import('d').template.getSubmitData}
 * @param {import('d').template} template
 * @param {import('d').save_template_type} saveType
 */
export async function getSubmitData(template, saveType) {
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
    for (let design of designList) {
      // 背景色
      if (design.isBackgroundColor) bgList.push(getSubmitDataBackgroundColor(design));
      // 背景图
      else if (design.isBackgroundImage) bgList.push(getSubmitDataImage(design));
      // 设计图
      else if (design.isImage) list.push(getSubmitDataImage(design));
      // 文字
      else if (design.isText) {
        const data = await getSubmitDataText(design);
        list.push(data);
      }
    }
    configurations.unshift(...bgList.toReversed(), ...list.toReversed());
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
    fnData: getTemplateFnData(template),
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
    // 设计图
    configurations: configurations,
    // 固定值
    creator: 'Tablomat8',
    fullSvg: {},
    restrictions: {
      freeColorSelection: false,
      example: false,
    },
  };
  // console.log('组装提交信息 data', data);

  return data;
}

/**
 * 获取模板的提交数据 fnData
 * @param {import('d').template} template
 * @returns {import('d').templateSubmit.fnData}
 */
export function getTemplateFnData(template) {
  // 只取以下属性做保存, 因为这些属性在 template.unsleep 时使用
  return {
    viewList: template.viewList.map((v) => {
      return {
        ...pick(v, ['id']),
        designList: v.designList.map((d) => {
          return {
            ...pick(d, ['type', 'attrs', 'detail', 'isImage', 'isBackgroundImage', 'isBackgroundColor', 'isText']),
          };
        }),
      };
    }),
  };
}

/**
 * 使用模板的提交数据 fnData
 * @param {import('d').templateSubmit.fnData} fnData 提交数据
 * @param {import('d').template} template 模板
 */
export function useTemplateFnData(fnData, template) {
  if (!fnData) {
    console.error('使用模板的提交数据失败, fnData为空');
    return;
  }
  if (fnData) {
    template.viewList.forEach((view) => {
      const fdView = fnData.viewList.find((v) => v.id == view.id);
      if (fdView) {
        view.designList.push(...fdView.designList);
      }
    });
    template.unsleep();
  }
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
 * @returns {import('d').templateSubmit}
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

/**
 * 获取提交数据-文字
 * @param {import('d').design} design
 */
async function getSubmitDataText(design) {
  // 文字设计上传到服务器, 得到designId
  const { designId } = await textToImageUpload(design);
  // const designId = '';
  const rotation = '0';
  const width = design.$view.width;
  const height = design.$view.height;
  const data = {
    type: useDesignerAppConfig().submit_design_type_design,
    printArea: { id: design.attrs.viewId },
    offset: { x: 1, y: 1, unit: 'mm' },
    content: {
      dpi: design.$template.detail.dpi,
      unit: 'mm',
      svg: {
        image: {
          designId: designId,
          width: width,
          height: height,
          isBg: 0,
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

/**
 * 文字转图片上传
 * @param {import('d').design} design
 * @returns {Promise<{designId: string, width: number, height: number}>}
 */
async function textToImageUpload(design) {
  if (!design.isText) {
    console.error('文字转图片上传失败, 请传入文字设计');
    return;
  }

  const viewId = design.$view.id;
  const imgWidth = design.$view.width;
  const imgHeight = design.$view.height;
  const textParam = {
    x: design.attrs.x,
    y: design.attrs.y,
    rotation: design.attrs.rotation || 0,
    scaleX: design.attrs.scaleX || 1,
    scaleY: design.attrs.scaleY || 1,
    text: design.attrs.text,
    fontColor: design.attrs.fill,
    fontSize: design.attrs.fontSize,
    fontFamily: design.attrs.fontFamily,
    fontWeight: design.attrs.fontWeight,
    fontItalic: design.attrs.fontItalic,
    textDecoration: design.attrs.textDecoration,
  };

  // 文字转图片base64
  const options = {
    pixelRatio: useDesignerAppConfig().text_to_image_pixel_ratio,
    width: imgWidth,
    height: imgHeight,
    callback: async () => {
      // 创建文字
      const t = new Konva.Text({
        text: textParam.text,
        fontSize: textParam.fontSize,
        fontStyle: textParam.fontWeight + ' ' + textParam.fontItalic, // 样式
        textDecoration: textParam.textDecoration, // 下划线
        fontFamily: textParam.fontFamily,
        fill: textParam.fontColor,
      });
      const offsetX = t.width() / 2;
      const offsetY = t.height() / 2;
      t.setAttrs({
        offsetX,
        offsetY,
        x: offsetX,
        y: offsetY,
        scaleX: textParam.scaleX,
        scaleY: textParam.scaleY,
      });
      t.setAttrs({
        x: textParam.x,
        y: textParam.y,
        rotation: textParam.rotation,
      });

      return t;
    },
  };
  let base64 = await designToBase64(options);

  // 修改图片DPI
  base64 = changeImageDpi(base64);
  // 上传的图片名称
  const name = `custom_${AppUtil.uuid()}_${viewId}.png`;
  // base64转file
  const file = base64ToFile(base64, name);
  // 上传到服务器
  const { checkRes } = await uploadImage(file, name);

  return {
    designId: checkRes.data.seqId,
    width: imgWidth,
    height: imgHeight,
  };
}

/**
 * 根据参数转换为图片base64
 * @param options
 * @returns {Promise<string>}
 */
async function designToBase64(options) {
  const _param = Object.assign(
    {
      test: false, // ？测试
      width: 0, // 宽
      height: 0, // 高
      callback: null, // 回调函数 (必须返回一个Konva.Image | Konva.text)
      pixelRatio: 1,
    },
    options,
  );

  if (!_param.width || !_param.height) {
    console.error('根据参数转换为图片base64失败, 没有宽高');
    return Promise.reject();
  }

  if (!_param.callback) {
    console.error('根据参数转换为图片base64失败, 没有回调函数');
    return Promise.reject();
  }

  // 创建一个div
  const div = document.createElement('div');
  div.style.width = _param.width + 'px';
  div.style.height = _param.height + 'px';
  div.style.position = 'absolute';
  if (_param.test) {
    div.style.top = '0';
    div.style.left = '0';
    div.style.zIndex = '9999';
  } else {
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    div.style.zIndex = '-9999';
  }
  // 背景色为透明
  div.style.backgroundColor = 'transparent';
  document.body.appendChild(div);

  // 创建konva的canvas
  const stage = new Konva.Stage({
    container: div,
    width: _param.width,
    height: _param.height,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // 创建设计
  const design = await _param.callback();
  layer.add(design);

  // 获取图片
  const url = await new Promise((resolve) => {
    stage.toImage({
      pixelRatio: _param.pixelRatio || 1,
      callback(img) {
        resolve(img.src);
      },
    });
  });

  // 销毁
  if (_param.test) {
    // 注册dom点击删除
    div.onclick = () => {
      stage?.destroy();
      div?.remove();
    };
    setTimeout(() => {
      stage?.destroy();
      div?.remove();
    }, 1000 * 1000);
  } else {
    stage.destroy();
    div.remove();
  }

  return url;
}

/**
 * 修改图片DPI
 * @param {string} base64
 */
function changeImageDpi(base64) {
  return changeDpiDataUrl(base64, 180);
}

/**
 * base64转file
 * @param base64
 * @param name
 * @returns {*}
 */
function base64ToFile(base64, name) {
  // base64转blob
  const blob = base64ToBlob(base64);
  // blob转file
  const file = blobToFile(blob, name);
  // 组装file信息
  file.uid = getUid();
  file.label = file.name.split('.')[0];
  file.raw = new window.File([file], file.name, { type: file.type });
  file.isCopyRightGrade = '0'; //侵权
  file.isFuGrade = '2'; //全幅
  file.newBasetype = '0'; //图片一级分类

  return file;

  /**
   * 随机uid, 12位
   * @returns {string}
   */
  function getUid() {
    return Math.random()
      .toString()
      .substr(2, 12);
  }

  /**
   * blob转file
   * @param blob
   * @param fileName
   */
  function blobToFile(blob, fileName) {
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
  }

  /**
   * base64转blob
   * @param base64
   * @returns {module:buffer.Blob}
   */
  function base64ToBlob(base64) {
    let arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }
}

/**
 * 上传图片到服务器
 * @param file
 * @param orgName
 * @returns {Promise<{checkRes: {imageCode:1000533,seqId:"1830893510876770304"}, file: File}>}
 */
async function uploadImage(file, orgName) {
  // 上传
  const uploadRes = await uploadImage(file);
  // 确认上传
  const checkRes = await designImageUploadConfirm(uploadRes, file, orgName);

  return { checkRes, file };

  /**
   * 上传图片到服务器
   * @param file
   * @returns {Promise<T>}
   */
  async function uploadImage(file) {
    const form = new FormData();
    const param = {
      id: file.uid,
      name: file.label, //file.label-去掉后缀的名称 file.name-没有去掉后缀
      type: file.raw.type,
      lastModifiedDate: file.raw.lastModifiedDate,
      size: file.size,
      file: file.raw,
      cut1500Flag: '',
    };
    for (let key in param) {
      form.append(key, param[key]);
    }

    const res = await GRequest(`/base-web/CMDesignImageAct/ajaxBatchUploadDesign.act`, METHOD.POST, form, {
      timeout: 50 * 60 * 1000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const msg = res.data.retMsg || '上传设计图 失败';
    if (res.data.retState !== '0') {
      Message.warning(msg);
      return Promise.reject(msg);
    }

    const uploadRes = res.data;
    return uploadRes;
  }

  /**
   * 设计图上传确认
   * @param {object} imageRes 上传图片的返回结果
   * @param {File} file
   * @param {string} orgName 设计图原图名称
   * @returns {Promise<any>}
   */
  async function designImageUploadConfirm(imageRes, file, orgName) {
    // console.log('imageRes', imageRes);
    /**
     * @type {import('@/design').UploadImageCheckParams}
     */
    const obj = {
      fileName: imageRes.fileName,
      fileSize: imageRes.fileSize,
      sjsTitle: file.sjsTitle || '',
      label: file.label,
      tags: file.tags || '',
      main_type: [4],
      // 侵权
      isCopyRightGrade: file.isCopyRightGrade || '',
      // 全幅
      isFuGrade: file.isFuGrade || '',
      // 图片一级分类
      newBasetype: file.newBasetype || '',
      // 图片二级分类
      newNexttype: file.newNexttype || '',
      // 小组一级分类
      teamBasetype: file.teamBasetype || '',
      // 小组二级分类
      teamNexttype: file.teamNexttype || '',
      width: imageRes.width,
      height: imageRes.height,
      imageName: orgName,
      imageDir: imageRes.imageDir,
      orgImage: imageRes.orgImage,
      dpi: imageRes.dpi,
      thumbImage: imageRes.thumbImage,
      designImage: imageRes.designImage,
      imageType: imageRes.imageType,
    };
    const res = await GRequest(`/base-web/CMDesignImageAct/ajaxSaveBatchDesign.act?usertype=1`, METHOD.POST, obj, {
      timeout: 60000,
    });
    if (res.data.code !== 0) {
      const msg = res.data.code !== 0 ? '上传设计图-确认 失败' : res.data.msg;
      Message.warning(msg);
      return Promise.reject(msg);
    }

    return res.data;
  }
}
