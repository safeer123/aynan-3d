import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { Wrapper, HeaderSection, FooterSection, ContentSection } from './styles';

type Props = {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  close: () => void;
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const PhotoUploader: React.FC<Props> = ({ fileList, setFileList, close }) => {
  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    for (let i = 0; i < newFileList.length; i += 1) {
      const file = newFileList[i];
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
    }
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Wrapper>
      <HeaderSection>
        <Button shape="round" size="small" onClick={() => setFileList([])}>
          Clear All
        </Button>
      </HeaderSection>
      <ContentSection>
        <Upload
          multiple
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={() => false}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </ContentSection>
      <FooterSection>
        <Button shape="round" size="small" type="primary" onClick={close}>
          Done
        </Button>
      </FooterSection>
    </Wrapper>
  );
};

export default PhotoUploader;
