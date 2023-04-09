/* eslint-disable import/prefer-default-export */

export const Routes = {
  ANAGLYPH_TOOLBOX: '/anaglyph-toolbox/:mode?',
  CAMERA_CLIENT_APP: '/camera-client-app',
};

export enum Modes {
  SinglePhoto = 'single-photo',
  AnaglyphPhoto = 'anaglyph-photo',
  AnaglyphVideo = 'anaglyph-video',
}
