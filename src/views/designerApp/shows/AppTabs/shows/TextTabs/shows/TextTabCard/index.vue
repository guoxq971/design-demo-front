<template>
  <div class="tab">
    <!--文字-->
    <el-input class="font-family-input" type="textarea" v-model="param.text" placeholder="请输入文字..." :rows="4" :style="{ '--font-family': param.fontFamily }" />
    <div class="line">
      <!--字体-->
      <div class="font-select">
        <el-select class="font-family-input" v-model="param.fontFamily" placeholder="请选择字体" :loading="fontLoading" :style="{ '--font-family': param.fontFamily }">
          <el-option v-for="item in fontFamilyList" :key="item.uuid" :label="item.label" :value="item.value">
            <span v-if="item.state === font_load_state_loading" class="el-icon-loading" style="margin-right: 5px;"></span>
            <span :style="{ fontFamily: item.value }" style="font-size: 18px">{{ item.label }}</span>
            <span style="color: #9a9a9a; float: right">{{ item.sourceTypeName }}</span>
          </el-option>
        </el-select>
      </div>
      <!--字体管理-->
      <div class="btn active">字体管理</div>
    </div>
    <div class="line">
      <!--字号-->
      <el-select v-model="param.fontSize" placeholder="字号">
        <el-option v-for="item in fontSizeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!--加粗-->
      <div class="btn fun-btn" :class="{ active: param.fontWeight !== useDesignerAppConfig().font_weight_type_none }" @click="onFontWeight()">
        <fontWeightSvg />
      </div>
      <!--斜体-->
      <div class="btn fun-btn" :class="{ active: param.fontItalic !== useDesignerAppConfig().font_italic_type_none }" @click="onFontFontItalic()">
        <fontItalicSvg />
      </div>
      <!--下划线-->
      <div class="btn fun-btn" :class="{ active: param.textDecoration !== useDesignerAppConfig().font_decoration_type_none }" @click="onFontDecoration()">
        <fontUnderlineSvg />
      </div>
    </div>
    <!--    <div class="line">-->
    <!--      &lt;!&ndash;字号&ndash;&gt;-->
    <!--      <el-select v-model="param.fontSize" placeholder="字号"></el-select>-->
    <!--      &lt;!&ndash;字间距&ndash;&gt;-->
    <!--      <el-input v-model="param.fontSize" placeholder="字间距"></el-input>-->
    <!--      &lt;!&ndash;行高&ndash;&gt;-->
    <!--      <el-input v-model="param.fontSize" placeholder="行高"></el-input>-->
    <!--    </div>-->
    <!--    <div class="line">-->
    <!--      &lt;!&ndash;加粗&ndash;&gt;-->
    <!--      <div class="btn fun-btn">-->
    <!--        <fontWeightSvg />-->
    <!--      </div>-->
    <!--      &lt;!&ndash;斜体&ndash;&gt;-->
    <!--      <div class="btn fun-btn">-->
    <!--        <fontItalicSvg />-->
    <!--      </div>-->
    <!--      &lt;!&ndash;下划线&ndash;&gt;-->
    <!--      <div class="btn fun-btn">-->
    <!--        <fontUnderlineSvg />-->
    <!--      </div>-->
    <!--      &lt;!&ndash;左对齐&ndash;&gt;-->
    <!--      <div class="btn fun-btn">-->
    <!--        <fontCenterLeftSvg />-->
    <!--      </div>-->
    <!--      &lt;!&ndash;居中&ndash;&gt;-->
    <!--      <div class="btn fun-btn">-->
    <!--        <fontCenterSvg />-->
    <!--      </div>-->
    <!--      &lt;!&ndash;右对齐&ndash;&gt;-->
    <!--      <div class="btn fun-btn">-->
    <!--        <fontCenterRightSvg />-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="line-gap add-btn-line">
      <el-button type="primary" @click="onSure">新增文字</el-button>
    </div>
    <div class="line-gap-deb">
      <!--色板-->
      <ColorPicker v-model="param.fill" />
    </div>
    <div>
      <div class="line-gap color-chunk-line">
        <!--当前颜色色块-->
        <div class="color-chunk" :style="{ background: param.fill }"></div>
        <el-input v-model="param.fill" class="color-chunk-input"></el-input>
        <!--拾色器-->
        <div class="color-picker">
          <colorPickerSvg />
        </div>
      </div>
    </div>
    <!--色板预设-->
    <div class="line-gap">
      <div class="line-gap">色板预设</div>
      <div class="default-color-group line-gap">
        <div @click="onClickColor(item)" v-for="item in defaultColorList" :key="item" :style="{ backgroundColor: item }" class="default-color-item"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useDebounceFn, watchDebounced } from '@vueuse/core';
