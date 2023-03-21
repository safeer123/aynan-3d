export const vertexShaderSource = `

// introduce texture coordinates
// this goes from 0 to 1, indicating a point on the texture image/data
// each vertex can have a texture coordinate like (0.3, 0.5)
// that can pick a color from the texture data
attribute vec2 a_texCoord;

// We would need this varying vec2 to pass this coordinate to fragment shader
// so that each pixel can take an interpolated value of the 
// texture coordinate, and get the color value from a "Sampler2D"
varying vec2 v_texCoord;


// an attribute will receive data from a buffer
// we expect the position coordinates in canvas pixels
attribute vec2 a_position;

// works like a global variable
uniform vec2 u_canvas_resolution;

// all shaders have a main function
void main() {

  // 0 to 1
  vec2 normalizedPos = a_position / u_canvas_resolution;

  // to clip space: -1 to 1
  // we can invert the y coordinate as we use on the web canvas
  normalizedPos = (normalizedPos * 2.0 - 1.0) * vec2(1, -1);

  // gl_Position is a special variable in vertex shader
  // This must be set by this function
  gl_Position = vec4(normalizedPos, 0, 1);

  // pass texture coord to fragment shader
  v_texCoord = a_texCoord;
}

`;

export const fragmentShaderSource = `

// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

// our texture data (mostly 2D image data or other 2D data)
uniform sampler2D u_image_left;
uniform sampler2D u_image_right;

uniform vec2 u_delta_texCoord;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {

  // Get the final color for anaglyph
  gl_FragColor = vec4(
    texture2D(u_image_left, v_texCoord).r,
    texture2D(u_image_right, v_texCoord + u_delta_texCoord).gb,
    1
  ); 
}

`;
