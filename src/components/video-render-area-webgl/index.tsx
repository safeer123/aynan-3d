import { useRef, useEffect, useContext } from 'react';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { StyledCanvas, ViewAreaWrapper } from './styles';
import { ControlValues } from '../../types/controls';
import useDimensions, { Dimensions } from '../../utils/use-dimensions';
import AnaglyphRenderer from './video-texture-render-anaglyph';
// import { useVideoInputs } from './use-video-inputs';
import { AnaglyphVideoRenderConfig } from '../../types/render';

interface VideoRenderParams {
  gl?: WebGLRenderingContext;
  controlValues?: ControlValues;
  dimensions?: Dimensions;
  leftVideo?: HTMLVideoElement;
  rightVideo?: HTMLVideoElement;
}

function Main3dArea() {
  const { controlValues, canvasRef } = useContext(AnaglyphTBContext) as AnaglyphTBContextType;

  const renderConfig = controlValues?.renderConfig as AnaglyphVideoRenderConfig;
  const { videoWidth, videoHeight } = renderConfig?.leftVideo || {};

  const [wrapperRef, dimensions] = useDimensions();

  // useVideoInputs();

  const renderParamsRef = useRef<VideoRenderParams>({});

  const updateCanvasSize = (
    canvas: HTMLCanvasElement,
    imgWidth: number,
    imgHeight: number,
    dimensions: Dimensions,
  ) => {
    const arImg = imgWidth / imgHeight;
    const { width, height } = dimensions;
    if (!width || !height) return;
    const arWrapper = width / height;
    let displayWidth = '';
    let displayHeight = '';
    if (arImg > arWrapper) {
      // fit width as of the wrapper
      displayWidth = '100%';
      displayHeight = `${Math.floor((100 * width) / arImg / height)}%`;
    } else {
      // fit height as of the wrapper
      displayHeight = '100%'; // fix: subtract 3 to avoid a vertical scroll
      displayWidth = `${Math.floor((100 * height * arImg) / width)}%`;
    }

    if (canvas.style.width !== displayWidth) {
      // console.log('Updaing canvas width --> ', displayWidth);
      canvas.style.width = displayWidth;
    }
    if (canvas.style.height !== displayHeight) {
      // console.log('Updaing canvas height --> ', displayHeight);
      canvas.style.height = displayHeight;
    }
  };

  const drawVideoFrame = (renderParams: VideoRenderParams) => {
    const { gl, controlValues, dimensions, leftVideo, rightVideo } = renderParams;

    if (!gl || !dimensions) return;

    const { deltaX, deltaY } = controlValues || {};
    const deltaPos = [(deltaX || 0) / 100, (deltaY || 0) / 100];
    AnaglyphRenderer.render(gl, deltaPos, leftVideo, rightVideo);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) || undefined;

    const params = renderParamsRef.current;
    params.gl = gl;
    params.controlValues = controlValues;
    params.dimensions = dimensions;
    params.leftVideo = renderConfig?.leftVideo;
    params.rightVideo = renderConfig?.rightVideo;
  }, [controlValues, dimensions, canvasRef, renderParamsRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    updateCanvasSize(canvas, videoWidth || 1, videoHeight || 1, dimensions);
  }, [videoWidth, videoHeight, dimensions]);

  useEffect(() => {
    if (!renderParamsRef.current?.gl) return () => 1;

    let id: number;
    const step = () => {
      drawVideoFrame(renderParamsRef.current);
      id = requestAnimationFrame(step);
    };
    step();
    return () => {
      cancelAnimationFrame(id);
    };
  }, [renderParamsRef]);

  return (
    <ViewAreaWrapper ref={wrapperRef as React.RefObject<HTMLDivElement>}>
      <StyledCanvas ref={canvasRef} width={videoWidth || 640} height={videoHeight || 480} />
    </ViewAreaWrapper>
  );
}
export default Main3dArea;
