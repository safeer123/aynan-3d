import { Layout } from 'antd';
import styled from 'styled-components';
import CameraClientApp from '../../components/camera-client-app';

const StyledLayout = styled(Layout)`
  height: 100vh;
  display: flex;
  justify-content: center;
  padding: 64px;
  background-color: #f1f8f8;
  cursor: default;
`;

const Wrapper = styled.div`
  padding-left: 0px;
  border-left: 20px solid #777;
`;

export default function CameraClient() {
  return (
    <StyledLayout>
      <Wrapper>
        <CameraClientApp />
      </Wrapper>
    </StyledLayout>
  );
}
