import { Segmented } from 'antd';
import { BlockOutlined, PictureOutlined } from '@ant-design/icons';
import { SegmentedValue } from 'antd/es/segmented';
import { useContext } from 'react';
import styled from 'styled-components';
import { RenderType } from '../../types/render';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';

const StyledSegmented = styled(Segmented)`
  .ant-segmented-item {
    border: 1px solid transparent;
  }
  .ant-segmented-item-selected {
    border: 1px solid #b0b0b0;
  }
`;

const RenderTypeSelector = () => {
  const { controlValues, updateControlValues } = useContext(
    AnaglyphTBContext,
  ) as AnaglyphTBContextType;
  const onChangeType = (value: SegmentedValue) => {
    updateControlValues({
      selectedRenderType: value as RenderType,
    });
  };
  return (
    <StyledSegmented
      onChange={onChangeType}
      value={controlValues?.selectedRenderType}
      options={[
        {
          label: 'Single',
          value: RenderType.SINGLE,
          icon: <PictureOutlined />,
        },
        {
          label: 'Anaglyph',
          value: RenderType.ANAGLYPH,
          icon: <BlockOutlined />,
        },
      ]}
    />
  );
};

export default RenderTypeSelector;
