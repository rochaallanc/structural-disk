import { Vector3, Vector2 } from 'three'

const heightSegments = 1
const radialSegments = 16
const thetaLength = Math.PI * 2
const thetaStart = 0.0

const [r1, g1, b1] = [33 / 255, 150 / 255, 243 / 255]
export function generateCylinder(radius, height) {
  const indices = []
  const vertices = []
  const colors = []
  const normals = []
  let index = 0
  const radiusBottom = radius
  const radiusTop = radius
  const halfHeight = height / 2
  const uvs = []

  function generateTorso() {
    var x, y
    var normal = new Vector3()
    var vertex = new Vector3()
    const indexArray = []
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
        if (y === 0) {
          colors.push(r1, g1, b1)
        } else {
          colors.push(1 - r1, 1 - g1, 1 - b1)
        }
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
  }

  function generateCap(top) {
    var x, centerIndexStart, centerIndexEnd
    var uv = new Vector2()
    var vertex = new Vector3()
    var radius = top === true ? radiusTop : radiusBottom
    var sign = top === true ? 1 : -1
    // save the index of the first center vertex
    centerIndexStart = index

    // first we generate the center vertex data of the cap.
    // because the geometry needs one set of uvs per face,
    // we must generate a center vertex per face/segment
    const [r, g, b] = top ? [r1, g1, b1] : [1 - r1, 1 - g1, 1 - b1]

    for (x = 1; x <= radialSegments; x++) {
      // vertex

      vertices.push(0, halfHeight * sign, 0)
      colors.push(r, g, b)

      // normal

      normals.push(0, sign, 0)

      // uv

      uvs.push(0.5, 0.5)

      // increase index

      index++
    }

    // save the index of the last center vertex

    centerIndexEnd = index

    // now we generate the surrounding vertices, normals and uvs

    for (x = 0; x <= radialSegments; x++) {
      var u = x / radialSegments
      var theta = u * thetaLength + thetaStart

      var cosTheta = Math.cos(theta)
      var sinTheta = Math.sin(theta)

      // vertex

      vertex.x = radius * sinTheta
      vertex.y = halfHeight * sign
      vertex.z = radius * cosTheta
      vertices.push(vertex.x, vertex.y, vertex.z)
      colors.push(r, g, b)

      // normal

      normals.push(0, sign, 0)

      // uv

      uv.x = cosTheta * 0.5 + 0.5
      uv.y = sinTheta * 0.5 * sign + 0.5
      uvs.push(uv.x, uv.y)

      // increase index

      index++
    }

    // generate indices

    for (x = 0; x < radialSegments; x++) {
      var c = centerIndexStart + x
      var i = centerIndexEnd + x

      if (top === true) {
        // face top

        indices.push(i, i + 1, c)
      } else {
        // face bottom

        indices.push(i + 1, i, c)
      }
    }
  }

  generateTorso(radius, height)
  generateCap(true)
  generateCap(false)

  return {
    vertices,
    indices,
    normals,
    colors,
  }
}
