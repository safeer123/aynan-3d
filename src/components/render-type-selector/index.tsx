import { Segmented } from 'antd';
import { BlockOutlined, PictureOutlined } from '@ant-design/icons';
import { SegmentedValue } from 'antd/es/segmented';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { RenderType } from '../../types/render';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { Modes, Routes } from '../../router/constants';

const StyledSegmented = styled(Segmented)`
  .ant-segmented-item {
    border: 1px solid transparent;
  }
  .ant-segmented-item-selected {
    border: 1px solid #b0b0b0;
  }
`;

const ModeToRoute = {
  [Modes.SinglePhoto]: RenderType.SINGLE,
  [Modes.AnaglyphPhoto]: RenderType.ANAGLYPH_FROM_PHOTOS,
  [Modes.AnaglyphVideo]: RenderType.ANAGLYPH_FROM_CAMERA,
};

const RouteToMode = {
  [RenderType.SINGLE]: Modes.SinglePhoto,
  [RenderType.ANAGLYPH_FROM_PHOTOS]: Modes.AnaglyphPhoto,
  [RenderType.ANAGLYPH_FROM_CAMERA]: Modes.AnaglyphVideo,
};

const RenderTypeSelector = () => {
  const { controlValues, updateControlValues } = useContext(
    AnaglyphTBContext,
  ) as AnaglyphTBContextType;

  const { mode } = useParams();
  const navigate = useNavigate();

  const onChangeType = (value: SegmentedValue) => {
    navigate(Routes.ANAGLYPH_TOOLBOX.replace(':mode?', value as string));
  };

  useEffect(() => {
    const renderType = ModeToRoute[mode as Modes] as RenderType;
    updateControlValues({
      selectedRenderType: renderType,
    });
  }, [mode]);

  return (
    <StyledSegmented
      onChange={onChangeType}
      value={
        controlValues?.selectedRenderType &&
        (RouteToMode[controlValues?.selectedRenderType] as Modes)
      }
      options={[
        {
          label: 'Single Photo',
          value: Modes.SinglePhoto,
          icon: <PictureOutlined />,
        },
        {
          label: 'Anaglyph from photos',
          value: Modes.AnaglyphPhoto,
          icon: <BlockOutlined />,
        },
        {
          label: 'Anaglyph from videos',
          value: Modes.AnaglyphVideo,
          icon: <BlockOutlined />,
        },
      ]}
    />
  );
};

export default RenderTypeSelector;
