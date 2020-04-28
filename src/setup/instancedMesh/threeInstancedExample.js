import {
  Vector4,
  RawShaderMaterial,
  InstancedBufferGeometry,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  DoubleSide,
  Mesh,
} from 'three'

export const vertexShader = `
    precision highp float;

		uniform float sineTime;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec3 offset;
		attribute vec4 color;
		attribute vec4 orientationStart;
		attribute vec4 orientationEnd;

		varying vec3 vPosition;
		varying vec4 vColor;

		void main(){
			vPosition = offset * max( abs( sineTime * 2.0 + 1.0 ), 0.5 ) + position;
			vec4 orientation = normalize( mix( orientationStart, orientationEnd, sineTime ) );
			vec3 vcV = cross( orientation.xyz, vPosition );
			vPosition = vcV * ( 2.0 * orientation.w ) + ( cross( orientation.xyz, vcV ) * 2.0 + vPosition );

			vColor = color;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( vPosition, 1.0 );

		}
`

export const fragmentShader = `
    precision highp float;

		uniform float time;

		varying vec3 vPosition;
		varying vec4 vColor;

		void main() {

			vec4 color = vec4( vColor );
			color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

			gl_FragColor = color;
		}
`

export function createThreeInstancedMeshRenderingInstances() {
  // geometry
  var vector = new Vector4()
  var instances = 100
  var positions = []
  var offsets = []
  var colors = []
  var orientationsStart = []
  var orientationsEnd = []

  positions.push(0.05, -0.05, 0)
  positions.push(-0.05, 0.05, 0)
  positions.push(0, 0, 0.05)

  // instanced attributes
  for (var i = 0; i < instances; i++) {
    // offsets
    offsets.push(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
    // colors
    colors.push(Math.random(), Math.random(), Math.random(), Math.random())
    // orientation start
    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
    vector.normalize()
    orientationsStart.push(vector.x, vector.y, vector.z, vector.w)
    // orientation end
    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
    vector.normalize()
    orientationsEnd.push(vector.x, vector.y, vector.z, vector.w)
  }

  var geometry = new InstancedBufferGeometry()
  geometry.maxInstancedCount = instances // set so its initalized for dat.GUI, will be set in first draw otherwise
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute(
    'offset',
    new InstancedBufferAttribute(new Float32Array(offsets), 3)
  )
  geometry.setAttribute(
    'color',
    new InstancedBufferAttribute(new Float32Array(colors), 4)
  )
  geometry.setAttribute(
    'orientationStart',
    new InstancedBufferAttribute(new Float32Array(orientationsStart), 4)
  )
  geometry.setAttribute(
    'orientationEnd',
    new InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
  )

  // material
  var material = new RawShaderMaterial({
    uniforms: {
      time: { value: 1.0 },
      sineTime: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: DoubleSide,
    transparent: true,
  })

  return new Mesh(geometry, material)
}
