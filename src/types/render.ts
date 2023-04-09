import { UploadFile } from 'antd';

export enum RenderType {
  SINGLE = 'SINGLE',
  ANAGLYPH_FROM_PHOTOS = 'ANAGLYPH_FROM_PHOTOS',
  ANAGLYPH_FROM_CAMERA = 'ANAGLYPH_FROM_CAMERA',
}

export interface SingleRenderConfig {
  type: RenderType;
  imgData: UploadFile;
}

export interface AnaglyphRenderConfig {
  type: RenderType;
  imgDataL: UploadFile;
  imgDataR: UploadFile;
}

export interface AnaglyphVideoRenderConfig {
  type: RenderType;
  leftVideo?: HTMLVideoElement;
  rightVideo?: HTMLVideoElement;
}

export type RenderConfig = SingleRenderConfig | AnaglyphRenderConfig | AnaglyphVideoRenderConfig;
