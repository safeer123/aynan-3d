import { Layout } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Routes } from '../../router/constants';

const links = [
  {
    id: 'anaglyph-3d-convert',
    title: 'Convert photos into an anaglyph 3d image',
    route: Routes.PHOTOS_TO_ANAGLYPH,
  },
];

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

export default function AnaglyphMaker() {
  return (
    <StyledLayout>
      <Wrapper>
        <ul>
          {links.map((link) => (
            <li key={link.id}>
              <Link to={link.route}>{link.title}</Link>
            </li>
          ))}
        </ul>
      </Wrapper>
    </StyledLayout>
  );
}
