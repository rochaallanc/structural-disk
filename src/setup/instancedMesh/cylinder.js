import {
  Mesh,
  Vector3,
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

const heightSegments = 1
const radialSegments = 16
const thetaLength = Math.PI * 2
const thetaStart = 0.0

export function generateTorso(radius, height) {
  var x, y
  var normal = new Vector3()
  var vertex = new Vector3()
  let index = 0
  const vertices = []
  const normals = []
  const uvs = []
  const radiusBottom = radius
  const radiusTop = radius
  const halfHeight = height / 2
  const indexArray = []
  const indices = []
  // this will be used to calculate the normal
  var slope = (radiusBottom - radiusTop) / height
  // generate vertices, normals and uvs
  for (y = 0; y <= heightSegments; y++) {
    var indexRow = []
    var v = y / heightSegments
    // calculate the radius of the current row
    var r = v * (radiusBottom - radiusTop) + radiusTop
    for (x = 0; x <= radialSegments; x++) {
      var u = x / radialSegments
      var theta = u * thetaLength + thetaStart
      var sinTheta = Math.sin(theta)
      var cosTheta = Math.cos(theta)
      // vertex
      vertex.x = r * sinTheta
      vertex.y = -v * height + halfHeight
      vertex.z = r * cosTheta
      vertices.push(vertex.x, vertex.y, vertex.z)
      // normal
      normal.set(sinTheta, slope, cosTheta).normalize()
      normals.push(normal.x, normal.y, normal.z)
      // uv
      uvs.push(u, 1 - v)
      // save index of vertex in respective row
      indexRow.push(index++)
    }
    // now save vertices of the row in our index array
    indexArray.push(indexRow)
  }
  // generate indices
  for (x = 0; x < radialSegments; x++) {
    for (y = 0; y < heightSegments; y++) {
      // we use the index array to access the correct indices
      var a = indexArray[y][x]
      var b = indexArray[y + 1][x]
      var c = indexArray[y + 1][x + 1]
      var d = indexArray[y][x + 1]
      // faces
      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  console.log('generateTorso', {
    radiusTop,
    radiusBottom,
    height,
    heightSegments,
    radialSegments,
    vertices: [...vertices],
  })
  return {
    vertices,
    normals,
    uvs,
  }
}

export function createThreeCylinder() {
  const geometry = new CylinderBufferGeometry(1, 1, 0.5, 16)
  var material = new MeshBasicMaterial({ color: 0xffff00 })
  var cylinder = new Mesh(geometry, material)
  return cylinder
}

export function createInstancedCylinder() {
  const instances = 1
  const torso = generateTorso(1, 0.5)
  // const vertices = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1]
  console.log('torso', torso)
  const { vertices } = torso
  const geometry = new BufferGeometry()
  geometry.maxInstancedCount = instances // set so its initalized for dat.GUI, will be set in first draw otherwise
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
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
