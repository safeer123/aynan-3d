import { createShader, createProgram } from '../utils';
import { vertexShaderSource, fragmentShaderSource } from './shaders';
import getBufferData from '../get-buffer-data';

class AnaglyphRenderer {
  program: WebGLProgram | null;

  positionAttributeLocation: number;

  texCoordLocation: number;

  resolutionUniformLocation: WebGLUniformLocation | null;

  deltaTextCoodUniformLocation: WebGLUniformLocation | null;

  imageUniformLocationLeft: WebGLUniformLocation | null;

  imageUniformLocationRight: WebGLUniformLocation | null;

  positionTextureBuffer: WebGLBuffer | null;

  vertexCount: number;

  texture1: WebGLTexture | null;

  texture2: WebGLTexture | null;

  canvasSizeSerialized: string;

  constructor() {
    this.program = null;
    this.positionAttributeLocation = -1;
    this.texCoordLocation = -1;
    this.resolutionUniformLocation = null;
    this.deltaTextCoodUniformLocation = null;
    this.imageUniformLocationLeft = null;
    this.imageUniformLocationRight = null;
    this.positionTextureBuffer = null;
    this.texture1 = null;
    this.texture2 = null;
    this.vertexCount = 0;
    this.canvasSizeSerialized = '';
  }

  setProgram(gl: WebGLRenderingContext) {
    /* -------------------- compile shader code ----------------------- */
    // create GLSL shaders,
    // upload the GLSL source,
    // compile the shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    // Link the two shaders into a program
    this.program = createProgram(gl, vertexShader, fragmentShader);
  }

  setupShader(gl: WebGLRenderingContext) {
    this.setProgram(gl);
    const { program } = this;
    if (!program) return;

    // look up where the vertex data needs to go.
    this.positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    // look up where the texture coordinates need to go.
    this.texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');

    // look up for the resolution uniform
    this.resolutionUniformLocation = gl.getUniformLocation(program, 'u_canvas_resolution');
    this.deltaTextCoodUniformLocation = gl.getUniformLocation(program, 'u_delta_texCoord');

    this.imageUniformLocationLeft = gl.getUniformLocation(program, 'u_image_left');
    this.imageUniformLocationRight = gl.getUniformLocation(program, 'u_image_right');
  }

  setupVertexBuffer(gl: WebGLRenderingContext) {
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

    this.positionTextureBuffer = positionTextureBuffer;
    this.vertexCount = vertexCount;
  }

  static initTexture(gl: WebGLRenderingContext, textureUnit: number) {
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because video has to be download over the internet
    // they might take a moment until it's ready so
    // put a single pixel in the texture so we can
    // use it immediately.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 0, 0]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel,
    );

    // Turn off mips and set wrapping to clamp to edge so it
    // will work regardless of the dimensions of the video.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    return texture;
  }

  static updateTexture(
    gl: WebGLRenderingContext,
    video: HTMLVideoElement,
    texture: WebGLTexture,
    textureUnit: number,
  ) {
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
  }

  render(
    gl: WebGLRenderingContext,
    deltaPos: number[],
    leftVideo?: HTMLVideoElement,
    rightVideo?: HTMLVideoElement,
  ) {
    if (!this.program) {
      this.setupShader(gl);
      this.texture1 = AnaglyphRenderer.initTexture(gl, 2);
      this.texture2 = AnaglyphRenderer.initTexture(gl, 3);
    }

    const canvasSizeSerialized = `${gl.canvas.width}|${gl.canvas.height}`;
    if (this.canvasSizeSerialized !== canvasSizeSerialized) {
      this.setupVertexBuffer(gl);
      this.canvasSizeSerialized = canvasSizeSerialized;
    }

    if (leftVideo && this.texture1) {
      AnaglyphRenderer.updateTexture(gl, leftVideo, this.texture1, 2);
    }
    if (rightVideo && this.texture2) {
      AnaglyphRenderer.updateTexture(gl, rightVideo, this.texture2, 3);
    }

    // Tell WebGL how to convert from clip space to pixels
    // x[-1,1], y[-1,1] clip space is mapped to this area of viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0); // since alpha is 0, it is white
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(this.program);

    // set the resolution
    gl.uniform2f(this.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(this.deltaTextCoodUniformLocation, deltaPos[0], deltaPos[1]);

    // Turn on the attributea
    gl.enableVertexAttribArray(this.positionAttributeLocation);
    gl.enableVertexAttribArray(this.texCoordLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionTextureBuffer);

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
    gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

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
    gl.vertexAttribPointer(this.texCoordLocation, size, type, normalize, stride, offset);

    // pass the texture unit 2
    gl.uniform1i(this.imageUniformLocationLeft, 2);
    gl.uniform1i(this.imageUniformLocationRight, 3);

    // draw, all of the vertices
    const primitiveType = gl.TRIANGLES;
    const offsetForDrawing = 0;
    gl.drawArrays(primitiveType, offsetForDrawing, this.vertexCount);
  }

  renderLight(gl: WebGLRenderingContext, deltaPos: number[]) {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0); // since alpha is 0, it is white
    gl.clear(gl.COLOR_BUFFER_BIT);

    // set the resolution
    gl.uniform2f(this.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform2f(this.deltaTextCoodUniformLocation, deltaPos[0], deltaPos[1]);

    // draw, all of the vertices
    const primitiveType = gl.TRIANGLES;
    const offsetForDrawing = 0;
    gl.drawArrays(primitiveType, offsetForDrawing, 6);
  }
}

export default new AnaglyphRenderer();
