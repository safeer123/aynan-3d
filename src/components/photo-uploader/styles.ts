import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 456px;
  height: 360px;
`;

export const HeaderSection = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const FooterSection = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 0px;
`;

export const ContentSection = styled.div`
  height: calc(100% - 80px);
  overflow-y: auto;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 8px;
  box-sizing: border-box;
`;
