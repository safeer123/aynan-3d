export function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    // issues with the shader code, log and clean up
    // console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  return null;
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram | null {
  const program = gl.createProgram();
  if (program) {
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
    // console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  return null;
}
