<template>
  <div class="preview-container" style="width: fit-content" :style="leftStyle">
    <!--切换模板设计模式-->
    <el-dropdown placement="bottom">
      <conrner>
        <div class="btn-wrap">
          <span>{{ activeTemplateTypeName }}</span>
        </div>
      </conrner>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="onClickTemplateType(template_type_common)" :disabled="commonDisabled">
          通用设计
        </el-dropdown-item>
        <el-dropdown-item @click.native="onClickTemplateType(template_type_refine)" :disabled="refineDisabled">
          精细设计
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <div class="preview-box-group" style="width: fit-content">
      <div class="preview-box" v-for="(item, index) in activeTemplate.viewList" :class="{ active: activeViewId === item.id }" @click="setViewId(item.id)" :key="'preview' + item.id">
        <!--产品图-->
        <img :src="getActiveColorViewImage(item.id)?.image" alt="" style="position: absolute;width: 100%;height:100%;user-select: none;pointer-events: none" />
        <!--容器id-->
        <canvas
          :id="getPreviewContainerId(item.id)"
          :width="preview_canvas_size"
          :height="preview_canvas_size"
          style="position: absolute;"
          :style="{ 'clip-path': item.print_d ? `url(${`#eyePath_${item.id}`})` : '' }"
        />
        <!--背景图-->
        <img :src="getActiveColorViewImage(item.id)?.texture" alt="" style="position: absolute;width: 100%;height:100%;user-select: none;pointer-events: none" />
        <div class="preview-box-label">图层{{ index + 1 }}</div>
        <!--裁剪路径-->
        <svg width="0" height="0">
          <defs>
            <clipPath :id="`eyePath_${item.id}`" clipPathUnits="userSpaceOnUse">
              <path :d="item.print_d" :style="{ transform: `translate(${item.offsetX * radio}px, ${item.offsetY * radio}px) scale(${radio})` }" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineProps } from 'vue';
// components
import conrner from '@/views/designerApp/components/conrner.vue';
// utils
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { Message, MessageBox } from 'element-ui';

const emit = defineEmits(['onView']);
const props = defineProps({
  canvasSize: Number,
  left: { type: [String, Number], default: -999999 },
  top: { type: [String, Number], default: -999999 },
});

// 设计器基础数据
const {
  //
  /**@type {import('d').templateListRef}*/
  templateList,
  activeViewId,
  activeTemplate,
  setViewId,
  getActiveColorViewImage,
} = useDesignerApplication();
const { getPreviewContainerId, preview_canvas_size, template_type_common, template_type_refine } = useDesignerAppConfig();
// 样式管理
const { leftStyle, size, sizeNum, scrollGap, gap } = useStyle();
// 模板类型
const activeTemplateType = computed(() => activeTemplate.value?.type || useDesignerAppConfig().template_type_common);
// 模板类型-zh
const activeTemplateTypeName = computed(() => (activeTemplateType.value === useDesignerAppConfig().template_type_common ? '通用设计' : '精细设计'));
// 模板类型-common-disabled
const commonDisabled = computed(() => !templateList.value.some((t) => t.type === useDesignerAppConfig().template_type_common));
// 模板类型-refine-disabled
const refineDisabled = computed(() => !templateList.value.some((t) => t.type === useDesignerAppConfig().template_type_refine));

/**@param{import('d').template_type} type 切换模板类型*/
async function onClickTemplateType(type) {
  if (useDesignerApplication().activeTemplate.value.type === type) {
    return;
  }
  // 清空设计提示
  if (templateList.value.some((t) => t.type !== type && t.hasDesign())) {
    await MessageBox.confirm('切换模板类型后，当前设计将会清空，是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      templateList.value.forEach(
        /**@param {import('d').template} t*/
        (t) => {
          if (t.type !== type) {
            t.viewList.forEach((v) => v.clearDesign());
          }
        },
      );
    });
  }
  // 切换为通用设计
  if (type === useDesignerAppConfig().template_type_common) {
    const template = templateList.value.find((t) => t.type === type);
    useDesignerApplication().useTemplate(template);
  }
  // 切换为精细设计
  else if (type === useDesignerAppConfig().template_type_refine) {
    const template = templateList.value.find((t) => t.type === type);
    useDesignerApplication().useTemplate(template);
  } else {
    Message.error('未知模板类型');
  }
}

// 预览图和原视图的比例
const radio = sizeNum / useDesignerAppConfig().canvas_size_org;

// 样式管理
function useStyle() {
  const sizeNum = useDesignerAppConfig().preview_canvas_size; //px
  const size = `${sizeNum / 10}rem`;
  // 滚动条宽度
  const scrollGap = '1.2rem';
  // 和canvas的间距
  const gap = `calc(var(--fn-gap-min) + ${scrollGap})`;

  const leftStyle = computed(() => {
    const left = `calc(${setPx(props.left)} - ${size} - ${gap})`;
    const top = `calc(${setPx(props.top)})`;
    return {
      left,
      top,
    };
  });

  function setPx(value) {
    return value.toString().indexOf('px') > -1 ? value : value + 'px';
  }

  return {
    leftStyle,
    size,
    sizeNum,
    scrollGap,
    gap,
  };
}
</script>

<style scoped lang="less">
@canvasSize: v-bind('props.canvasSize');

//预览图列表
.preview-container {
  pointer-events: all;
  @size: v-bind(size); //宽度
  @scrollGap: v-bind(scrollGap); //滚动条宽度
  @gap: v-bind(gap); //和canvas的间距
  @designBtnHeight: 3.4rem; //通用/精细按钮的高度
  @designBtnGap: var(--fn-gap);
  position: absolute;
  //left: calc((@size + @gap) * -1);
  width: calc(@size + @scrollGap);

  // 精细/通用设计
  .btn-wrap {
    width: @size;
    height: @designBtnHeight;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    font-size: 1.4rem;
    color: #000c01;
    line-height: 1.9rem;
    cursor: default;

    &:hover {
      color: var(--fn-primary-color);
      opacity: 0.9;
      background-color: #fff9f5;
    }
  }

  // 预览box
  .preview-box-group {
    margin-top: @designBtnGap;
    user-select: none;
    //max-height: calc(@canvasSize - @designBtnHeight - @designBtnGap);
    //overflow: auto;
    display: flex;
    flex-direction: column;

    .preview-box {
      width: @size;
      height: @size;
      margin-bottom: var(--fn-gap-min);
      border: 1px solid #e9e9e9;
      cursor: pointer;
      position: relative;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        border-color: var(--fn-primary-color);
      }

      .preview-box-label {
        position: absolute;
        z-index: 3;
        bottom: 0;
        width: 100%;
        height: 2.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        background: #000000;
        opacity: 0.2;
        font-size: 1.2rem;
        line-height: 1.6rem;
      }
    }

    .active {
      border-color: var(--fn-primary-color);
    }
  }
}
</style>
