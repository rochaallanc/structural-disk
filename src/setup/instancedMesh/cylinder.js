import {
  Color,
  Scene,
  PerspectiveCamera,
  Mesh,
  WebGLRenderer,
  Vector3,
  CylinderBufferGeometry,
  MeshBasicMaterial,
} from 'three'

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
export function createScene(container, { width = 400, height = 400 }) {
  const camera = new PerspectiveCamera(50, 1, 1, 10)
  camera.position.z = 2
  const scene = new Scene()
  const renderer = new WebGLRenderer()

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(new Color(0, 0, 0), 1)
  container.appendChild(renderer.domElement)
  if (renderer.extensions.get('ANGLE_instanced_arrays') === null) {
    document.getElementById('notSupported').style.display = ''
    return
  }
  // window.addEventListener('resize', onWindowResize, false)
  // function onWindowResize() {
  //   camera.aspect = window.innerWidth / window.innerHeight
  //   camera.updateProjectionMatrix()
  //   renderer.setSize(window.innerWidth, window.innerHeight)
  // }

  function animate() {
    requestAnimationFrame(animate)
    render()
  }

  let onRender = () => {}
  function render() {
    onRender()
    renderer.render(scene, camera)
  }
  return {
    render,
    onRender(cb) {
      onRender = cb
    },
    animate,
    onDestroy() {
      // window.removeEventListener('resize', onWindowResize)
    },
    add(threeObject) {
      scene.add(threeObject)
    },
  }
}

export function createCylinder() {
  // const torsoData = generateTorso(0.2, 0.1);
  const geometry = new CylinderBufferGeometry(0.5, 0.5, 2, 3.2)
  var material = new MeshBasicMaterial({ color: 0xffff00 })
  var cylinder = new Mesh(geometry, material)
  return cylinder
}

