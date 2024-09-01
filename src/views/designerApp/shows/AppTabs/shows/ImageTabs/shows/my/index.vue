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
      <TabList :list="list" @onMouseenter="onMouseenterImage" @onMouseleave="onMouseleave" @onContextmenu="onContextmenuImage" @onClick="onClick" v-loading="loading">
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
import { useGlobalDesigner } from '@/hooksFn/useGlobalDesigner/core';
// utils
import { AppUtil } from '@/hooksFn/useDesignerApplication/utils/utils';
import { useDesignerApplication } from '@/hooksFn/useGlobalDesigner/core/application';

// 我的图库
const { list, total, params, loading, getList, onSearch, accountListService } = useGlobalDesigner().myImage;
const { onClick, accountLoading, accountList } = useMyImageData(accountListService);
// 鼠标经过
const { onMouseenterImage, onMouseleave } = useGlobalDesigner().hover;
// 右键菜单
const { onContextmenuImage } = useGlobalDesigner().contextmenu;

// 我的图库
function useMyImageData() {
  const { onSearch, accountListService } = useGlobalDesigner().myImage;
  const { getList: getAccountList, list: accountList, loading: accountLoading } = accountListService;

  onMounted(() => {
    // 获取列表
    onSearch();
    // 获取账户列表(图片来源)
    getAccountList().then((_) => {
      // 默认赋值
      const user = AppUtil.getLocalUserInfo();
      const d = accountList.value.find((e) => e.value === user?.accountSeqId);
      d && (params.value.customerId = d.value);
    });
  });

  // 设置设计图
  const onClick = (detail) => useDesignerApplication().addImage(detail);

  return {
    accountList,
    accountLoading,
    onClick,
  };
}
</script>

<style scoped lang="less"></style>
