import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { mobileModel, osName, browserName } from 'react-device-detect';
import Peer from 'simple-peer';
import { Receiver, VideoInputStatus } from '../../types/video-render-types';

const deviceInfo = {
  osName,
  mobileModel,
  browserName,
};

const WebSocketServer = process.env.REACT_APP_WEBSOCKET_SERVER || '';

if (!WebSocketServer) {
  throw Error('Environment variables are not set');
}

const socket = io(WebSocketServer);

export const useCameraClient = () => {
  const [me, setMe] = useState('');
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [stream, setStream] = useState<MediaStream>();
  const connectionRef = useRef<Peer.Instance | null>(null);

  const connect = (receiver: Receiver) => {
    // connect to a receiver

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    // eslint-disable-next-line no-console
    peer.on('error', (err) => console.error('error', err));

    peer.on('signal', (signalData) => {
      console.log('Sending signal', signalData, receiver);
      socket.emit('video-input', { ...receiver, signalData, from: me, deviceInfo });
    });

    socket.off('video-accepted');
    socket.on('video-accepted', (signal) => {
      peer.signal(signal);
      // console.log('callAccepted', user);
      receiver.status = VideoInputStatus.Accepted;
      setReceivers((prevReceivers) =>
        prevReceivers.map((r) => {
          if (r === receiver) {
            return receiver;
          }
          return r;
        }),
      );
    });

    connectionRef.current = peer;
    receiver.status = VideoInputStatus.Sending;
    setReceivers((prevReceivers) =>
      prevReceivers.map((r) => {
        if (r === receiver) {
          return receiver;
        }
        return r;
      }),
    );
  };

  useEffect(() => {
    // Enumerate the devices
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      if (videoDevices.length > 1) {
        // alert(JSON.stringify(videoDevices));
      }
      // alert(JSON.stringify(devices.filter((d) => d.kind === "videoinput")));
      // const filtered = devices.filter(device => device.kind === type);
      // callback(filtered);
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
    });

    socket.on('me', (id) => setMe(id));

    socket.on('receivers', (receiverClients) => setReceivers(receiverClients));

    return () => {
      socket.off('me');
      socket.off('receivers');
    };
  }, []);

  return {
    receivers,
    connect,
  };
};
