import { RenderConfig, RenderType } from './render';

export interface ControlValues {
  deltaX?: number;
  deltaY?: number;
  selectedRenderType?: RenderType;
  renderConfig?: RenderConfig;
}
