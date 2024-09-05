import { ComputedRef, Ref } from 'vue';
import { template, color } from './a-design-app-ts/template-base';
export * from './a-design-app-ts/template-detail';
export * from './a-design-app-ts/template-base';
export * from './a-design-app-ts/template-config';
export * from './a-design-app-ts/template-submit';
export * from './a-design-app-ts/design';
export * from './a-design-app-ts/design-image-detail';
export * from './a-design-app-ts/designerAppConfig';
export * from './a-design-app-ts/design-isOutSide';

// 模算 computed
export type templateComputed = ComputedRef<template>;
// 颜色 computed
export type colorComputed = ComputedRef<color>;
// 模板列表ref
export type templateListRef = Ref<template[]>;
