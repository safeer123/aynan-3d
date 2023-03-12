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
  BottomArea,
} from './styles';
import AnaglyphImageSelector from '../image-selector/anaglyph';
import RenderTypeSelector from '../render-type-selector';
import { RenderType } from '../../types/render';
import SingleImageSelector from '../image-selector/single';

function Controls() {
  const { controlValues, updateControlValues, downloadAnaglyph } = useContext(
    AnaglyphTBContext,
  ) as AnaglyphTBContextType;

  const onChangeVal = (key: string, value: number | [number, number]) => {
    updateControlValues({ [key]: value });
  };

  const showSingleRenderControls = Boolean(
    controlValues?.selectedRenderType === RenderType.SINGLE && controlValues?.renderConfig,
  );

  const showAnaglyphRenderControls = Boolean(
    controlValues?.selectedRenderType === RenderType.ANAGLYPH && controlValues?.renderConfig,
  );

  return (
    <Overlay delay={2000} defaultTransition hideCursor>
      <BottomArea>
        <RenderTypeSelector />
      </BottomArea>
      <Group1>
        {controlValues?.selectedRenderType === RenderType.SINGLE && <SingleImageSelector />}
        {controlValues?.selectedRenderType === RenderType.ANAGLYPH && <AnaglyphImageSelector />}
        {showAnaglyphRenderControls && (
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
        )}

        {(showSingleRenderControls || showAnaglyphRenderControls) && (
          <Tooltip title="Download as PNG" placement="bottomRight" mouseEnterDelay={1}>
            <Button
              type="primary"
              shape="circle"
              icon={<DownloadOutlined />}
              onClick={downloadAnaglyph}
            />
          </Tooltip>
        )}
      </Group1>

      <Group2>
        {showAnaglyphRenderControls && (
          <VertSliderWrapper>
            <SliderCustom
              defaultValue={0}
              value={controlValues?.deltaY || 0}
              min={-20}
              max={20}
              step={0.1}
              vertical
              onChange={(val) => onChangeVal('deltaY', val)}
            />
          </VertSliderWrapper>
        )}
      </Group2>
    </Overlay>
  );
}
export default Controls;
