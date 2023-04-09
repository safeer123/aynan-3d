import { CodeLabelItem } from './styles';
import { useCameraStreamReceiver } from './use-camera-stream-receiver';

export default function CameraInputReceiver() {
  const { code, contextHolder } = useCameraStreamReceiver();

  return (
    code && (
      <>
        {contextHolder}
        <CodeLabelItem>{code}</CodeLabelItem>
      </>
    )
  );
}
