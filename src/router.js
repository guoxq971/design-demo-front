import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/designerApp/',
  },
  {
    path: '/testThree/*',
    name: 'testThree',
    component: () => import('@/views/testThree'),
  },
  {
    path: '/testKonva/*',
    name: 'testKonva',
    component: () => import('@/views/testKonva'),
  },
  {
    path: '/previewThree/*',
    name: 'previewThree',
    component: () => import('@/views/previewThree'),
  },
  {
    path: '/designerApp/*',
    name: 'designerApp',
    component: () => import('@/views/designerApp'),
  },
  {
    path: '/selectMap/*',
    name: 'selectMap',
    component: () => import('@/views/selectMap'),
  },
  {
    path: '/shoppingCart/*',
    name: 'shoppingCart',
    component: () => import('@/views/shoppingCart'),
  },
];

export default routes;
