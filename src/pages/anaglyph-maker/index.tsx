import { Layout } from 'antd';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
// Old View Area component. We can remove this if not needed anymore
// import Main3dArea from '../../components/3d-view-area';
import Main3dAreaWG from '../../components/3d-view-area-webgl';
import Controls from '../../components/controls';
import Header from '../../components/header';
import AnaglyphTBProvider from '../../contexts/anaglyphToolboxContext';
import { Modes } from '../../router/constants';
import VideoRenderArea from '../../components/video-render-area-webgl';

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

export default function AnaglyphMaker() {
  const { mode } = useParams();

  let renderAreaComponent = null;
  if ([Modes.SinglePhoto, Modes.AnaglyphPhoto].includes(mode as Modes)) {
    renderAreaComponent = <Main3dAreaWG />;
  } else if (mode === Modes.AnaglyphVideo) {
    renderAreaComponent = <VideoRenderArea />;
  }

  return (
    <AnaglyphTBProvider>
      <StyledLayout>
        <Header />
        <Content>
          {renderAreaComponent}
          <Controls />
        </Content>
      </StyledLayout>
    </AnaglyphTBProvider>
  );
}
