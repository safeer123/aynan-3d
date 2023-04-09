import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const VideoItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: #555454;
  width: 100%;
  height: 260px;
  position: relative;
`;

const Title = styled.h5`
  position: absolute;
  top: 8px;
  right: 8px;
  color: #fff;
  font-weight: 400;
  text-shadow: 0px 2px 15px rgba(0, 0, 0, 0.99);
  margin-block-start: 8px;
  margin-block-end: 0;
  z-index: 2;
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default function MyVideo({ title, stream }: { title: string; stream?: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <VideoItem>
      <Title>{title}</Title>
      <StyledVideo
        className="video-ele"
        playsInline
        muted
        autoPlay
        ref={videoRef}
        width={200}
        height={300}
      />
    </VideoItem>
  );
}
