import React, { useContext, useEffect, useMemo } from 'react';
import { MenuProps } from 'antd';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { StyledOptionItem, StyledThumb, SelectorWrapper } from './styles';
import ImageDropdown from '../image-dropdown-abstract';
import { AnaglyphRenderConfig, RenderType } from '../../types/render';

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
            <StyledThumb src={fl?.thumbUrl} />
            <span>{fl?.name}</span>
          </StyledOptionItem>
        ),
      })),
    [fileList],
  );

  const onClick = (id: string, key: string) => {
    updateControlValues({
      renderConfig: {
        ...controlValues.renderConfig,
        type: RenderType.ANAGLYPH,
        [id]: fileList[+key],
      } as AnaglyphRenderConfig,
    });
  };

  const getFileIndex = (imgKey: 'imgDataL' | 'imgDataR') => {
    if (controlValues?.renderConfig) {
      const foundIndex = fileList.indexOf(
        (controlValues?.renderConfig as AnaglyphRenderConfig)[imgKey],
      );
      return foundIndex !== -1 ? foundIndex : undefined;
    }
    return undefined;
  };

  useEffect(() => {
    if (!(fileList.length >= 2)) {
      updateControlValues({
        renderConfig: undefined,
      });
      return;
    }

    if (!controlValues?.renderConfig || controlValues?.renderConfig?.type === RenderType.SINGLE) {
      // inital state
      const updatedConfig: AnaglyphRenderConfig = {
        type: RenderType.ANAGLYPH,
        imgDataL: fileList[0],
        imgDataR: fileList[1],
      };
      updateControlValues({ renderConfig: updatedConfig });
      return;
    }

    // check left image is missing
    let updatedConfig = controlValues?.renderConfig as AnaglyphRenderConfig;
    if (
      !fileList.find(
        (imgFile) => imgFile === (controlValues?.renderConfig as AnaglyphRenderConfig)?.imgDataL,
      )
    ) {
      updatedConfig = { ...updatedConfig, imgDataL: fileList[0] };
    }

    // check right image is missing
    if (
      !fileList.find(
        (imgFile) => imgFile === (controlValues?.renderConfig as AnaglyphRenderConfig)?.imgDataR,
      )
    ) {
      updatedConfig = { ...updatedConfig, imgDataR: fileList[1] };
    }

    if (updatedConfig !== controlValues?.renderConfig) {
      updateControlValues({
        renderConfig: updatedConfig,
      });
    }
  }, [fileList]);

  const selectedIndexL = useMemo(() => getFileIndex('imgDataL'), [fileList, controlValues]);
  const selectedIndexR = useMemo(() => getFileIndex('imgDataR'), [fileList, controlValues]);

  if (items.length > 0) {
    return (
      <SelectorWrapper>
        <ImageDropdown
          disabled={!controlValues?.renderConfig}
          id="imgDataL"
          label="Left"
          items={items}
          selectedIndex={selectedIndexL}
          onClick={onClick}
        />
        <ImageDropdown
          disabled={!controlValues?.renderConfig}
          id="imgDataR"
          label="Right"
          items={items}
          selectedIndex={selectedIndexR}
          onClick={onClick}
        />
      </SelectorWrapper>
    );
  }

  return null;
};

export default ImageSelector;
