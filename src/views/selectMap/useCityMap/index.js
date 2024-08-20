import axios from 'axios';
import { nextTick, onMounted, reactive, ref } from 'vue';
export function useCityMap(opt = {}) {
  opt = Object.assign({
    isMounted: true,
  });
  const provinceList = ref([]);
  const cityList = ref([]);
  const blockList = ref([]);
  const province = ref('');
  const city = ref('');
  const block = ref('');
  const cityMap = reactive({
    province: provinceList,
    city: cityList,
    block: blockList,
  });

  // 获取数据
  const isLoadData = ref(false);
  const defaultData = ref({
    province: '',
    city: '',
    block: '',
  });
  const getCityData = async () => {
    const obj = await getJsonMapData();
    provinceList.value = obj.provinceList;
    // cityList.value = obj.cityList;
    // blockList.value = obj.blockList;
    isLoadData.value = true;
    // 如果设置了默认值
    if (defaultData.value.province) {
      setDefault(defaultData.value.province, defaultData.value.city, defaultData.value.block);
    }
  };
  onMounted(() => opt.isMounted && getCityData());

  // 超类
  const citySuper = {
    map: cityMap,
  };

  /**
   * 设置默认
   * @param province
   * @param city
   * @param block
   */
  function setDefault(province, city, block) {
    if (!isLoadData.value) {
      // console.error('数据未加载完成');
      defaultData.value.province = province;
      defaultData.value.city = city;
      defaultData.value.block = block;
      return;
    }
    nextTick(() => {
      // 设置城市列表
      for (const index2 in cityMap.province) {
        if (province === cityMap.province[index2].value) {
          cityMap.city = cityMap.province[index2].children;
        }
      }
      // 设置区列表
      for (const index3 in cityMap.city) {
        if (city === cityMap.city[index3].value) {
          cityMap.block = cityMap.city[index3].children;
        }
      }
    });
  }

  return {
    setDefault,
    getCityData,
    provinceList,
    cityList,
    blockList,
    cityMap,
    citySuper,
    province,
    city,
    block,
  };
}

/**
 * 获取json数据
 * @returns {Promise<{provinceList: *[], blockList: *[], cityList: *[]}>}
 */
async function getJsonMapData() {
  // 获取json数据
  const url = '/static/map.json';
  // 省列
  let provinceList = [];
  // 城市
  let cityList = [];
  // 区
  let blockList = [];

  const response = await axios.get(url);
  if (response.status == 200) {
    const data = response.data;
    provinceList = [];
    cityList = [];
    blockList = [];
    // 省市区数据分类
    for (const item in data) {
      if (item.match(/0000$/)) {
        //省
        provinceList.push({ id: item, value: data[item], children: [] });
      } else if (item.match(/00$/)) {
        //市
        cityList.push({ id: item, value: data[item], children: [] });
      } else {
        //区
        blockList.push({ id: item, value: data[item] });
      }
    }
    // 分类市级
    for (const index in provinceList) {
      for (const index1 in cityList) {
        if (provinceList[index].id.slice(0, 2) === cityList[index1].id.slice(0, 2)) {
          provinceList[index].children.push(cityList[index1]);
        }
      }
    }
    // 分类区级
    for (const item1 in cityList) {
      for (const item2 in blockList) {
        if (blockList[item2].id.slice(0, 4) === cityList[item1].id.slice(0, 4)) {
          cityList[item1].children.push(blockList[item2]);
        }
      }
    }
  } else {
    console.log(response.status);
  }

  return {
    provinceList,
    cityList,
    blockList,
  };
}
