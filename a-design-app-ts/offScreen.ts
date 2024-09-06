import { template, view } from './template-base';

export type templateAttrs = Pick<template, 'isCommon' | 'isRefine' | 'size' | 'sizeType' | 'is3d' | 'detail' | 'config' | 'exportConfig' | 'templateNo' | 'uuid'>;

export interface offScreenTemplate extends templateAttrs {
  viewList: {
    viewId: string;
    base64: string;
    destroy: () => void;
  }[];
}
