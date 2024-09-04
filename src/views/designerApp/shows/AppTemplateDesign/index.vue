<template>
  <div class="template-design-wrap">
    <div class="body" v-if="activeTemplate">
      <div class="title-wrap">{{ activeTemplate.detail.name }}</div>
      <div class="sub-title-wrap">
        <div class="price">{{ price }}</div>
        <pricePop>
          <div class="el-icon-warning-outline price-icon"></div>
        </pricePop>
        <div class="info" @click="templateVisible = !templateVisible">产品信息</div>
      </div>
      <!--工艺-->
      <div class="sub-title-wrap" v-if="templateCraft">
        <span>【工艺】：</span>
        <span v-if="!craftLoading">{{ templateCraft }}</span>
        <span v-if="craftLoading" class="el-icon-loading" />
      </div>

      <!--颜色-->
      <div class="list-wrap">
        <div class="title">颜色:</div>
        <el-scrollbar class="item-list" :wrapStyle="{ width: '100%' }" :viewStyle="{ display: 'flex' }">
          <div class="box-item color-item" :class="{ active: activeColorId === item.id }" @click="setColorId(item.id)" v-for="item in activeTemplate.colorList" :key="'color' + item.id">
            <div class="color" :style="{ background: item.colorCode }"></div>
          </div>
        </el-scrollbar>
      </div>

      <!--尺码-->
      <div class="list-wrap">
        <div class="title">尺码:</div>
        <el-scrollbar class="item-list" :wrapStyle="{ width: '100%' }" :viewStyle="{ display: 'flex' }">
          <div class="box-item size-item" :class="{ active: activeSizeId === item.id }" @click="setSizeId(item)" v-for="item in activeTemplate.sizeList" :key="'size' + item.id">
            <div class="size">{{ item.size }}</div>
            <div v-if="isTemplateDesign(item.size)" class="design">设计</div>
          </div>
        </el-scrollbar>
      </div>

      <!--多角度-->
      <div class="multi-wrap" v-loading="renderLoading">
        <div class="multi-box">
          <div class="multi-box-bd">
            <div class="multi-content">
              <div class="fun-btn render-btn" @click="onRender">渲染</div>
              <div class="fun-btn preview-btn">预览</div>
              <el-carousel trigger="click" indicator-position="outside" arrow="always" :loop="false" :autoplay="false">
                <template v-if="activeColor?.multiImageList">
                  <el-carousel-item v-for="item in activeColor.multiImageList" :key="item.id">
                    <div class="show-box">
                      <img class="child-box" :src="AppUtil.setStartHttp(item.bgImg)" />
                      <template v-if="isMulti3D(item)">
                        <div v-loading="getMulti3d(item)?.loading" class="child-box" :id="getMultiContainerId(item.id)"></div>
                      </template>
                      <template v-else>
                        <img class="child-box" v-if="item.designImg" :src="item.designImg" alt="" />
                      </template>
                      <img class="child-box" :src="AppUtil.setStartHttp(item.prodImg)" />
                    </div>
                  </el-carousel-item>
                </template>
              </el-carousel>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--设计列表-->
    <div class="design-wrap">
      <div class="header">
        <div class="title">素材列表</div>
        <div class="switch">
          <el-switch v-model="designListVisible" active-color="#63C345" />
        </div>
      </div>
      <el-scrollbar class="list" v-show="designListVisible">
        <div class="item-list" v-for="design in activeView?.designList" :key="`${design.attrs.uuid}_${design.attrs.zIndex}`">
          <div class="design-item">
            <div class="head-design">
              <template v-if="design.isImage || design.isBackgroundImage">
                <img class="img" :src="AppUtil.getImageUrl(design.detail)" alt="" />
                <div class="name">{{ showImagName(design) }}</div>
              </template>
              <template v-if="design.isBackgroundColor">
                <div class="img" :style="{ background: design.attrs.fill }"></div>
                <div class="name bgc" :style="{ '--color': design.attrs.fill }">{{ design.attrs.fill }}</div>
              </template>
              <template v-if="design.isText">
                <div class="img" :style="{ background: design.attrs.fill }"></div>
                <div class="name bgc" :style="{ '--color': design.attrs.fill }">{{ design.attrs.text }}</div>
              </template>
            </div>
            <div class="fun-list">
              <template v-if="design.isImage || design.isBackgroundImage">
                <!--收藏-->
                <div class="fun-box" :class="{ active: design.isCollect() }" @click="design.collect()">
                  <CollectSvg />
                </div>
              </template>
              <template v-if="design.isImage || design.isText">
                <!--置顶-->
                <div class="fun-box" :class="{ disabled: false }" @click="design.moveUp()">
                  <LayerTopSvg />
                </div>
                <!--置底-->
                <div class="fun-box" :class="{ disabled: false }" @click="design.moveDown()">
                  <LayerBottomSvg />
                </div>
              </template>
              <!--显示/隐藏-->
              <div class="fun-box" @click="design.visible()">
                <VisibleSvg v-if="design.attrs.visible" />
                <NoVisibleSvg v-else />
              </div>
              <!--删除-->
              <div class="fun-box" @click="design.remove()">
                <DeleteSvg />
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
// components
import DeleteSvg from '@/views/designerApp/components/svg/deleteSvg.vue';
import VisibleSvg from '@/views/designerApp/components/svg/visibleSvg.vue';
import NoVisibleSvg from '@/views/designerApp/components/svg/noVisibleSvg.vue';
import LayerBottomSvg from '@/views/designerApp/components/svg/layerBottomSvg.vue';
import LayerTopSvg from '@/views/designerApp/components/svg/layerTopSvg.vue';
import CollectSvg from '@/views/designerApp/components/svg/collectSvg.vue';
import pricePop from './pricePop.vue';
// utils
import { AppUtil } from '@/hooksFn/useGlobalDesigner/utils/utils';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';
import { useDesignerAppConfig } from '@/hooksFn/useGlobalDesigner/core/config';
import { computedAsync, useDebounceFn } from '@vueuse/core';

