import Peer from 'simple-peer';

export interface Receiver {
  id: string;
  code: string;
  name: ReceiverName;
  status?: VideoInputStatus;
}

export interface ReceiverInputState extends Receiver {
  signalData: Peer.SignalData;
  from: string;
  deviceInfo: DeviceInfo;
  accepted?: boolean;
  peer?: Peer.Instance;
  stream?: MediaStream;
  video?: HTMLVideoElement;
}

export enum VideoInputStatus {
  Sending = 'SENDING',
  Accepted = 'ACCEPTED',
}

export enum ReceiverName {
  Left = 'LEFT',
  Right = 'RIGHT',
}

export type ConnectionState = {
  [key in ReceiverName]?: ReceiverInputState;
};

export type DeviceInfo = {
  osName: string;
  mobileModel: string;
  browserName: string;
};
