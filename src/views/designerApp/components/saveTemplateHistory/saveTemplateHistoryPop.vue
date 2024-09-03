<template>
  <transition name="el-fade-in-linear">
    <div class="pop" :style="style" style="position: fixed" v-show="visible">
      <div class="header" ref="el">
        <div>
          我最近设计过的产品
          <span @click="getList" class="el-icon-refresh refresh"></span>
        </div>
        <div @click="onClose" class="close el-icon-close"></div>
      </div>
      <!--列表-->
      <div class="body" v-loading="loading" @mousedown.stop>
        <div style="width: 30%;height: 33.3%;margin: 1%;" v-for="item in showList" :key="item.code">
          <div @click="onSel(item)" class="box-wrap" v-loading="item.loading" @mousedown.stop>
            <!--删除按钮-->
            <el-popover popper-class="history-popover" placement="bottom" width="170" v-model="item.visible">
              <p class="fn-mb-gap-min">是否确认删除该产品？</p>
              <div style="text-align: right; margin: 0">
                <el-button type="text" @click="item.visible = false" class="fn-button-text">取消</el-button>
                <el-button type="primary" @click.stop="onDel(item)" class="fn-button-mini">确定</el-button>
              </div>
              <div slot="reference" class="close el-icon-circle-close" @click.stop />
            </el-popover>

            <div class="pic">
              <el-image :src="item.imgUrl" />
            </div>
            <div class="title">{{ item.code }}</div>
          </div>
        </div>

        <!--空盒子-->
        <div style="width: 30%;height: 33.3%;margin: 1%;" v-for="item in 6 - showList.length" :key="item" />
      </div>
      <!--分页-->
      <div class="footer">
        <pageContainer @mousedown.native.stop :param="params" :total="total" />
      </div>
    </div>
  </transition>
</template>

<script setup>
import pageContainer from './page.vue';
import { useDraggable } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { GRequest, METHOD } from '@/utils/request';
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
const { visible, el, x, y, style, loading, list, params, showList, total, getList, onClose, onDel } = useGlobalDesigner().templateHistory;
</script>

<style scoped lang="less">
.pop {
  z-index: 11;
  background-color: #fff;
  border: 1px solid #e1e1e1;
  width: 36rem;
  padding: 0;
  font-size: 1.2rem;
}
.header {
  padding: 0.7rem 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  //cursor: default;
  cursor: move;

  .refresh {
    cursor: pointer;
  }

  .close {
    cursor: pointer;
    font-size: 1.8rem;
    font-weight: bold;
    &:hover {
      color: var(--fn-primary-color);
    }
  }
}
.body {
  margin-top: 0.2rem;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;

  .box-wrap {
    transition: all 0.3s;
    border: 0.1rem solid #eee;
    border-radius: 0.4rem;
    overflow: hidden;
    position: relative;
    &:hover {
      border-color: var(--fn-primary-color);
    }

    .close {
      position: absolute;
      right: 0.4rem;
      top: 0.4rem;
      cursor: pointer;
      font-size: 1.6rem;
      z-index: 2;
      color: #333;
      &:hover {
        color: var(--fn-primary-color);
      }
    }

    .pic {
      cursor: pointer;
      user-select: none;
    }

    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 2.1rem;
    }
  }
}

.footer {
  height: 3rem;
  //background-color: green;
  margin-top: 0.8rem;
  margin-bottom: 0.5rem;
}
</style>