// components
import colorPickerSvg from '@/views/designerApp/components/svg/colorPickerSvg.vue';
import fontWeightSvg from '@/views/designerApp/components/svg/fontWeightSvg.vue';
import fontItalicSvg from '@/views/designerApp/components/svg/fontItalicSvg.vue';
import fontUnderlineSvg from '@/views/designerApp/components/svg/fontUnderlineSvg.vue';
import fontCenterLeftSvg from '@/views/designerApp/components/svg/fontCenterLeftSvg.vue';
import fontCenterSvg from '@/views/designerApp/components/svg/fontCenterSvg.vue';
import fontCenterRightSvg from '@/views/designerApp/components/svg/fontCenterRightSvg.vue';
// utils
import ColorPicker from './shows/ColorPicker';
import { Message } from 'element-ui';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { getTextOptions } from '@/hooksFn/useGlobalDesigner/core/application/design/addText';
import { cloneDeep } from 'lodash';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { GRequest, METHOD } from '@/utils/request';
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';

// 字体
function useFontFamily() {
  const font_prefix_name = 'fn';
  const font_load_state_not_loaded = 0; //未加载
  const font_load_state_loading = 1; //加载中
  const font_load_state_success = 2; //加载成功
  const font_load_state_fail = 3; //加载失败

  const loading = ref(false);
  const list = ref([]);
  onMounted(() => {
    list.value = [
      {
        label: '默认字体',
        value: 'sans-serif',
        url: '',
        state: font_load_state_success,
        uuid: AppUtil.uuid(),
      },
    ];
    getList(1);
    getList(2);
    getList(3);
  });

  // 获取字体列表
  async function getList(designerQueryType = 1) {
    loading.value = true;
    try {
      const param = {
        /**
         * 设计器页面查询类型：1平台字体 2我的字体， 3共享给我的字体，
         */
        designerQueryType: designerQueryType,
        pageNum: 1,
        pageSize: -1,
      };
      const res = await GRequest(`/basic-web/cm/cmFont/designerList/${param.pageNum}/${param.pageSize}`, METHOD.POST, param);
      if (res.data.code !== 0) return;
      // 要在这个地方加载字体 fontPath
      const tempList =
        res.data.data?.records.map((e) => {
          return {
            sourceType: designerQueryType,
            sourceTypeName: getSourceType(designerQueryType),
            label: e.fontName,
            value: font_prefix_name + e.fontName,
            detail: e,
            url: process.env.VUE_APP_API_BASE_IMG_URL + e.fontPath,
            uuid: AppUtil.uuid(),
            state: font_load_state_not_loaded,
          };
        }) || [];
      tempList.forEach((font) => loadFont(font));
      list.value.push(...tempList);
    } finally {
      loading.value = false;
    }
  }
  // 获取类型名称
  function getSourceType(type) {
    switch (type) {
      case 1:
        return '平台';
      case 2:
        return '我的';
      case 3:
        return '共享';
      default:
        return '';
    }
  }
  // 加载字体
  function loadFont(font) {
    const fontName = font.value;
    if (checkFont(fontName)) {
      // 字体已加载过，无需再次加载
      // console.log(`字体: ${fontName} 已加载过，无需再次加载.`);
      font.state = font_load_state_success;
      return;
    }
    // 请求中
    font.state = font_load_state_loading;

    // const fontFace = new FontFace(fontName, `url(${font.url}) format('truetype')`);
    const fontFace = new FontFace(fontName, `url(${font.url})`);

    // 加载字体
    fontFace
      .load()
      .then((loadedFont) => {
        // 字体加载成功
        font.state = font_load_state_success;
        document.fonts.add(loadedFont);
        // console.log(`字体: ${fontName} 加载成功.`);
      })
      .catch((error) => {
        // 字体加载失败
        font.state = font_load_state_fail;
        console.error(`字体: ${fontName} 加载失败. 失败原因: ${error}`);
      });

    /**
     * 检测字体文件是否已加载
     * @param name
     * @returns {boolean}
     */
    function checkFont(name) {
      const values = document.fonts.values();
      let isHave = false;
      let item = values.next();
      while (!item.done && !isHave) {
        let fontFace = item.value;
        if (fontFace.family == name) {
          isHave = true;
        }
        item = values.next();
      }
      return isHave;
    }
  }

  return {
    list,
    loading,
    getList,
    font_load_state_not_loaded,
    font_load_state_loading,
    font_load_state_success,
    font_load_state_fail,
  };
}
// 字体列表
const { list: fontFamilyList, loading: fontLoading, font_load_state_loading } = useFontFamily();

