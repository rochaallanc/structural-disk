<style type="text/css" media="screen">
  .ui-item {
    padding: 0.5rem;
  }

  .container {
    display: flex;
    flex-direction: row;
  }

  .attribute {
    display: inline-block;
    min-width: 120px;
    font-weight: bold;
    font-size: 18px;
  }

  b {
    font-size: 16px;
  }

  input[type=range] {
    -webkit-appearance: none;
    margin: 18px;
    /* width: 100%; */
  }

  input[type=range]:focus {
    outline: none;
  }

  input[type=range]::-webkit-slider-runnable-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  input[type=range]::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -14px;
  }

  input[type=range]:focus::-webkit-slider-runnable-track {
    background: #367ebd;
  }

  input[type=range]::-moz-range-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    background: #3071a9;
    border-radius: 1.3px;
    border: 0.2px solid #010101;
  }

  input[type=range]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }

  input[type=range]::-ms-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }

  input[type=range]::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }

  input[type=range]::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }

  input[type=range]::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }

  input[type=range]:focus::-ms-fill-lower {
    background: #3071a9;
  }

  input[type=range]:focus::-ms-fill-upper {
    background: #367ebd;
  }
</style>

<script charset="utf-8">
  import {onMount} from 'svelte';
  import Toggle from '../components/Toggle.svelte';
  import {Float32BufferAttribute, Line, Color, MeshBasicMaterial, TextGeometry, Mesh, Object3D, BufferGeometry, LineBasicMaterial, BufferAttribute} from 'three';
  import {createInstancedCylinder} from '../setup/instancedMesh';
  import {createScene} from '../setup/scene.js'
  import {createText} from '../setup/text.js'

  var container;
  let toggleOn = true;
  let polarity = toggleOn ? 1 : -1;
  var i, l;
  let count = 0;
  $: {
    polarity = toggleOn ? 1 : -1;
    if (mesh && count > 1) {
      const colorArray = mesh.geometry.getAttribute('color').array
      for (i = 0, l = colorArray.length; i < l; i++) {
        colorArray[i] = 1 - colorArray[i]
      }
      mesh.geometry.attributes.color.needsUpdate = true
    }
    count++
  }
  let rx = 0;
  let ry = 30;
  let rz = 45;
  let mesh;
  let meshContainer;
  let text;

  onMount(async () => {
    const axesLength = 2;
    const scene = createScene(container, {width: 800, height: 800, axesLength: 0});
    mesh = createInstancedCylinder();
    const camera = scene.getCamera()
    window.camera = camera
    camera.position.set(-6, 4, -3)

    meshContainer = new Object3D()

    const dipGeom = new BufferGeometry()
    dipGeom.setAttribute('position', new BufferAttribute(new Float32Array([
      0, 0.26, 0,
      -1.01, 0.26, 0,
      -1.01, -0.26, 0,
      0, -0.26, 0
    ]), 3));
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
      meshContainer.rotation.y = -ry * Math.PI / 180
      meshContainer.rotation.z = rz * Math.PI / 180
    }
  }

</script>
<div class="container">
  <div bind:this={container}></div>
  <div class="minimal-ui">
    <div style="display: grid; margin-left: 1rem;">
      <!-- <div class="ui&#45;item"> -->
      <!--   <b>x</b><input type="range" min="&#45;1.57" max="1.57" step="0.1" bind:value={rx} />{rx}<br> -->
      <!-- </div> -->
      <div class="ui-item">
        <span class="attribute">Dip Direction</span><input type="range" min="0" max="360" step="10"
          bind:value={ry} />{ry}
      </div>
      <div class="ui-item">
        <span class="attribute">Dip</span><input type="range" min="0" max="90" step="5" bind:value={rz} />{rz}<br>
      </div>
      <div class="ui-item"><span class="attribute" style="margin-right: 1em;">Plarity</span>
        <Toggle bind:toggle={toggleOn} /> {polarity}</div>
    </div>
  </div>
</div>