// 价格维护
const { price } = usePrice();
function usePrice() {
  // 当前价格
  const price = computed(() => {
    let price = '';
    if (templatePriceList.value && !priceLoading.value) {
      if (templateSpecialType.value === '') {
        price = '未获取到价格';
      } else {
        if (templatePriceList.value?.length) {
          let prop;
          if (templateSpecialType.value === useDesignerAppConfig().template_special_type_1) {
            prop = activeSizeId.value;
          } else if (templateSpecialType.value === useDesignerAppConfig().template_special_type_0) {
            prop = activeSizeId.value;
          }
          price = `￥${getTemplatePrice(templatePriceList.value, prop, templateSpecialType.value)}`;
        }
      }
    }
    return price;
  });

  /**
   * 获取模板价格根据类型
   * @param {array} list 模板价格列表
   * @param {string} prop 类型 例如：尺码 | 颜色 会是激活的id
   * @param {string} isSpecial 是否是特殊模板 2-正常 1-颜色 0-尺码
   * @param {number} num 1：获取价格 2：获取数量
   * @returns {string}
   * */
  function getTemplatePrice(list, prop, isSpecial, num = 1) {
    const appearances = activeTemplate.value.detail.appearances;
    const sizes = activeTemplate.value.detail.sizes;

    if (list.length === 0) return '';
    if (list[0].prop === '') return list[0].list.find((e) => e.num === num)?.price;
    // 颜色
    if ([useDesignerAppConfig().template_special_type_1].includes(isSpecial)) {
      const result = appearances.find((e) => e.id == prop);
      if (!result) return '';
      return list.find((e) => e.prop === result.name)?.list.find((e) => e.num === num)?.price;
    }
    // 尺码
    if ([useDesignerAppConfig().template_special_type_0].includes(isSpecial)) {
      const result = sizes.find((e) => e.id == prop);
      if (!result) return '';
      return list.find((e) => e.prop === result.name)?.list.find((e) => e.num === num)?.price;
    }
    return '';
  }
  return {
    price,
  };
}

// 图层开关
const designListVisible = ref(true);
// 模板属性
const {
  // 模板详情
  templateVisible,
  // 价格
  templateSpecialType,
  priceLoading,
  templatePriceList,
  // 工艺
  craftLoading,
  templateCraft,
  // 基础属性
  renderLoading,
  activeTemplate,
  activeView,
  activeColor,
  activeSizeId,
  activeColorId,
  setColorId,
  setSizeId,
} = useDesignerApplication();
const { showImagName } = useTemplateData();

// 模板是否有设计
const isTemplateDesign = computed(() => {
  return (size) => {
    const t = useDesignerApplication().templateList.value.find((t) => t.size === size);
    return t?.hasDesign();
  };
});

// 多角度-渲染
function onRender() {
  activeTemplate.value.renderMulti();
}
// 多角度-3d
const { getMultiContainerId } = useDesignerAppConfig();
const getMulti3d = computed(() => {
  /**@param {import('d').colorMultiImageItem} item*/
  return (item) => {
    return activeTemplate.value?.multi3DList.find((m) => m.multiId === item.multiId || m.composeId === item.composeId);
  };
});
const isMulti3D = computed(() => {
  /**@param {import('d').colorMultiImageItem} item*/
  return (item) => getMulti3d.value(item)?.config.glbPath;
});

