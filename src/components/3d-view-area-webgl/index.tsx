import { useRef, useEffect, useState, useContext } from 'react';
import { debounce } from 'lodash';
import { Spin } from 'antd';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { AnaglyphRenderConfig, RenderType, SingleRenderConfig } from '../../types/render';
import { StyledCanvas, ViewAreaWrapper, SpinnerWrapper } from './styles';
import { ControlValues } from '../../types/controls';
import useDimensions, { Dimensions } from '../../utils/use-dimensions';
import imageTextureRenderSingle from './image-texture-render-single';
import AnaglyphRenderer from './image-texture-render-anaglyph';

function Main3dArea() {
  const { controlValues, canvasRef } = useContext(AnaglyphTBContext) as AnaglyphTBContextType;

  const [loading, setLoading] = useState(false);
  const [renderKey, setRenderKey] = useState('');

  const [wrapperRef, dimensions] = useDimensions();

  const updateCanvasSize = (
    canvas: HTMLCanvasElement,
    imgWidth: number,
    imgHeight: number,
    dimensions: Dimensions,
  ) => {
    canvas.width = imgWidth;
    canvas.height = imgHeight;
    const arImg = imgWidth / imgHeight;
    const { width, height } = dimensions;
    if (!width || !height) return;
    const arWrapper = width / height;
    if (arImg > arWrapper) {
      // fit width as of the wrapper
      canvas.style.width = `${width}px`;
      canvas.style.height = `${Math.floor(width / arImg)}px`;
    } else {
      // fit height as of the wrapper
      canvas.style.height = `${height - 3}px`; // fix: subtract 3 to avoid a vertical scroll
      canvas.style.width = `${Math.floor(height * arImg)}px`;
    }
  };

  const loadImageFromData = async (imgData: string): Promise<HTMLImageElement> => {
    const img = new Image();
    img.src = imgData;
    return new Promise((res) => {
      img.onload = () => {
        res(img);
      };
    });
  };

  const clear = (gl: WebGLRenderingContext) => {
    gl.clearColor(0, 0, 0, 0); // since alpha is 0, it is white
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const drawSingleImg = async (
    gl: WebGLRenderingContext,
    controlValues: ControlValues,
    dimensions: Dimensions,
  ) => {
    setLoading(true);
    setRenderKey('');

    const renderConfig = controlValues.renderConfig as SingleRenderConfig;

    if (!renderConfig?.imgData) {
      setLoading(false);
      return;
    }
    const img = await loadImageFromData(renderConfig?.imgData?.preview || '');
    // const dateModified = renderConfig?.imgData?.lastModified
    //   ? dayjs(renderConfig?.imgData?.lastModified).format('D MMM, YYYY')
    //   : '';
    // Draw the final image
    updateCanvasSize(
      gl.canvas as HTMLCanvasElement,
      img.naturalWidth,
      img.naturalHeight,
      dimensions,
    );
    imageTextureRenderSingle(gl, img);
    setLoading(false);
  };

  const drawAnaglyph2 = async (
    gl: WebGLRenderingContext,
    controlValues: ControlValues,
    dimensions: Dimensions,
    renderKey: string,
    suppressLoadingIndicator?: boolean,
  ): Promise<void> => {
    if (!suppressLoadingIndicator) {
      setLoading(true);
    }

    const { deltaX, deltaY } = controlValues;
    const { imgDataL, imgDataR } = controlValues.renderConfig as AnaglyphRenderConfig;

    const newKey = `${dimensions.width}:${dimensions.height}-${imgDataL.name}:${imgDataL.lastModified}-${imgDataR.name}:${imgDataR.lastModified}`;
    if (renderKey !== newKey) {
      const imageL = await loadImageFromData(imgDataL?.preview || '');

      const imageR = await loadImageFromData(imgDataR?.preview || '');

      // const dateModified = imgDataL?.lastModified
      //   ? dayjs(imgDataL?.lastModified).format('D MMM, YYYY')
      //   : '';
      // Draw the final image
      updateCanvasSize(
        gl.canvas as HTMLCanvasElement,
        imageL.naturalWidth,
        imageL.naturalHeight,
        dimensions,
      );
      AnaglyphRenderer.render(gl, [(deltaX || 0) / 100, (deltaY || 0) / 100], imageL, imageR);
      setRenderKey(newKey);
    } else {
      AnaglyphRenderer.renderLight(gl, [(deltaX || 0) / 100, (deltaY || 0) / 100]);
    }
    if (!suppressLoadingIndicator) {
      setLoading(false);
    }
  };

  const render = (
    controlValues: ControlValues,
    dimensions: Dimensions,
    renderKey: string,
    suppressLoadingIndicator?: boolean,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

    if (!gl) return;

    const { renderConfig } = controlValues;

    if (!renderConfig) {
      clear(gl);
      return;
    }

    setTimeout(() => {
      if (renderConfig.type === RenderType.SINGLE) {
        drawSingleImg(gl, controlValues, dimensions);
      }
      if (renderConfig.type === RenderType.ANAGLYPH_FROM_PHOTOS) {
        drawAnaglyph2(gl, controlValues, dimensions, renderKey, suppressLoadingIndicator);
      }
    }, 10);
  };

  const debouncedRender = useRef(debounce(render, 200)).current;

  useEffect(() => debouncedRender(controlValues, dimensions, renderKey), [dimensions, renderKey]);

  useEffect(() => render(controlValues, dimensions, renderKey, true), [controlValues]);

  return (
    <ViewAreaWrapper ref={wrapperRef as React.RefObject<HTMLDivElement>}>
      <StyledCanvas ref={canvasRef} />
      {loading && (
        <SpinnerWrapper>
          <Spin size="large" />
        </SpinnerWrapper>
      )}
    </ViewAreaWrapper>
  );
}
export default Main3dArea;
