import { createHashRouter, RouterProvider } from 'react-router-dom';
import AnaglyphMaker from '../pages/anaglyph-maker';
import Home from '../pages/home';
import { Routes } from './constants';
import CameraClient from '../pages/camera-client';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: Routes.ANAGLYPH_TOOLBOX,
    element: <AnaglyphMaker />,
  },
  {
    path: Routes.CAMERA_CLIENT_APP,
    element: <CameraClient />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
