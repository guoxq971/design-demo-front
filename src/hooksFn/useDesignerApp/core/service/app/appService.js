import { useData } from './data/data';
import { useMethod } from './method/method';

export function useAppService() {
  const data = useData();
  const method = useMethod(data);

  return {
    ...data,
    ...method,
  };
}

/**
 // 方法
      选择模板
      选择设计图,文字,背景图,背景色
      设计图操作

 // 数据
 const templateList = [
   // template  //精细|精细
  {
   type:'通用',//精细
   detail:{},
  //视图列表
   vieList:[
    {
      id:'1',
     name:'正面',
      canvasNodeList:shallowRef([]),
      offset:{x:0,y:0,z:0},
      designList:[
        {type:'文字|图片|背景图|背景色'},
        {type:'文字|图片|背景图|背景色'},
        {type:'文字|图片|背景图|背景色'},
    ]
    },
     {
     name:'背面',
     designList:[
     {}
     ]
     },
 ],
  //尺码列表
   sizeList:[],
  //颜色列表
   colorList:[
    {
      colorCode:'black',
      multiList:[],//多角度列表
      viewList:[{id,prodImg,bgImg}]
    },
   {
   colorCode:'black',
   multiList:[],//多角度列表
   viewList:[]
   }
 ],
  //导出模型列表
   exportModelList:[],
 },
  {},
  {},
 ];
 * */
