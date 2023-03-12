import { useContext, useState } from 'react';
import { Layout, Button, Popover, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PhotoUploader from '../photo-uploader';
import { AnaglyphTBContext, AnaglyphTBContextType } from '../../contexts/anaglyphToolboxContext';
import { LeftSection, RightSection, AppTitle, TagLine } from './styles';

const { Header: AntHeader } = Layout;

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
          content={<PhotoUploader fileList={fileList} setFileList={setFileList} close={close} />}
          title="Upload images for left and right eyes"
          trigger="click"
          open={open}
          onOpenChange={handleOpenChange}
          placement="topRight"
        >
          <Tooltip title="Upload left & right images" placement="bottomRight" mouseEnterDelay={1}>
            <Button type="primary" shape="round" size="small" icon={<UploadOutlined />}>
              Upload Photos
            </Button>
          </Tooltip>
        </Popover>
      </RightSection>
    </AntHeader>
  );
}
