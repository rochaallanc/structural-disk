import { Color, FontLoader, TextGeometry, MeshBasicMaterial, Mesh } from 'three'
import { noop } from 'svelte/internal'

const fontLoader = new FontLoader()
let fontLoaded
function getFont(url) {
  return new Promise((resolve, reject) => {
    if (fontLoaded) {
      resolve(fontLoaded)
    }
    fontLoader.load(
      url,
      font => {
        fontLoaded = font
        resolve(font)
      },
      noop,
      err => {
        reject(err)
      }
    )
  })
}

export async function createText({ position: [x, y, z], text }) {
  return getFont('/fonts/helvetiker_regular.typeface.json').then(font => {
    fontLoaded = font
    var textGeo = new TextGeometry(text, {
      size: 0.2,
      height: 0.05,
      curveSegments: 6,
      font: font,
      style: 'normal',
    })
    var color = new Color()
    color.setRGB(255, 250, 250)
    var textMaterial = new MeshBasicMaterial({ color: color })
    const textMesh = new Mesh(textGeo, textMaterial)
    textMesh.position.x = x
    textMesh.position.y = y
    textMesh.position.z = z
    return textMesh
  })
}
