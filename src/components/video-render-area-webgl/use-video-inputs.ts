import { useContext, useEffect, useState } from 'react';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { AnaglyphVideoRenderConfig, RenderType } from '../../types/render';

export const useVideoInputs = () => {
  const [videoReady, setVideoReady] = useState(false);
  const [leftVideo, setLeftVideo] = useState<HTMLVideoElement | undefined>();
  const [rightVideo, setRightVideo] = useState<HTMLVideoElement | undefined>();
  const { updateControlValues } = useContext(AnaglyphTBContext) as AnaglyphTBContextType;

  const setupCameraInput = async () => {
    const video = document.createElement('video');
    setVideoReady(false);

    let playing = false;
    let timeupdate = false;

    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;

    function checkReady() {
      if (playing && timeupdate) {
        setVideoReady(true);
      }
    }

    // Waiting for these 2 events ensures
    // there is data in the video

    video.addEventListener(
      'playing',
      () => {
        playing = true;
        checkReady();
      },
      true,
    );

    video.addEventListener(
      'timeupdate',
      () => {
        timeupdate = true;
        checkReady();
      },
      true,
    );

    const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    video.srcObject = videoStream;
    video.play();

    return video;
  };

  const setupVideos = async () => {
    const video = await setupCameraInput();
    setLeftVideo(video);
    setRightVideo(video);
  };

  useEffect(() => {
    setupVideos();
  }, []);

  useEffect(() => {
    if (videoReady) {
      updateControlValues({
        renderConfig: {
          type: RenderType.ANAGLYPH_FROM_CAMERA,
          leftVideo: videoReady ? leftVideo : undefined,
          rightVideo: videoReady ? rightVideo : undefined,
        } as AnaglyphVideoRenderConfig,
      });
    }
  }, [videoReady, leftVideo, rightVideo]);

  return {
    leftVideo: videoReady ? leftVideo : undefined,
    rightVideo: videoReady ? rightVideo : undefined,
  };
};
