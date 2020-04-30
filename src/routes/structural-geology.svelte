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
  import {Mesh, BufferGeometry, LineBasicMaterial, BufferAttribute} from 'three';
  import {createThreeCylinder} from '../setup/instancedMesh';
  import {createScene} from '../setup/scene.js'
  var container;
  let dip = 45;
  let rx = 0;
  let ry = 0;
  let rz = 0;
  let mesh;
  onMount(() => {
    const scene = createScene(container, {width: 800, height: 800});
    mesh = createThreeCylinder();
    scene.getCamera().position.set(2, 2, 4)

    // const dipGeom = new BufferGeometry()
    // dipGeom.setAttribute( 'position', new BufferAttribute( new Float32Array([0, 5, 0, 0, 0, 5, 5, 5, 5]), 3 ) );
    // const dipMesh = new Mesh(dipGeom, new LineBasicMaterial({color: 0x0000ff}))

    scene.add(mesh)
    // scene.add(dipMesh)
    rx = mesh.rotation.x
    ry = mesh.rotation.y
    rz = mesh.rotation.z
    scene.animate()
  });
  $: {
    // rz = rx
  }
  $: {
    if (mesh) {
      mesh.rotation.x = rx
      mesh.rotation.y = ry * Math.PI/180
      mesh.rotation.z = rz * Math.PI/180
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
