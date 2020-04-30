import {
  Mesh,
  CylinderBufferGeometry,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  DoubleSide,
  RawShaderMaterial,
  InstancedBufferAttribute,
  Vector4,
  MeshPhongMaterial,
} from 'three'
import vertexShader from './shaders/instancedCylinder.vert'
import fragmentShader from './shaders/instancedCylinder.frag'
import { generateCylinder } from './utils/geometry'

export function createThreeCylinder() {
  const geometry = new CylinderBufferGeometry(1, 1, 0.5, 16)
  var material = new MeshPhongMaterial({
    color: 0xffff00,
    specular: 0x333333,
    shininess: 15,
  })
  var cylinder = new Mesh(geometry, material)
  return cylinder
}

export function createInstancedCylinder() {
  const instances = 5
  const torso = generateCylinder(0.1, 0.05)
  // const vertices = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1]
  const { vertices, indices } = torso
  const geometry = new InstancedBufferGeometry()
  geometry.maxInstancedCount = instances // set so its initalized for dat.GUI, will be set in first draw otherwise
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.setAttribute(
    'color',
    new Float32BufferAttribute(vertices.map(_v => Math.random()), 3)
  )
  var vector = new Vector4()
  var offsets = []
  var orientationsStart = []
  var orientationsEnd = []
  for (var i = 0; i < instances; i++) {
    offsets.push(Math.random(), Math.random(), Math.random())
    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
    vector.normalize()
    orientationsStart.push(vector.x, vector.y, vector.z, vector.w)
    vector.set(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
    vector.normalize()
    orientationsEnd.push(vector.x, vector.y, vector.z, vector.w)
  }
  geometry.setAttribute(
    'offset',
    new InstancedBufferAttribute(new Float32Array(offsets), 3)
  )
  geometry.setAttribute(
    'orientationEnd',
    new InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
  )
  geometry.setAttribute(
    'orientationStart',
    new InstancedBufferAttribute(new Float32Array(orientationsStart), 4)
  )

  const material = new RawShaderMaterial({
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
