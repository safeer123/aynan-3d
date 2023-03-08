import styled from 'styled-components';
import { Slider, Button, Tooltip } from 'antd';
import { useContext } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import HideOnMouseAway from '../../utils/HideOnMouseAway';

const Overlay = styled(HideOnMouseAway)`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Group1 = styled.div`
  width: 100%;
  display: flex;
  gap: 36px;
  align-items: center;
  justify-content: flex-end;
  padding: 36px;
`;

const Group2 = styled.div`
  height: 50%;
  display: flex;
  flex-direction: column;
  gap: 36px;
  align-items: center;
  padding: 0px 36px;
`;

const SliderCustom = styled(Slider)`
  margin: 0;
  border-radius: 8px;
  background-color: #5465ff82;
`;

const HorizSliderWrapper = styled.div`
  width: 50%;
`;

const VertSliderWrapper = styled.div`
  height: 70%;
`;

function Controls() {
  const { controlValues, setControlValues, downloadAnaglyph } = useContext(
    AnaglyphTBContext,
  ) as AnaglyphTBContextType;

  const onChangeVal = (key: string, value: number | [number, number]) => {
    // console.log('onChange: ', value);
    setControlValues({ ...controlValues, [key]: value });
  };

  // const onAfterChange = (value: number | [number, number]) => {};

  return (
    <Overlay delay={2000} defaultTransition hideCursor>
      <Group1>
        <HorizSliderWrapper>
          <SliderCustom
            defaultValue={0}
            value={controlValues?.deltaX || 0}
            min={-50}
            max={50}
            step={0.25}
            onChange={(val) => onChangeVal('deltaX', val)}
            // onAfterChange={onAfterChange}
          />
        </HorizSliderWrapper>

        <Tooltip title="Download anaglyph as PNG" placement="bottomRight" mouseEnterDelay={1}>
          <Button
            type="primary"
            shape="circle"
            icon={<DownloadOutlined />}
            onClick={downloadAnaglyph}
          />
        </Tooltip>
      </Group1>

      <Group2>
        <VertSliderWrapper>
          <SliderCustom
            defaultValue={0}
            value={controlValues?.deltaY || 0}
            min={-20}
            max={20}
            step={0.1}
            vertical
            onChange={(val) => onChangeVal('deltaY', val)}
            // onAfterChange={onAfterChange}
          />
        </VertSliderWrapper>
      </Group2>
    </Overlay>
  );
}
export default Controls;
