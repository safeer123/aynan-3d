import { Button, Tooltip } from 'antd';
import { useContext } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import {
  BottomGroupsWrapper,
  Overlay,
  Group1,
  Group2,
  SliderCustom,
  HorizSliderWrapper,
  VertSliderWrapper,
} from './styles';
import AnaglyphImageSelector from '../image-selector/anaglyph';
import RenderTypeSelector from '../render-type-selector';
import { RenderType } from '../../types/render';
import SingleImageSelector from '../image-selector/single';
import CameraInputReceiver from '../camera-input-receiver';

const OVERLAY_TIMEOUT = 2000; // in millisec

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
    (controlValues?.selectedRenderType === RenderType.ANAGLYPH_FROM_PHOTOS ||
      controlValues?.selectedRenderType === RenderType.ANAGLYPH_FROM_CAMERA) &&
      controlValues?.renderConfig,
  );

  return (
    <Overlay delay={OVERLAY_TIMEOUT} defaultTransition hideCursor>
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
      <BottomGroupsWrapper>
        <Group1>
          <RenderTypeSelector />
        </Group1>
        <Group1>
          {controlValues?.selectedRenderType === RenderType.ANAGLYPH_FROM_CAMERA && (
            <CameraInputReceiver />
          )}
          {controlValues?.selectedRenderType === RenderType.SINGLE && <SingleImageSelector />}
          {controlValues?.selectedRenderType === RenderType.ANAGLYPH_FROM_PHOTOS && (
            <AnaglyphImageSelector />
          )}
          {(showSingleRenderControls || showAnaglyphRenderControls) && (
            <Tooltip title="Download as PNG" placement="bottomRight" mouseEnterDelay={1}>
              <Button shape="circle" icon={<DownloadOutlined />} onClick={downloadAnaglyph} />
            </Tooltip>
          )}
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
        </Group1>
      </BottomGroupsWrapper>
    </Overlay>
  );
}
export default Controls;
