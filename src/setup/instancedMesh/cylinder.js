import {
  Mesh,
  Vector3,
  CylinderBufferGeometry,
  MeshBasicMaterial,
  Float32BufferAttribute,
  InstancedBufferGeometry,
  DoubleSide,
  RawShaderMaterial,
} from 'three'
import vertexShader from './shaders/instancedCylinder.vert'
import fragmentShader from './shaders/instancedCylinder.frag'

const heightSegments = 1
const radialSegments = 8
const thetaLength = Math.PI * 2
const thetaStart = 0.0

export function generateTorso(radius = 2, height = 1) {
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
  return {
    vertices,
    normals,
    uvs,
  }
}

export function createThreeCylinder() {
  // const torsoData = generateTorso(0.2, 0.1);
  const geometry = new CylinderBufferGeometry(0.25, 0.25, 1, 8)
  var material = new MeshBasicMaterial({ color: 0xffff00 })
  var cylinder = new Mesh(geometry, material)
  return cylinder
}

export function createInstancedCylinder() {
  const instances = 1
  const { vertices } = generateTorso(2, 1)
  const geometry = new InstancedBufferGeometry()
  geometry.maxInstancedCount = instances // set so its initalized for dat.GUI, will be set in first draw otherwise
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setAttribute(
    'color',
    new Float32BufferAttribute(vertices.map(() => Math.random()), 3)
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
