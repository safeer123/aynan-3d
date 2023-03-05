import { useContext, useState } from 'react';
import {
  Layout, Button, Popover, Tooltip,
} from 'antd';
import styled from 'styled-components';
import { UploadOutlined } from '@ant-design/icons';
import PhotoUploader from '../photo-uploader';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';

const { Header: AntHeader } = Layout;

const LeftSection = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RightSection = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
`;

const AppTitle = styled.span`
  font-size: 24px;
  font-weight: 600;
  color: #323131;
  letter-spacing: 0.1cm;
`;

const TagLine = styled.span`
  font-size: 16px;
  color: #323131;
  letter-spacing: 0.05cm;
`;

export default function Header() {
  const { fileList, setFileList } = useContext(AnaglyphTBContext) as AnaglyphTBContextType;

  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <AntHeader>
      <LeftSection>
        <AppTitle>
          <i>
            <b>A</b>
            ynan
          </i>
        </AppTitle>
        <TagLine>3D content maker on the Web</TagLine>
      </LeftSection>
      <RightSection>
        <Popover
          content={(
            <PhotoUploader fileList={fileList} setFileList={setFileList} close={close} />
          )}
          title="Upload images for left and right eyes"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          placement="topRight"
        >
          <Tooltip title="Upload photos for left/right eyes" placement="bottomRight" mouseEnterDelay={1}>
            <Button type="primary" shape="round" size="small" icon={<UploadOutlined />}>
              Upload Photos
            </Button>
          </Tooltip>
        </Popover>
      </RightSection>
    </AntHeader>
  );
}
