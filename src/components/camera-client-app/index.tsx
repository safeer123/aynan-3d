import { Button } from 'antd';
import { useCameraClient } from './use-camera-client';
import { Wrapper, ItemWrapper, CodeWrapper } from './styles';
import { VideoInputStatus } from '../../types/video-render-types';

const BtnLabel = {
  [VideoInputStatus.Sending]: 'Sending...',
  [VideoInputStatus.Accepted]: 'Connected',
};

const DEFAULT_LABEL = 'Connect';

export default function CameraClientApp() {
  const { receivers, connect } = useCameraClient();

  return (
    <Wrapper>
      {receivers.map((rec) => (
        <ItemWrapper key={`${rec.code}~${rec.name}`}>
          <CodeWrapper>{rec.code}</CodeWrapper> {rec.name}{' '}
          <Button
            size="small"
            onClick={() => connect(rec)}
            disabled={[VideoInputStatus.Sending, VideoInputStatus.Accepted].includes(
              rec.status as VideoInputStatus,
            )}
          >
            {(rec.status && BtnLabel[rec.status]) || DEFAULT_LABEL}
          </Button>
        </ItemWrapper>
      ))}
    </Wrapper>
  );
}
