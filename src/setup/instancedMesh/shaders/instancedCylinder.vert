precision highp float;

uniform float sineTime;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute float dipDirection;
attribute float dip;
attribute vec3 offset;
attribute vec3 color;
attribute vec3 normal;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying vec3 vEyeDir;

mat4 rotate(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
        oc * axis.x * axis.x + c,        oc * axis.x * axis.y - axis.z*s, oc * axis.z*axis.x +axis.y*s, 0.0,
        oc * axis.x * axis.y + axis.z*s, oc * axis.y * axis.y + c,        oc * axis.y*axis.z -axis.x*s, 0.0,
        oc * axis.z * axis.x - axis.y*s, oc * axis.y * axis.z + axis.x*s, oc * axis.z*axis.z + c,       0.0,
        0.0,                             0.0,                                0.0,                       1.0);
}


// mat4 rotationZfixed(float alpha, float beta){
//     return mat4(
//         cos(beta),     sin(beta) * sin(alpha),    cos(alpha) * sin(beta), 0.0,
//         0, cos(alpha),            -sin(alpha),                     0.0,
//         -sin(beta), cos(beta)*sin(alpha), cos(beta) * cos(alpha),  0.0,
//         0.0,               0.0,               0.0,                 1.0);  
// }

mat4 rotationFixingUp(float gama, float beta){
    return mat4(
      cos(gama) * cos (beta), - sin(gama), cos(gama)* sin(beta), 0.0,
      sin(gama) * cos (beta), cos(gama), sin(gama) * sin(beta), 0.0,
      -sin(beta), 0, cos(beta), 0.0,
      0.0, 0.0, 0.0, 1.0);
}


void main(){
  /* vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position; */
 mat3 rotatedMatrix = mat3(rotationFixingUp(-dip, dipDirection));
  vPosition = position;

  vEyeDir = normalize(rotatedMatrix * position);

  vNormal = normalize(rotatedMatrix * normal);
  // mat3 rotatedMatrix = mat3(rotate(normalize(vec3( 0, 0, 1 )), -dip));
  // mat3 rotatedMatrix1 = mat3(rotate(normalize(vec3( 0, 1, 0 )), dipDirection));  
  // vPosition = offset + rotatedMatrix * position * rotatedMatrix1;
  /* vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) ); */
  /* vPosition = orientation * vPosition; */
  /* vec2 rotatedPosition = vec3( */
  /*    vPosition.x * dip + vPosition.y * 0, */
  /*    vPosition.y * dip - vPosition.x * 0); */
  vColor = color;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( offset + rotatedMatrix * position, 1.0 );
}
