import { Layout } from 'antd';
import styled from 'styled-components';
import Main3dArea from '../../components/3d-view-area';
import Main3dAreaWG from '../../components/3d-view-area-webgl';
import Controls from '../../components/controls';
import Header from '../../components/header';
import AnaglyphTBProvider from '../../contexts/anaglyphToolboxContext';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  height: 100vh;

  .ant-layout-header {
    height: 36px;
    background-color: #ececec;
    color: #072f47;
    display: flex;
    padding-inline: 36px;
  }

  .ant-layout-content {
    height: calc(100% - 36px);
    background-color: #072f47;
    color: #ececec;
    position: relative;
  }
`;

type Props = {
  webgl?: boolean;
};

export default function AnaglyphMaker({ webgl }: Props) {
  return (
    <AnaglyphTBProvider>
      <StyledLayout>
        <Header />
        <Content>
          {webgl ? <Main3dAreaWG /> : <Main3dArea />}
          <Controls />
        </Content>
      </StyledLayout>
    </AnaglyphTBProvider>
  );
}
