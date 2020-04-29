import { Color, Scene, PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from './orbitControl'
import { AxesHelper } from './axesHelper'

export function createScene(
  container,
  { width = 400, height = 400 } = { width: 400, height: 400 }
) {
  const camera = new PerspectiveCamera(45, 1, 0.1, 50)
  camera.position.z = 2
  const scene = new Scene()
  scene.add(new AxesHelper())
  const renderer = new WebGLRenderer()
  const controls = new OrbitControls(camera, renderer.domElement)

  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(new Color(0, 0, 0), 1)
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.outline = 'none'
  renderer.domElement.style.margin = 'auto'
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
    controls.update()
    renderer.render(scene, camera)
  }
  return {
    getCamera() {
      return camera
    },
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
