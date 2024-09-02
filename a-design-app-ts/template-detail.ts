// 模板printoutArea
export interface printoutArea {
  id: '1';
  appearanceColorIndex: 0;
  defaultView: {
    id: '1';
  };
  size: {
    height: 500;
    width: 500;
    x: 85.25;
    y: 36;
    unit: 'mm';
  };
  soft: {
    unit: 'mm';
    d: 'M0,0h342.625v422.25H0V0z';
    v: '';
  };
}
// 模板printArea
export interface printArea {
  // id
  id: '1';
  // 没用
  appearanceColorIndex: 0;
  // 默认视图
  defaultView: {
    id: '1';
  };
  // 没用
  restrictions: {
    textAllowed: true;
    designAllowed: true;
    excludedPrintTypes: [];
  };
  boundary: {
    size: {
      width: 342.62;
      height: 422.25;
      unit: 'mm';
    };
    hard: {
      content: {
        svg: {
          rect: {
            width: 342.62;
            height: 422.25;
            x: '0';
            y: '0';
          };
        };
        unit: 'mm';
      };
    };
    soft: {
      content: {
        unit: 'mm';
        svg: {
          path: {
            d: 'M13.375,7C91.825,7,170.299,7,248.75,7c20.123,0,40.252,0,60.375,0c5.583,0,11.167,0,16.75,0\n\t\t\tc2.791,0,6.256-0.271,8.125,0.625c-0.042,100.657-0.083,201.343-0.125,302c0,25.664,0,51.336,0,77\n\t\t\tc-0.042,8.916-0.083,17.834-0.125,26.75c-1.588,1.885-12.947,0.203-16.5,0.75c-18.29,0.042-36.585,0.083-54.875,0.125\n\t\t\tc-60.702,0-121.423,0-182.125,0c-21.831,0-43.669,0-65.5,0c-2.125-1.542-4.25-3.084-6.375-4.625c0-95.074,0-190.176,0-285.25\n\t\t\tc0-27.122,0-54.253,0-81.375c0-7.708,0-15.417,0-23.125c0-2.762-0.741-7.54,0.25-9.75C10.208,9.083,11.792,8.042,13.375,7z';
          };
        };
      };
    };
  };
}

// 模板尺码
export interface templateSize {
  // 尺码id
  id: 1;
  // 尺码类型
  sizeType: 'MD';
  // 尺码名称
  name: '8x10in';
  // 没用
  measures: [
    {
      name: 'A';
      value: {
        value: '';
        unit: 'mm';
      };
    },
    {
      name: 'B';
      value: {
        value: '';
        unit: 'mm';
      };
    },
    {
      name: 'C';
      value: {
        value: '';
        unit: 'mm';
      };
    },
  ];
}

// 模板颜色
export interface templateColor {
  // 颜色id
  id: string;
  // 颜色英文名称
  name: string;
  // 视图图片
  views: {
    // id
    id: string;
    // 名称
    name: string;
    // 纹理图(没用到)
    thumbImg: string;
    // 背景图
    image: string;
    // 产品图
    texture: string;
  }[];
  // 颜色值(长度固定位1)
  colors: [
    {
      index: number;
      // 颜色值 #FFFFFF
      value: string;
    },
  ];
  // 简单多角度
  multiAngleImages: [];
  // 复杂多角度
  multiAngleImages4Compose: {
    // 背景图
    image: string;
    // 多角度id
    multiId: '1';
    // 产品图
    texture: 'http://php.testcustomwe.com/desg_fn//10106/public_texture_white_positive_500.png?v=20240826104645';
    // 排序号
    sortno: 1;
    // 视图id
    viewId: '1';
    // 是否主图 0否 1是
    isMain: '1';
    groupId: '';
    template_number_with_size_code: '';
    sortId: '';
    isMirror: '';
    color: '';
    frontImage: '';
    svg: '';
    svgCode: '';
    backgroundImage: '';
    parts: [
      {
        isMirror: '';
        svgCode: '1';
        xyMirrorList: [];
        xyList: [
          {
            x: 21.001;
            y: -13.799;
          },
          {
            x: 361.048;
            y: 17.078;
          },
          {
            x: 356.447;
            y: 329.549;
          },
          {
            x: 25.602;
            y: 328.639;
          },
        ];
      },
    ];
    composeId: '11';
    mask: 'http://php.testcustomwe.com/desg_fn//10106/mask_white_positive_500.png?v=20240826104645';
  }[];
}

// 模板视图详情
export interface templateDetailView {
  // id
  id: string;
  // 名称
  name: string;
  // 视图类型(不知道)
  viewType: number;
  // 视图大小 (固定值)
  size: {
    width: '500';
    height: '500';
    unit: 'mm';
  };
  // 跟名称一样
  perspective: string;
  // 视图配置(长度固定位1)
  viewMaps: [
    {
      // print的id
      printArea: {
        id: string;
      };
      // 视图偏移(画布距离500x500的左上角)
      offset: {
        x: number;
        y: number;
        unit: 'mm';
      };
    },
  ];
}

// 模板详情
export interface templateDetail {
  // 默认值
  defaultValues: {
    // 默认视图
    defaultView: {
      id: number;
    };
    // 默认颜色
    defaultAppearance: {
      id: number;
    };
  };
  // 视图列表
  views: templateDetailView[];
  // 颜色列表
  appearances: templateColor[];
  // 尺码列表
  sizes: templateSize[];
  // print列表
  printAreas: printArea[];
  // printout列表
  pointoutPrintAreas: printoutArea[];
  // 3d多角度列表
  '3dAngleList': [];
  // 模板图片
  templateImages: [];
  // 推荐配置
  configDesign: {
    // 模板号
    templateNo: string;
    // 工厂生产文档
    factoryProductionDocuments: string;
    // 推荐dpi
    recommendDpi: number;
    // 推荐宽度
    recommendWidth: number;
    // 推荐高度
    recommendHeight: number;
    // dpi
    dpi: number;
    // 不知道
    cutFlag: number;
    // 主键
    seqId: string;
    // 不知道
    addWhiteBorder: number;
    // 模板id(空值)
    templateId: string;
    // 版本号(空值)
    version: string;
    // 不知道
    borderSet: number;
    // 不知道
    resetPrintStatus: number;
    // 推荐时间(是个对象)
    createTime: object;
  };

  // 主键
  seqId: string;
  // id
  id: string;
  // 模板名称
  name: string;
  // 模板名称-2
  cnName: string;
  // 短描述(没用）
  shortDescription: string;
  // 模板名称-3
  templateNameShow: string;
  // 模板号
  templateNo: string;
  // 模板名称-4
  templateName: string;
  // 模板型号
  templateModel: string;
  // 模板类型 0-自产 1-外采
  templateType: string;
  // 长描述(没用）
  description: string;
  // 品牌(没用）
  brand: string;

  // 模板dpi
  dpi: number;
  //是否全幅 0-否 1-是
  imgFull: string;
  // 是否空复制 0-否 1-是
  emptyCopy: string;
  // 是否烫印 ?0-否 1-是
  isHotStamping: number;
  // 是否收藏
  collectFlag: boolean;
  // 收藏id
  collectId: string;

  //设计宽度(没用）
  designWidth: string;
  //设计高度(没用）
  designHeight: string;
  //不知道(没用）
  amType: string;
  // 不着调(没用)
  hasDetail: boolean;
  // 不知道
  secondCalculateNum: number;
  // 不知道
  thirdCalculateNum: number;
  // 不知道
  isCanSynthesis: boolean;
}
