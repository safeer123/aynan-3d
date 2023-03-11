import { Button, Tooltip } from 'antd';
import { useContext } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import {
  Overlay,
  Group1,
  Group2,
  SliderCustom,
  HorizSliderWrapper,
  VertSliderWrapper,
} from './styles';

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
