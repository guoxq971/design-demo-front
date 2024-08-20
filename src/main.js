import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router';
import App from './App.vue';

Vue.config.productionTip = false;

// element
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/element-theme/index.css';
import './assets/css/element/index.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

// pinia
import { createPinia, PiniaVuePlugin } from 'pinia';
Vue.use(PiniaVuePlugin);
const pinia = createPinia();

// axios
import { loadInterceptors } from '@/fnConfig/fnRequest';
loadInterceptors();

// 路由
const router = new VueRouter({
  mode: 'history',
  routes,
});

export let vm = null;
vm = new Vue({
  router,
  pinia,
  render: (h) => h(App),
}).$mount('#app');
