import { createShader, createProgram } from '../utils';
import { vertexShaderSource, fragmentShaderSource } from './shaders';
import getBufferData from '../get-buffer-data';

export default (gl: WebGLRenderingContext, image1: HTMLImageElement) => {
  /* -------------------- compile shader code ----------------------- */
  // create GLSL shaders,
  // upload the GLSL source,
  // compile the shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) return;

  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragmentShader);

  if (!program) return;

  /* -------------------- create vertex data and buffer ----------------------- */

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  // look up where the texture coordinates need to go.
  const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

  // look up for the resolution uniform
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_canvas_resolution');

  const imageUniformLocation = gl.getUniformLocation(program, 'u_image');

  // Create a buffer and put three 2d clip space points in it
  const positionTextureBuffer = gl.createBuffer();

  // gl is a state machine, at a time handles one array buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionTextureBuffer);

  // generate vertex and color data
  const { positionTextureArray, vertexCount } = getBufferData(gl.canvas.width, gl.canvas.height);
  // console.log(vertexCount, positionColorArray);

  // At this point we are creating a stream data, which resides in CPU
  // but owned by GPU and later it will be uploaded to GPU
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionTextureArray), gl.STATIC_DRAW);
  // gl.STATIC_DRAW --> "hey GPU we won't change this data frequently"
  // new Float32Array(positions) --> create float32bit array

  // upload the image data
  function addTexture(image: HTMLImageElement, textureUnit: number) {
    // Create a texture.
    const texture = gl.createTexture();

    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  function render() {
    /* ------------------------ render steps begin from here ---------------*/

    // Tell WebGL how to convert from clip space to pixels
    // x[-1,1], y[-1,1] clip space is mapped to this area of viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // canvas display size and canvas size in pixels are different
    /*
        canvas width/height props => canvas size in pixels (this is not display size)
        canvas css/style width/height => display size of the canvas on browser
        */

    // it is better to change canvas pixel size to match its display size
    // resizeCanvasToDisplaySize(gl.canvas);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0); // since alpha is 0, it is white
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Turn on the attributea
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(texCoordLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionTextureBuffer);

    // Tell the attribute how to get data out of positionTextureBuffer (ARRAY_BUFFER)
    // we are using vec4 in shader, but passing only 2 float values now
    // vec4 defaults to [0,0,0,1] now it will take [x,y,0,1]
    let size = 2; // 2 components per iteration
    let type = gl.FLOAT; // the data is 32bit floats
    let normalize = false; // don't normalize the data
    // stride = 0, is the special default case
    // which means move forward size * sizeof(type) each iteration
    // otherwise specify exact bytes to skip in each iteration
    let stride = (2 + 2) * 4;
    // to get the next position
    let offset = 0; // start at the beginning of the buffer
    // tell GPU, how to get a_position attribute values
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // tell GPU, how to get a_texCoord attribute values
    size = 2; // 2 components per iteration
    type = gl.FLOAT; // the data is 32bit floats
    normalize = false; // don't normalize the data
    // stride = 0, is the special default case
    // which means move forward size * sizeof(type) each iteration
    // otherwise specify exact bytes to skip in each iteration
    stride = (2 + 2) * 4;
    // to get the next position
    offset = 2 * 4; // start at the beginning of the buffer
    gl.vertexAttribPointer(texCoordLocation, size, type, normalize, stride, offset);

    // pass the texture unit 2
    gl.uniform1i(imageUniformLocation, 2);

    // draw, all of the vertices
    const primitiveType = gl.TRIANGLES;
    const offsetForDrawing = 0;
    const count = vertexCount;
    gl.drawArrays(primitiveType, offsetForDrawing, count);

    // textureSupportInfo(gl)
  }

  async function renderMain() {
    // bind 2 and 3 to textures
    addTexture(image1, 2);
    // addMyTexture(4);

    render();
  }

  renderMain();
};
