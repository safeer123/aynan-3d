import { ControlValues } from './controls';

export enum RenderType {
  SINGLE = 'SINGLE',
  ANAGLYPH = 'ANAGLYPH',
}

export type SingleRenderConfig = {
  type: RenderType;
  img: string;
};

export type AnaglyphRenderConfig = {
  type: RenderType;
  imgL: string;
  imgR: string;
  controlValues: ControlValues;
};

export type RenderConfig = SingleRenderConfig | AnaglyphRenderConfig;
