import { Color, Scene, PerspectiveCamera, WebGLRenderer } from 'three'

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
