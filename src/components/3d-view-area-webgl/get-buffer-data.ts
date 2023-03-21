const RECTANGLE_COUNT = 1;

export default (canvasWidth: number, canvasHeight: number) => {
  // we will create random rectangles
  // also we will add the texture coordinates to render a texture on them
  // texture coordinates goes from 0 to 1
  // (0,0) left top coord and (1,1) right bottom coord

  const positionTextureArray = [];
  let vertexCount = 0;
  const getRandomPos = () => [0.5 * canvasWidth, 0.5 * canvasHeight];
  const getRandomWidthHeight = () => [canvasWidth, canvasHeight];

  for (let i = 0; i < RECTANGLE_COUNT; i += 1) {
    const [x, y] = getRandomPos();
    const [w, h] = getRandomWidthHeight();

    positionTextureArray.push(
      // triangle 1
      x + 0.5 * w,
      y - h * 0.5,
      1,
      0, // top right
      x - 0.5 * w,
      y - h * 0.5,
      0,
      0, // top left
      x - 0.5 * w,
      y + h * 0.5,
      0,
      1, // bottom left

      // triangle 2
      x + 0.5 * w,
      y - h * 0.5,
      1,
      0, // top right
      x - 0.5 * w,
      y + h * 0.5,
      0,
      1, // bottom left
      x + 0.5 * w,
      y + h * 0.5,
      1,
      1, // bottom right
    );
    vertexCount += 6;
  }

  return {
    positionTextureArray,
    vertexCount,
  };
};
