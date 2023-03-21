import { createHashRouter, RouterProvider } from 'react-router-dom';
import AnaglyphMaker from '../pages/anaglyph-maker';
import Home from '../pages/home';
import { Routes } from './constants';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: Routes.PHOTOS_TO_ANAGLYPH,
    element: <AnaglyphMaker />,
  },
  {
    path: Routes.PHOTOS_TO_ANAGLYPH_WG,
    element: <AnaglyphMaker webgl />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
