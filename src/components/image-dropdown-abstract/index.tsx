import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, MenuProps, Space } from 'antd';
import Styles from './styles';

type ImageDropdownProps = {
  items: MenuProps['items'];
  selectedIndex: number | undefined;
  onClick: (id: string, key: string) => void;
  id: string;
  disabled?: boolean;
  label: string;
};

const ImageDropdown: React.FC<ImageDropdownProps> = ({
  items,
  selectedIndex,
  onClick,
  id,
  disabled,
  label,
}) => (
  <Styles.StyledDropdown
    disabled={disabled}
    trigger={['click']}
    menu={{
      items,
      selectable: true,
      selectedKeys: Number.isFinite(selectedIndex) ? [`${selectedIndex}`] : [],
      onClick: ({ key }) => onClick(id, key),
    }}
  >
    <Space>
      {!disabled && (
        <Button
          disabled={disabled}
          shape="round"
          size="small"
          type="default"
          icon={<DownOutlined />}
        >
          {label}
        </Button>
      )}
    </Space>
  </Styles.StyledDropdown>
);

export default ImageDropdown;
