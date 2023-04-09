import React, { useContext, useEffect, useMemo } from 'react';
import { MenuProps } from 'antd';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { StyledOptionItem, StyledThumb, SelectorWrapper } from './styles';
import { RenderType, SingleRenderConfig } from '../../types/render';
import ImageDropdown from '../image-dropdown-abstract';

const ImageSelector: React.FC = () => {
  const { fileList, controlValues, updateControlValues } = useContext(
    AnaglyphTBContext,
  ) as AnaglyphTBContextType;

  const items: MenuProps['items'] = useMemo(
    () =>
      fileList.map((fl, index) => ({
        key: `${index}`,
        label: (
          <StyledOptionItem>
            <StyledThumb src={fl?.preview} />
            <span>{fl?.name}</span>
          </StyledOptionItem>
        ),
      })),
    [fileList],
  );

  const onClick = (id: string, key: string) => {
    updateControlValues({
      renderConfig: {
        type: RenderType.SINGLE,
        imgData: fileList[+key],
      },
    });
  };

  useEffect(() => {
    if (!(fileList.length > 0)) {
      updateControlValues({
        renderConfig: undefined,
      });
      return;
    }

    if (
      !controlValues?.renderConfig ||
      controlValues?.renderConfig?.type === RenderType.ANAGLYPH_FROM_PHOTOS ||
      !fileList.find(
        (imgFile) => imgFile === (controlValues?.renderConfig as SingleRenderConfig)?.imgData,
      )
    ) {
      // inital state
      updateControlValues({
        renderConfig: {
          type: RenderType.SINGLE,
          imgData: fileList[0],
        },
      });
    }
  }, [fileList]);

  const selectedIndex = useMemo(() => {
    if (controlValues?.renderConfig) {
      const foundIndex = fileList.indexOf(
        (controlValues?.renderConfig as SingleRenderConfig).imgData,
      );
      return foundIndex !== -1 ? foundIndex : undefined;
    }
    return undefined;
  }, [fileList, controlValues]);

  return (
    <SelectorWrapper>
      <ImageDropdown
        disabled={!controlValues?.renderConfig}
        items={items}
        selectedIndex={selectedIndex}
        onClick={onClick}
        id="img-index"
        label="Select"
      />
    </SelectorWrapper>
  );
};

export default ImageSelector;