// 模板属性
function useTemplateData() {
  const showImagName = (design) => {
    if (design.detail?.quickimgid) return design.detail.imageName;
    return design.detail.name;
  };
  return {
    showImagName,
  };
}
</script>

<style scoped lang="less">
// 模板设计信息
.template-design-wrap {
  background-color: #fff;
  box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5), 0px -1px 0px 0px #eeeeee;
  flex: 1;
  display: flex;
  flex-direction: column;

  .body {
    display: flex;
    flex-direction: column;
    padding: var(--fn-gap) var(--fn-gap) 0 var(--fn-gap);
  }

  // 标题
  .title-wrap {
    font-weight: bold;
    font-size: 1.6rem;
    color: #000c01;
    line-height: 1.9rem;
    text-shadow: 0px 4px 6px rgba(242, 242, 242, 0.5);
    margin-bottom: var(--fn-gap-min);
    // 超出2行显示省略号
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  // 副标题
  .sub-title-wrap {
    display: flex;
    margin-bottom: var(--fn-gap-min);
    .price {
      font-weight: bold;
      font-size: 1.6rem;
      line-height: 2.1rem;
      color: #fc6b20;
      text-shadow: 0px 4px 6px rgba(242, 242, 242, 0.5);
      margin-right: var(--fn-gap-min);
    }
    .price-icon {
      //font-weight: bold;
      font-size: 1.4rem;
      line-height: 2.1rem;
      color: #fc6b20;
      //text-shadow: 0px 4px 6px rgba(242, 242, 242, 0.5);
      margin-right: var(--fn-gap);
    }
    .info {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      line-height: 1.6rem;
      color: var(--fn-blue-color);
      text-shadow: 0px 4px 6px rgba(242, 242, 242, 0.5);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  // 颜色,尺码
  .list-wrap {
    margin-bottom: var(--fn-gap-min);
    display: flex;
    align-items: center;
    width: 100%;
    .title {
      font-weight: bold;
      font-size: 1.4rem;
      line-height: 1.9rem;
      color: #000c01;
      text-shadow: 0px 4px 6px rgba(242, 242, 242, 0.5);
      margin-right: var(--fn-gap-min);
    }
    .el-scrollbar-custom-wrap {
      width: 100%;
    }
    .el-scrollbar-custom-view {
      display: flex;
    }
    .item-list {
      flex: 1;
      display: flex;
      @size: 2.2rem;
      .design {
        white-space: nowrap;
        color: var(--fn-primary-color);
      }
      .box-item {
        height: fit-content;
        padding: calc(var(--fn-gap-min) * 0.7);
        border: 1px solid #f7f8f9;
        background: #f7f8f9;
        box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
        border-radius: 0.4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-right: var(--fn-gap-min);
        &:last-child {
          margin-right: 0;
        }
        &:hover {
          border-color: var(--fn-primary-color);
          background-color: #fff8f5;
          .size {
            color: var(--fn-primary-color) !important;
          }
        }
      }
      // 尺码
      .size-item {
        border-color: #efefef;
        .size {
          padding: 0 var(--fn-gap-min);
          height: @size;
          white-space: nowrap;
          line-height: @size;
          color: #7e7e7e;
          font-size: 1.4rem;
        }
      }
      // 颜色
      .color-item {
        border-color: #efefef;
        .color {
          width: @size;
          height: @size;
          //background: #1bd575;
          box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
          border-radius: 0.4rem;
        }
      }
      .active {
        border-color: var(--fn-primary-color);
        background-color: #fff8f5;
        .size {
          color: var(--fn-primary-color) !important;
        }
      }
    }
  }
  // 多角度
  .multi-wrap {
    margin-bottom: var(--fn-gap-min);
    width: 100%;
    @multiNavHeight: 16px;
    .multi-box {
      padding-bottom: calc(100% + @multiNavHeight);
      position: relative;
      .multi-box-bd {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .multi-content {
          width: 100%;
          height: 100%;
          position: relative;
          // 操作按钮
          .fun-btn {
            font-size: 1.4rem;
            padding: calc(var(--fn-gap-min) * 0.5) var(--fn-gap);
            //width: 6rem;
            //height: 2.8rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000c01;
            box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
            border-radius: 0px 8px 0px 8px;
            border: 1px solid #e1e1e1;
            opacity: 0.2;
            color: #fff;
            cursor: pointer;
            &:hover {
              opacity: 0.9;
              background: var(--fn-primary-color-hover2);
              color: var(--fn-primary-color);
              //border-color: var(--fn-primary-color);
            }
          }
          .render-btn {
            position: absolute;
            z-index: 3;
            right: 0;
          }
          .preview-btn {
            border-radius: 0 8px 0 8px;
            position: absolute;
            z-index: 3;
            left: 0;
            bottom: @multiNavHeight;
          }

          :deep(.el-carousel) {
            height: 100%;
            display: flex;
            flex-direction: column;
            .el-carousel__container {
              height: 100% !important;
              box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
              border-radius: 0.8rem;
              border: 1px solid #e1e1e1;
              overflow: hidden;
            }
            // 小圆点
            .el-carousel__indicators {
              .el-carousel__indicator--horizontal {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #b2b2b2;
                box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
                padding: 0;
                margin-right: var(--fn-gap-min);
                .el-carousel__button {
                  display: none;
                }
              }
              .is-active {
                background-color: var(--fn-primary-color);
              }
            }
            // 箭头
            .el-carousel__arrow--right {
              position: absolute;
              right: 0;
              width: 28px;
              height: 48px;
              box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
              border-radius: 8px 0px 0px 8px;
              .el-icon-arrow-right {
                font-size: 24px;
                font-weight: bold;
              }
              &:hover {
                color: var(--fn-primary-color);
                background: var(--fn-primary-color-hover2);
              }
            }
            .el-carousel__arrow--left {
              position: absolute;
              left: 0;
              width: 28px;
              height: 48px;
              box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
              border-radius: 0px 8px 8px 0px;
              .el-icon-arrow-left {
                font-size: 24px;
                font-weight: bold;
              }
              &:hover {
                color: var(--fn-primary-color);
                background: var(--fn-primary-color-hover2);
              }
            }
          }

          // 展示盒子
          .show-box {
            width: 100%;
            height: 100%;
            position: relative;
            .child-box {
              width: 100%;
              height: 100%;
              position: absolute;
            }
          }
        }
      }
    }
  }

  // 设计列表
  .design-wrap {
    padding: var(--fn-gap-min);
    width: 100%;
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    .header {
      background-color: #f7f8f9;
      width: 100%;
      height: 4rem;
      box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
      border-radius: 0.4rem;
      padding: 0 var(--fn-gap);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 1.4rem;
        color: #000c01;
        line-height: 1.9rem;
        text-shadow: 0px 4px 6px rgba(242, 242, 242, 0.5);
      }
      .switch {
      }
    }
    .list {
      padding: var(--fn-gap-min) var(--fn-gap-min) 0 var(--fn-gap-min);
      background-color: #f7f8f9;
      flex: 1 0 0;
      .item-list {
        margin-bottom: calc(var(--fn-gap-min) / 2);
        &:last-child {
          margin-bottom: 0;
        }
        .design-item {
          box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
          display: flex;
          justify-content: space-between;
          padding: calc(var(--fn-gap-min) / 2);
          overflow: hidden;
          border: 1px solid #f7f8f9;
          border-radius: 4px;
          cursor: pointer;
          &:hover {
            border-color: var(--fn-primary-color);
          }
          .head-design {
            display: flex;
            align-items: center;
            background-color: #fff;
            max-width: 13rem;
            width: 13rem;
            overflow: hidden;
            // 背景色
            --color: #000c01;
            .bgc {
              flex: 1;
              text-align: center;
              letter-spacing: 1px;
              //text-shadow: 0 0 3px var(--color);
              //color: #000c01;
              color: var(--color);
              font-size: 14px;
            }
            .img {
              min-width: 4rem;
              min-height: 4rem;
              width: 4rem;
              height: 4rem;
              border-radius: 4px;
            }
            .name {
              margin-left: 4px;
              text-overflow: ellipsis;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
          }
        }
        .fun-list {
          display: flex;
          align-items: center;
          .fun-box {
            user-select: none;
            width: 3.2rem;
            height: 3.2rem;
            background: #ffffff;
            box-shadow: 0px 4px 6px 0px rgba(242, 242, 242, 0.5);
            border-radius: 4px;
            margin-left: var(--fn-gap-min);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #f7f8f9;
            cursor: pointer;
            color: #5b6b73;
            &:hover {
              border-color: var(--fn-primary-color);
              color: var(--fn-primary-color);
            }
          }
          .active {
            border-color: var(--fn-primary-color);
            color: var(--fn-primary-color);
          }
          .disabled {
            cursor: not-allowed;
            opacity: 0.5;
            //color: #c5c5c5;
            &:hover {
              border-color: #f7f8f9;
              color: #5b6b73;
            }
          }
        }
      }
    }
  }
}
</style>
