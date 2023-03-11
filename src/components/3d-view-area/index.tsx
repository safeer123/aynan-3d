import { useRef, useEffect, useState, useLayoutEffect, useContext } from 'react';
import { Image as Img } from 'image-js';
import { debounce } from 'lodash';
import { Spin } from 'antd';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import {
  AnaglyphRenderConfig,
  RenderConfig,
  RenderType,
  SingleRenderConfig,
} from '../../types/render';
import { StyledCanvas, ViewAreaWrapper, SpinnerWrapper } from './styles';

type Dimensions = {
  width: number;
  height: number;
};

function useDimensions(): [React.RefObject<HTMLDivElement | undefined>, Dimensions] {
  const ref = useRef<HTMLDivElement>();
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateResize = () => {
      setDimensions(ref?.current?.getBoundingClientRect()?.toJSON());
    };

    updateResize();
    window.addEventListener('resize', updateResize);

    return () => {
      window.removeEventListener('resize', updateResize);
    };
  }, [ref.current]);

  return [ref, dimensions];
}

function Main3dArea() {
  const { fileList, controlValues, canvasRef } = useContext(
    AnaglyphTBContext,
  ) as AnaglyphTBContextType;

  const [images, setImages] = useState<string[]>([]);

  const [renderConfig, setRenderConfig] = useState<RenderConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const [wrapperRef, dimensions] = useDimensions();

  const updateCanvasSize = (imgWidth: number, imgHeight: number, canvas: HTMLCanvasElement) => {
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

  const drawImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    clear(ctx);
    updateCanvasSize(img.naturalWidth, img.naturalHeight, ctx.canvas);
    ctx.drawImage(img, 0, 0);
    ctx.fill();
  };

  const drawSingleImg = async (ctx: CanvasRenderingContext2D, renderConf: SingleRenderConfig) => {
    setLoading(true);
    const img = await loadImageFromData(renderConf?.img);

    // Draw the final image on the canvas
    clear(ctx);
    updateCanvasSize(img.naturalWidth, img.naturalHeight, ctx.canvas);
    ctx.drawImage(img, 0, 0);
    ctx.fill();
    setLoading(false);
  };

  const drawAnaglyph2 = async (
    ctx: CanvasRenderingContext2D,
    renderConf: AnaglyphRenderConfig,
  ): Promise<void> => {
    setLoading(true);
    const {
      imgL,
      imgR,
      controlValues: { deltaX, deltaY },
    } = renderConf;
    const imgObjL = await Img.load(imgL);

    const imageR = await loadImageFromData(imgR);

    const newCanvas = document.createElement('canvas');
    const ctxTemp = newCanvas.getContext('2d');
    updateCanvasSize(imageR.naturalWidth, imageR.naturalHeight, newCanvas);
    if (ctxTemp) {
      clear(ctxTemp);
      ctxTemp.drawImage(
        imageR,
        (deltaX / 100) * imageR.naturalWidth,
        (deltaY / 100) * imageR.naturalHeight,
      );
      ctxTemp.fill();
    }

    const imgObjR = await Img.fromCanvas(newCanvas);

    const imgObj1 = imgObjL.multiply(0.001, { channels: [1, 2] });
    const imgObj2 = imgObjR.multiply(0.001, { channels: [0] }).setChannel(0, imgObj1.getChannel(0));

    const img = await toHTMLImage(imgObj2);

    // Draw the final image on the canvas
    drawImage(ctx, img);
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

  useEffect(() => {
    setImages(fileList.map((f) => f.preview || ''));
  }, [fileList]);

  const debouncedUpdateRenderConfig = useRef(
    debounce((images, controlValues) => {
      if (images.length === 1) {
        setRenderConfig({
          type: RenderType.SINGLE,
          img: images?.[0],
        });
      } else if (images.length >= 2) {
        setRenderConfig({
          type: RenderType.ANAGLYPH,
          imgL: images?.[0],
          imgR: images?.[1],
          controlValues,
        });
      } else {
        setRenderConfig(null);
      }
    }, 500),
  ).current;

  useEffect(
    () => debouncedUpdateRenderConfig(images, controlValues),
    [images, controlValues, dimensions],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    if (!renderConfig) {
      clear(context);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (renderConfig.type === RenderType.SINGLE) {
        drawSingleImg(context, renderConfig as SingleRenderConfig);
      }
      if (renderConfig.type === RenderType.ANAGLYPH) {
        drawAnaglyph2(context, renderConfig as AnaglyphRenderConfig);
      }
    }, 10);
  }, [renderConfig]);

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
