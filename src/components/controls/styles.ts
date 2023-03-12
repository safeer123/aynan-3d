import styled from 'styled-components';
import { Slider } from 'antd';
import HideOnMouseAway from '../../utils/HideOnMouseAway';

export const Overlay = styled(HideOnMouseAway)`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const Group1 = styled.div`
  width: 100%;
  display: flex;
  gap: 36px;
  align-items: center;
  justify-content: flex-end;
  padding: 36px;
`;

export const Group2 = styled.div`
  height: 50%;
  display: flex;
  flex-direction: column;
  gap: 36px;
  align-items: center;
  padding: 0px 36px;
`;

export const SliderCustom = styled(Slider)`
  margin: 0;
  border-radius: 8px;
  background-color: #5465ff82;
`;

export const HorizSliderWrapper = styled.div`
  width: 50%;
`;

export const VertSliderWrapper = styled.div`
  height: 70%;
`;

export const BottomArea = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 16px;
`;
