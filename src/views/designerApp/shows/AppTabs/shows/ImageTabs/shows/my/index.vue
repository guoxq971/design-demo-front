<template>
  <TabCard>
    <TabBody>
      <TabCondition>
        <!--搜索-->
        <SearchCard v-model="params.query" placeholder="请输入素材名称" :getList="onSearch" :loading="loading" />
        <TabConditionSecond>
          <!--圖片來源-->
          <el-select v-model="params.customerId" :loading="accountLoading">
            <el-option v-for="item in accountList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <!--图片类型-->
          <ImageTypeButton :imageType.sync="params.imageType" :getList="onSearch" />
          <!--上传图片-->
          <ElpButton icon="el-icon-upload" type="primary" class="icon-btn" />
        </TabConditionSecond>
      </TabCondition>
      <TabList :list="list" @onMouseenter="onMouseenter" @onMouseleave="onMouseleave" @onContextmenu="onContextmenu" @onClick="onClick" v-loading="loading">
        <template slot-scope="{ row }">
          <img :src="AppUtil.setStartHttp(row.designImg)" class="fn-full" />
        </template>
      </TabList>
    </TabBody>
    <TabPagination :params.sync="params" :total="total" :get-list="getList" />
  </TabCard>
</template>

<script setup>
import { onMounted } from 'vue';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useGlobalMyImage } from '@/hooksFn/useDesignerApplication/core/image/myImage';
import { useGlobalApplication } from '@/hooksFn/useDesignerApplication/core/app/application';
import { useContextmenu, useHover } from '@/views/designerApp/hooks/common';
import { useGlobalData } from '@/hooksFn/useDesignerApplication/core/globalData';
// components
import TabConditionSecond from '@/views/designerApp/shows/AppTabs/components/Tab/TabConditionSecond.vue';
import ImageTypeButton from '../../../../components/ImageTypeButton/index.vue';
import ElpButton from '@/views/designerApp/components/ElpButton.vue';
import TabCard from '@/views/designerApp/shows/AppTabs/components/Tab/TabCard.vue';
import TabBody from '@/views/designerApp/shows/AppTabs/components/Tab/TabBody.vue';
import TabCondition from '@/views/designerApp/shows/AppTabs/components/Tab/TabCondition.vue';
import TabList from '@/views/designerApp/shows/AppTabs/components/Tab/TabList.vue';
import TabPagination from '@/views/designerApp/shows/AppTabs/components/Tab/TabPagination.vue';
import SearchCard from '@/views/designerApp/shows/AppTabs/components/TabCard/SearchCard.vue';

// 我的图库
const { list, total, params, loading, getList, onSearch, onClick, accountLoading, accountList } = useMyImageData();
// 全局数据
const { contextmenus, hovers } = useGlobalData();
// 鼠标经过
const { onMouseenter, onMouseleave } = useHover(hovers.image);
// 右键菜单
const { onContextmenu } = useContextmenu(contextmenus.image);

// 我的图库
function useMyImageData() {
  const { designs } = useGlobalData().defineData;
  const { setDesignImage } = useGlobalApplication();
  const { list, total, params, loading, getList, onSearch, accountListService } = useGlobalMyImage();
  const { getList: getAccountList, list: accountList, loading: accountLoading } = accountListService;

  onMounted(() => {
    // 获取列表
    getList();
    // 获取账户列表(图片来源)
    getAccountList().then((_) => {
      // 默认赋值
      const user = AppUtil.getLocalUserInfo();
      const d = accountList.value.find((e) => e.value === user?.accountSeqId);
      d && (params.value.customerId = d.value);
    });
  });

  // 设置设计图
  const onClick = (detail) => {
    setDesignImage(detail);
  };

  return {
    list,
    total,
    params,
    loading,
    getList,
    onSearch,
    accountList,
    accountLoading,
    onClick,
  };
}
</script>

<style scoped lang="less"></style>
