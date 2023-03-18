import styled from 'styled-components';
import { Slider } from 'antd';
import HideOnMouseAway from '../../utils/hide-on-mouse-away';

export const Overlay = styled(HideOnMouseAway)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const BottomGroupsWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 36px;
  align-items: center;
  justify-content: space-between;
  padding: 36px;
`;

export const Group1 = styled.div`
  display: flex;
  gap: 36px;
  align-items: center;
  flex: 1;

  :nth-of-type(2) {
    flex: 2;
    justify-content: flex-end;
  }
`;

export const Group2 = styled.div`
  height: 30%;
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
  flex-grow: 1;
`;

export const VertSliderWrapper = styled.div`
  height: 100%;
`;
