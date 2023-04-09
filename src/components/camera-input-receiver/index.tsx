import { CodeLabelItem } from './styles';
import { useCameraStreamReceiver } from './use-camera-stream-receiver';

export default function CameraInputReceiver() {
  const { code, contextHolder } = useCameraStreamReceiver();

  if (!code) return null;

  return (
    <>
      {contextHolder}
      <CodeLabelItem>{code}</CodeLabelItem>
    </>
  );
}
