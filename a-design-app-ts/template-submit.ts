import { design_type, save_template_type } from './designerAppConfig';
import { attrs } from './design';
import { view } from './template-base';

// 模板提交参数
export interface templateSubmit {
  fnData: {viewList:view[]},
  asyncFlag: false,
  appearance: { id: '1' },
  defaultValues: { defaultView: '1' },
  templateType: '1',
  productType: {
    id: '2345',
    size:'', //有值就是精细设计
    sizeType:''
  },
  isUseMirror: '',
  isNeedCopy: false,
  static_batchid: '1',
  saveNumBtn: save_template_type,
  adminImage: '',
  // 设计图
  configurations: configuration[],
  // 固定值
  creator: 'Tablomat8',
  fullSvg: {},
  restrictions: {
    freeColorSelection: false,
    example: false,
  },
}
// 设计图
export interface configuration {
  fnData:Omit<attrs, 'node'>,
  type: design_type,
  printArea: { id: '1' },
  offset: { x: 1, y: 1, unit: 'mm' },
  content: {
    dpi: 120,
    unit: 'mm',
    svg: {
      image: {
        designId: string,
        width: number,
        height: number,
        isBg: 0,
        transform: `rotate(${number},${number},${number})`,
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
}
