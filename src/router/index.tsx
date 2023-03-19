import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AnaglyphMaker from '../pages/anaglyph-maker';
import Home from '../pages/home';
import { Routes } from './constants';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: Routes.PHOTOS_TO_ANAGLYPH,
    element: <AnaglyphMaker />,
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
