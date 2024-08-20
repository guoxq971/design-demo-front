import { ref, onBeforeUnmount, onMounted } from 'vue';
import { defineStore } from 'pinia';

/**
 * 设备自适应 hooks
 */
export const useDevice = () => {
  // const { setRadio } = useDeviceStore();

  // 设备自适应 html font-size = calc(62.5% * 设备宽度 / 1920)
  const setHtmlFontSize = () => {
    const html = document.documentElement;
    const width = html.clientWidth;
    const radio = Math.max(width, 1440) / 1920;
    // 设置比例
    // setRadio(radio);
    // 设置html的font-size
    html.style.fontSize = `calc(62.5% * ${radio})`;
  };

  // 防抖 setHtmlFontSize
  const debounceSetHtmlFontSize = () => {
    let timer = null;
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setHtmlFontSize();
      }, 300);
    };
  };

  // 监听窗口变化
  onMounted(() => {
    setHtmlFontSize();
    window.addEventListener('resize', setHtmlFontSize);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', setHtmlFontSize);
  });
};

/**
 * 设备自适应 pinia
 */
export const useDeviceStore = defineStore('addEvent', () => {
  // 比例
  const radio = ref(1);
  const setRadio = (val) => {
    radio.value = val;
  };

  return {
    radio,
    setRadio,
  };
});
