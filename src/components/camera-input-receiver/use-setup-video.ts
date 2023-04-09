import { useEffect } from 'react';
import { ConnectionState, ReceiverInputState } from '../../types/video-render-types';

export const useSetupVideo = (
  setConnections: React.Dispatch<React.SetStateAction<ConnectionState>>,
  receiverState?: ReceiverInputState,
) => {
  const setupVideoInput = async (stream: MediaStream) => {
    if (!receiverState) return;
    console.log('video setup started --> ', receiverState);
    const { name } = receiverState;
    const video = document.createElement('video');
    setConnections((prevConn) => {
      if (prevConn[name]) {
        (prevConn[name] as ReceiverInputState).video = undefined;
      }
      return { ...prevConn };
    });

    let playing = false;
    let timeupdate = false;

    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;

    function checkReady() {
      if (playing && timeupdate && !receiverState?.video) {
        setConnections((prevConn) => {
          if (prevConn[name]) {
            (prevConn[name] as ReceiverInputState).video = video;
          }
          console.log('video setup completed --> ', receiverState);
          return { ...prevConn };
        });
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

    video.srcObject = stream;
    video.play();
  };

  useEffect(() => {
    if (receiverState?.stream) {
      setupVideoInput(receiverState?.stream);
    }
  }, [receiverState?.stream]);

  // console.log('receiverState --> ', receiverState);
};
