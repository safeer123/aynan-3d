import { Dropdown } from 'antd';
import styled from 'styled-components';

export const StyledThumb = styled.img`
  height: 50px;
`;

export const StyledOptionItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 12px;
  color: #5a5a5a;
`;

export const SelectorWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const StyledDropdown = styled(Dropdown)`
  .ant-dropdown-menu {
    max-height: 400px;
    overflow: auto;
  }
`;
