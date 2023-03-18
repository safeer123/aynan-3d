import { useRef, useEffect, useState, useContext } from 'react';
import { Image as Img } from 'image-js';
import { debounce } from 'lodash';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { AnaglyphRenderConfig, RenderType, SingleRenderConfig } from '../../types/render';
import { StyledCanvas, ViewAreaWrapper, SpinnerWrapper } from './styles';
import { ControlValues } from '../../types/controls';
import useDimensions, { Dimensions } from '../../utils/use-dimensions';

function Main3dArea() {
  const { controlValues, canvasRef } = useContext(AnaglyphTBContext) as AnaglyphTBContextType;

  const [loading, setLoading] = useState(false);

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
      canvas.style.height = `${width / arImg}px`;
    } else {
      // fit height as of the wrapper
      canvas.style.height = `${height}px`;
      canvas.style.width = `${height * arImg}px`;
    }
  };

  const toHTMLImage = async (img: Img): Promise<HTMLImageElement> => {
    const imgHTML = new Image();
    imgHTML.src = img.toDataURL();
    return new Promise((res) => {
      imgHTML.onload = () => {
        res(imgHTML);
      };
    });
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

  const clear = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawImageMeta = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, txt: string) => {
    const [width, height] = [img.naturalWidth, img.naturalHeight];
    // Shadow, color and font
    ctx.shadowColor = '#0b194b';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#fff';
    ctx.font = '3.0em Arial';
    ctx.fillText(txt, width - ctx.measureText(txt).width - 20, height - 20);
  };

  const drawImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    dimensions: Dimensions,
    txt?: string,
  ) => {
    clear(ctx);
    updateCanvasSize(ctx.canvas, img.naturalWidth, img.naturalHeight, dimensions);
    ctx.drawImage(img, 0, 0);
    if (txt) {
      drawImageMeta(ctx, img, txt);
    }
    ctx.fill();
  };

  const drawSingleImg = async (
    ctx: CanvasRenderingContext2D,
    controlValues: ControlValues,
    dimensions: Dimensions,
  ) => {
    setLoading(true);

    const renderConfig = controlValues.renderConfig as SingleRenderConfig;

    if (!renderConfig?.imgData) {
      setLoading(false);
      return;
    }
    const img = await loadImageFromData(renderConfig?.imgData?.preview || '');
    const dateModified = renderConfig?.imgData?.lastModified
      ? dayjs(renderConfig?.imgData?.lastModified).format('D MMM, YYYY')
      : '';
    // Draw the final image
    drawImage(ctx, img, dimensions, dateModified);
    setLoading(false);
  };

  const drawAnaglyph2 = async (
    ctx: CanvasRenderingContext2D,
    controlValues: ControlValues,
    dimensions: Dimensions,
  ): Promise<void> => {
    setLoading(true);

    const { deltaX, deltaY } = controlValues;
    const { imgDataL, imgDataR } = controlValues.renderConfig as AnaglyphRenderConfig;

    const imgObjL = await Img.load(imgDataL?.preview || '');

    const imageR = await loadImageFromData(imgDataR?.preview || '');

    const newCanvas = document.createElement('canvas');
    const ctxTemp = newCanvas.getContext('2d');
    updateCanvasSize(newCanvas, imageR.naturalWidth, imageR.naturalHeight, dimensions);
    if (ctxTemp) {
      clear(ctxTemp);
      ctxTemp.drawImage(
        imageR,
        ((deltaX || 0) / 100) * imageR.naturalWidth,
        ((deltaY || 0) / 100) * imageR.naturalHeight,
      );
      ctxTemp.fill();
    }

    const imgObjR = await Img.fromCanvas(newCanvas);

    const imgObj1 = imgObjL.multiply(0.001, { channels: [1, 2] });
    const imgObj2 = imgObjR.multiply(0.001, { channels: [0] }).setChannel(0, imgObj1.getChannel(0));

    const img = await toHTMLImage(imgObj2);

    const dateModified = imgDataL?.lastModified
      ? dayjs(imgDataL?.lastModified).format('D MMM, YYYY')
      : '';
    // Draw the final image
    drawImage(ctx, img, dimensions, dateModified);
    setLoading(false);
  };

  //   useEffect(() => {
  //     const canvas = canvasRef.current;
  //     const context = canvas.getContext('2d');
  //     let frameCount = 0;
  //     let animationFrameId: number;
  //     const render = () => {
  //       frameCount++;
  //       draw(context, frameCount, fileList);
  //       // animationFrameId = window.requestAnimationFrame(render);
  //     };
  //     render();
  //     return () => {
  //       window.cancelAnimationFrame(animationFrameId);
  //     };
  //   }, [fileList]);

  const debouncedRender = useRef(
    debounce((controlValues, dimensions) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      const { renderConfig } = controlValues;

      if (!renderConfig) {
        clear(context);
        return;
      }

      setLoading(true);
      setTimeout(() => {
        if (renderConfig.type === RenderType.SINGLE) {
          drawSingleImg(context, controlValues, dimensions);
        }
        if (renderConfig.type === RenderType.ANAGLYPH) {
          drawAnaglyph2(context, controlValues, dimensions);
        }
      }, 10);
    }, 500),
  ).current;

  useEffect(() => debouncedRender(controlValues, dimensions), [controlValues, dimensions]);

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
