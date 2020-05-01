precision highp float;

uniform float sineTime;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec3 offset;
attribute vec4 color;

varying vec3 vPosition;
varying vec4 vColor;

void main(){
  /* vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position; */
  vPosition = offset + position;
  /* vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) ); */
  /* vPosition = orientation * vPosition; */
  vColor = color;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );
}
