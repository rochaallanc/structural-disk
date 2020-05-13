precision highp float;
varying vec3 vColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vEyeDir;

void main() {

  //box

  vec3 NewColor = vColor;
  float epsilon = 0.05;
  float gama = 1.0;

  if( (vPosition.z < 0.0 + epsilon) && (vPosition.z > 0.0 - epsilon)){
    if( (vPosition.x < 0.0) && (vPosition.x > 0.0 - gama)){
       float distanceZ = (epsilon - abs(vPosition.z))/epsilon;
       float distanceX = abs(vPosition.x);

       //NewColor = vColor * 0.5;
       float alpha = smoothstep(0.0, epsilon, distanceZ);       
       float beta = smoothstep(0.0, 0.002, distanceX);// pow(distanceX, 0.1));
       float gama = min(alpha, beta);
       NewColor = mix(vColor, vColor* 0.4, gama);
       //NewColor = vec3(gama);
    }
  }


  // float rho = sqrt(vPosition.x * vPosition.x + vPosition.y * vPosition.y + vPosition.z * vPosition.z);
  // float phi = acos(vPosition.z/rho);
  // float theta = atan(vPosition.y/vPosition.x);

  // float epsilon = 0.5;
  // float PI = 3.1415926535;

  // vec3 NewColor = vColor;

  // //if((theta >= 0.0) && (theta <= PI/2.0)){
  //   if( (phi >= (PI/3.0 + epsilon)) && (phi <= (2.0 * PI/3.0 - epsilon))){
  //     //if((phi >= (4.0 * PI/3.0 + epsilon)) && (phi <= (5.0 * PI/3.0 - epsilon))){
  //       NewColor = vec3(0, 0, 0);
  //     //}
  //   }
  // //}

  float diffuse = dot(vEyeDir, vNormal);  

  vec4 color = vec4(diffuse * NewColor, 1.0);
  /* color.r += sin( vPosition.x * 10.0 + time ) * 0.5; */
  gl_FragColor = color;
}

