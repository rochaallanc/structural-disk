<style type="text/css" media="screen">
  .text-center {
    text-align: center;
  }

  .minimals {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  pre {
    margin: 0;
  }

  .minimal-ui {
    text-align: left;
    padding: 1rem;
  }
  .ui-item {
    padding: 0.5rem;
  }

  .container {
    display: flex;
    flex-direction: row;
  }

  .minimal-card {
    display: inline-block;
    margin: 1rem 1rem;
    width: 450px;
  }

  h3 {
    margin: 0.25rem 0.25rem;
  }
</style>
<script charset="utf-8">
  import {onMount} from 'svelte';
  import {Line, Color, MeshBasicMaterial,TextGeometry, Mesh, Object3D, BufferGeometry, LineBasicMaterial, BufferAttribute} from 'three';
  import {createThreeCylinder} from '../setup/instancedMesh';
  import {createScene} from '../setup/scene.js'
  import {createText} from '../setup/text.js'
  var container;
  let rx = 0;
  let ry = 30;
  let rz = 45;
  let mesh;
  let meshContainer;
  let text;
  onMount(async () => {
    const axesLength = 2;
    const scene = createScene(container, {width: 800, height: 800, axesLength: 0});
    mesh = createThreeCylinder();
    const camera = scene.getCamera()
    camera.position.set(0, 8, 0)

    meshContainer = new Object3D()
    const dipGeom = new BufferGeometry()
    dipGeom.setAttribute('position', new BufferAttribute(new Float32Array([0, 0.26, 0, -1, 0.26, 0]), 3));
    const dipMesh = new Line(dipGeom, new LineBasicMaterial({color: 0x000000}))

    // text
    const N = await createText({position: [-axesLength * 1.1, 0, 0], text: 'N'})
    const S = await createText({position: [axesLength * 1.1, 0, 0], text: 'S'})
    const W = await createText({position: [0, 0, axesLength * 1.1], text: 'W'})
    const E = await createText({position: [0, 0, -axesLength * 1.1], text: 'E'})
    scene.add(N)
    scene.add(S)
    scene.add(E)
    scene.add(W)
    scene.onRender(() => {
      N.rotation.copy(camera.rotation)
      S.rotation.copy(camera.rotation)
      E.rotation.copy(camera.rotation)
      W.rotation.copy(camera.rotation)
    })

    meshContainer.add(mesh, dipMesh)
    meshContainer.position.set(0, 0, 0)
    scene.add(meshContainer)
    scene.animate()
  });
  $: {
    if (meshContainer) {
      meshContainer.rotation.x = rx
      meshContainer.rotation.y = -ry * Math.PI/180
      meshContainer.rotation.z = rz * Math.PI/180
    }
  }
</script>
<div class="container">
  <div bind:this={container}></div>
  <div class="minimal-ui">
    <div>
      <!-- <div class="ui&#45;item"> -->
      <!--   <b>x</b><input type="range" min="&#45;1.57" max="1.57" step="0.1" bind:value={rx} />{rx}<br> -->
      <!-- </div> -->
      <div class="ui-item">
        <b>Dip Direction</b><input type="range" min="0" max="360" step="10" bind:value={ry} />{ry}<br>
      </div>
      <div class="ui-item">
        <b>Dip</b><input type="range" min="0" max="90" step="5" bind:value={rz} />{rz}<br>
      </div>
    </div>
  </div>
</div>
