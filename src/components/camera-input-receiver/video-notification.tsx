import { Button, Space } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';
import { ReceiverInputState } from '../../types/video-render-types';

const openNotification = (
  api: NotificationInstance,
  req: ReceiverInputState,
  accept: () => void,
  reject: () => void,
) => {
  const key = `open${Date.now()}`;
  const btn = (
    <Space>
      <Button
        danger
        type="primary"
        size="small"
        onClick={() => {
          reject();
          api.destroy(key);
        }}
      >
        Reject
      </Button>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          accept();
          api.destroy(key);
        }}
      >
        Accept
      </Button>
    </Space>
  );
  api.open({
    message: 'Incoming video',
    description: (
      <span>
        <b>{req?.deviceInfo?.mobileModel}</b>
        {' is sending a video...'}
      </span>
    ),
    btn,
    key,
    onClose: reject,
    duration: 0,
  });
};

export default openNotification;
