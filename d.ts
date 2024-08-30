import { ComputedRef, Ref } from 'vue';
import { template } from './a-design-app-ts/base.template';
export * from './a-design-app-ts/base.template';
export * from './a-design-app-ts/design';
export * from './a-design-app-ts/designerAppConfig';

// 模板计算computed
export type templateComputed = ComputedRef<template>;
// 模板列表ref
export type templateListRef = Ref<template[]>;
