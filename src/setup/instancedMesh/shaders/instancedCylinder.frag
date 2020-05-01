precision highp float;
varying vec3 vColor;
void main() {
  vec4 color = vec4(vColor, 1.0);
  /* color.r += sin( vPosition.x * 10.0 + time ) * 0.5; */
  gl_FragColor = color;
}