// 字号列表
const fontSizeList = [
  { label: '20', value: '20' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
  { label: '24', value: '24' },
  { label: '25', value: '25' },
  { label: '26', value: '26' },
  { label: '27', value: '27' },
  { label: '28', value: '28' },
  { label: '29', value: '29' },
  { label: '30', value: '30' },
];
// 颜色列表
const defaultColorList = useDesignerAppConfig().default_color_list;
function onClickColor(colorCode) {
  param.value.fill = colorCode;
}
// 加粗
function onFontWeight() {
  param.value.fontWeight = param.value.fontWeight === useDesignerAppConfig().font_weight_type_none ? useDesignerAppConfig().font_weight_type_bold : useDesignerAppConfig().font_weight_type_none;
}
// 斜体
function onFontFontItalic() {
  param.value.fontItalic = param.value.fontItalic === useDesignerAppConfig().font_italic_type_none ? useDesignerAppConfig().font_italic_type_italic : useDesignerAppConfig().font_italic_type_none;
}
// 下划线
function onFontDecoration() {
  param.value.textDecoration =
    param.value.textDecoration === useDesignerAppConfig().font_decoration_type_none ? useDesignerAppConfig().font_decoration_type_underline : useDesignerAppConfig().font_decoration_type_none;
}

const param = ref(getTextOptions());

function onSure() {
  if (!param.value.uuid && !param.value.text) {
    Message.warning('内容不能为空');
    return;
  }
  useDesignerApplication().addText(param.value);
}

// 监听文字参数变化
watch(
  () => param.value,
  useDebounceFn((val) => {
    param.value.uuid && useDesignerApplication().addText(cloneDeep(param.value));
  }, 300),
  { deep: true },
);
// 监听当前设计信息
watch(
  () => useDesignerApplication().activeDesignId.value,
  useDebounceFn((val) => {
    // 激活设计是文字时，更新文字参数
    if (useDesignerApplication().activeDesign.value?.isText) {
      param.value = getTextOptions(useDesignerApplication().activeDesign.value.node.attrs);
    } else {
      if (param.value.uuid) param.value.uuid = '';
    }
  }, 100),
);
</script>

<style scoped lang="less">
.tab {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--fn-gap) var(--fn-gap-min) var(--fn-gap-min) var(--fn-gap-min);
}
.line-gap-deb {
  margin-top: var(--fn-gap);
}
.line-gap {
  margin-top: var(--fn-gap-min);
}
.line {
  margin-top: var(--fn-gap-min);
  display: flex;
  justify-content: space-between;
  gap: var(--fn-gap-min);
}
//
.font-select {
  width: 19.5rem;
}
// 按钮
.btn {
  width: 10rem;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    border-color: var(--fn-primary-color);
    color: var(--fn-primary-color);
  }
}
.active {
  border-color: var(--fn-primary-color);
  color: var(--fn-primary-color);
}
.fun-btn {
  width: 3.6rem;
  height: 3.6rem;
  color: #9a9a9a;
}
// 新增文字
.add-btn-line {
  display: flex;
  justify-content: center;
  .el-button {
    width: 80%;
  }
}
// 色块 + 拾色器
.color-chunk-line {
  display: flex;
  align-items: center;
}
// 色块
.color-chunk {
  min-width: 4rem;
  min-height: 4rem;
  border-radius: 4px;
  border: 1px solid #e1e1e1;
}
.color-chunk-input {
  width: 12rem;
  margin-left: var(--fn-gap-min);
}
.color-picker {
  margin-left: var(--fn-gap-min);
  cursor: pointer;
  &:hover {
    color: var(--fn-primary-color);
  }
}
// 预设
.default-color-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fn-gap-min);
}
.default-color-item {
  cursor: pointer;
  width: 2.8rem;
  height: 2.8rem;
  box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
  border-radius: 8px;
  border: 1px solid #e1e1e1;
  padding: 0.3rem;
  background-clip: content-box;
  &:hover {
    border-color: var(--fn-primary-color);
  }
}

// 修改字体
.font-family-input {
  --font-family: 'sans-serif';
  :deep(.el-input__inner),
  :deep(.el-textarea__inner) {
    font-family: var(--font-family);
    font-size: 16px;
  }
}
</style>
