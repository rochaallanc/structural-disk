import {
  Color,
  DirectionalLight,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from './orbitControl'
import { AxesHelper } from './axesHelper'

export function createScene(
  container,
  { width = 400, height = 400, axesLength = 2 } = {
    width: 400,
    height: 400,
    axesLength: 2,
  }
) {
  const camera = new PerspectiveCamera(45, 1, 0.1, 50)
  camera.position.z = 2
  const scene = new Scene()

  let axesHelper
  if (axesLength > 0) {
    axesHelper = new AxesHelper(axesLength)
    scene.add(axesHelper)
  }
  const renderer = new WebGLRenderer()
  const controls = new OrbitControls(camera, renderer.domElement)

  // light
  // const light = new DirectionalLight(0xffffff, 0.5)
  // light.position.set(0, 0, 2)
  // scene.add(light)
  const top = new DirectionalLight(0xffffff, 0.5)
  top.position.set(0, -1, 0)
  scene.add(top)
  const bottom = new DirectionalLight(0xffffff, 0.5)
  bottom.position.set(0, 1, 0)
  scene.add(bottom)
  const cameraLight = new DirectionalLight(0xffffff, 0.7)
  scene.add(cameraLight)

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
    cameraLight.position.copy(camera.position)
    renderer.render(scene, camera)
  }
  return {
    getCamera() {
      return camera
    },
    getLight() {
      return top
    },
    getAxisHelper() {
      return axesHelper
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
