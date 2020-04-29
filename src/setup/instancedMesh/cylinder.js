import {
  Mesh,
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  DoubleSide,
  RawShaderMaterial,
  BufferGeometry,
} from 'three'
import vertexShader from './shaders/instancedCylinder.vert'
import fragmentShader from './shaders/instancedCylinder.frag'
import { generateCylinder } from './utils/geometry'

export function createThreeCylinder() {
  const geometry = new CylinderBufferGeometry(1, 1, 0.5, 16)
  var material = new MeshBasicMaterial({ color: 0xffff00 })
  var cylinder = new Mesh(geometry, material)
  return cylinder
}

export function createInstancedCylinder() {
  const instances = 1
  const torso = generateCylinder(1, 0.5)
  // const vertices = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1]
  console.log('torso', torso)
  const { vertices, indices } = torso
  const geometry = new BufferGeometry()
  geometry.maxInstancedCount = instances // set so its initalized for dat.GUI, will be set in first draw otherwise
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.setAttribute(
    'color',
    new Float32BufferAttribute(vertices.map(_v => Math.random()), 3)
  )
  const material = new RawShaderMaterial({
    uniforms: {},
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: DoubleSide,
    transparent: true,
  })
  return new Mesh(geometry, material)
}
