export let obj = {
  templateId: '', //模板主键
  enName: '', //英文名称
  weight: '', //产品重量
  craft: '', //生产工艺
  material: '', //材质
  specificIngredient: '', //具体成分
  accessories: '', //配件
  sellingPrice: '', //建议零售价
  otherDescribe: '', //其他描述
  keyWord: '', //关键词
  productSpecification: '', //产品规格
  fbaList: [
    {
      templateId: '', //模板ID
      boxSize: '', //最优箱规
      casePack: '', //预计可装箱数
      estimatedWeight: '', //预计重量  (kg/箱)
      weightType: '', //1-实重  2-泡重
      longestSide: '', //最长边
      secondarySide: '', //次长边
      shortestSide: '', //最短边
      roughWeight: '', //毛重
      volumeWeight: '', //体积重
      shippingFee: '', //实收配送费
      size: '', //尺码
    },
  ],
};

/*
 * FBA装箱类型
 * */
export class FbaItemType {
  seqId = '';
  templateId = ''; //模板ID
  boxSize = ''; //最优箱规
  casePack = ''; //预计可装箱数
  estimatedWeight = ''; //预计重量  (kg/箱)
  weightType = ''; //重量类型 1-实重  2-泡重
  longestSide = ''; //最长边
  secondarySide = ''; //次长边
  shortestSide = ''; //最短边
  roughWeight = ''; //毛重
  volumeWeight = ''; //体积重
  shippingFee = ''; //实收配送费
  size = ''; //尺码
}

// 模板描述类型
export class TemplateDescType {
  keyWordFile = ''; //关键词文件
  templateName = '';
  //模板主键
  templateId = '';
  //英文名称
  enName = '';
  //产品重量
  weight = '';
  //生产工艺
  craft = '';
  //材质
  material = '';
  //具体成分
  specificIngredient = '';
  //配件
  accessories = '';
  //建议零售价
  sellingPrice = '';
  //其他描述
  otherDescribe = '';
  //关键词
  keyWord = '';
  //产品规格
  productSpecification = '';
  //FBA装箱
  fbaList = [new FbaItemType()];
}
