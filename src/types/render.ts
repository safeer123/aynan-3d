import { UploadFile } from 'antd';

export enum RenderType {
  SINGLE = 'SINGLE',
  ANAGLYPH = 'ANAGLYPH',
}

export type SingleRenderConfig = {
  type: RenderType;
  imgData: UploadFile;
};

export type AnaglyphRenderConfig = {
  type: RenderType;
  imgDataL: UploadFile;
  imgDataR: UploadFile;
};

export type RenderConfig = SingleRenderConfig | AnaglyphRenderConfig;
