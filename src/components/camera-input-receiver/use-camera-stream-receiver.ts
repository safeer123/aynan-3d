import { useEffect, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { notification } from 'antd';
import { ConnectionState, ReceiverInputState, ReceiverName } from '../../types/video-render-types';
import openNotification from './video-notification';
import { useSetupVideo } from './use-setup-video';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { AnaglyphVideoRenderConfig, RenderType } from '../../types/render';

const WebSocketServer = process.env.REACT_APP_WEBSOCKET_SERVER || '';

if (!WebSocketServer) {
  throw Error('Environment variables are not set');
}

const socket = io(WebSocketServer);

// TODO: Move to utils
// generateId :: Integer -> String
function generateId(len: number) {
  // dec2hex :: Integer -> String
  // i.e. 0-255 -> '00'-'ff'
  const dec2hex = (dec: number) => dec.toString(16).padStart(2, '0');
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}
const code = generateId(4);

export const useCameraStreamReceiver = () => {
  const [me, setMe] = useState('');
  const [connections, setConnections] = useState<ConnectionState>({
    [ReceiverName.Left]: undefined,
    [ReceiverName.Right]: undefined,
  });
  const [api, contextHolder] = notification.useNotification();
  const { updateControlValues } = useContext(AnaglyphTBContext) as AnaglyphTBContextType;

  useSetupVideo(setConnections, connections[ReceiverName.Left]);
  useSetupVideo(setConnections, connections[ReceiverName.Right]);

  const updateRequests = (reqData: ReceiverInputState) => {
    setConnections((prevConn) => {
      prevConn[reqData.name] = reqData;
      return { ...prevConn };
    });
  };

  const acceptVideoInput = (reqData: ReceiverInputState) => {
    reqData.accepted = true;

    console.log('accepting video --> ', reqData);

    const peer = new Peer({
      initiator: false,
      trickle: false,
    });

    peer.on('signal', (signal) => {
      socket.emit('video-accepted', { signal, to: reqData.from });
    });

    peer.on('stream', (stream) => {
      console.log('receiving media stream --> ', stream);
      reqData.stream = stream;
      updateRequests(reqData);
      // peerVideoRef.current.srcObject = currentStream;
    });

    peer.signal(reqData.signalData);

    reqData.peer = peer;
    updateRequests(reqData);
  };

  useEffect(() => {
    updateControlValues({
      renderConfig: {
        type: RenderType.ANAGLYPH_FROM_CAMERA,
        leftVideo: connections[ReceiverName.Left]?.video,
        rightVideo: connections[ReceiverName.Right]?.video,
      } as AnaglyphVideoRenderConfig,
    });
  }, [connections[ReceiverName.Left]?.video, connections[ReceiverName.Right]?.video]);

  useEffect(() => {
    // publish this receiver's identity
    if (me) {
      socket.emit('publish-receiver', { id: me, code, name: ReceiverName.Left });
      socket.emit('publish-receiver', { id: me, code, name: ReceiverName.Right });
    }
  }, [me]);

  useEffect(() => {
    socket.on('me', (id) => setMe(id));

    socket.on('video-input', (data: ReceiverInputState) => {
      const reqData = { ...data, accepted: false };
      setConnections((prevConn) => {
        prevConn[data.name] = reqData;
        return { ...prevConn };
      });
      openNotification(
        api,
        reqData,
        () => acceptVideoInput(reqData),
        () => 1,
      );
    });

    return () => {
      socket.off('me');
      socket.off('video-input');
    };
  }, []);

  return {
    code,
    contextHolder,
  };
};
