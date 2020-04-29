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
    text-align: center;
    padding: 1rem;
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
  import {createThreeCylinder} from '../setup/instancedMesh';
  import {createScene} from '../setup/scene.js'
  var container;
  let dip;
  onMount(() => {
    const scene = createScene(container, {width: 800, height: 800});
    const mesh = createThreeCylinder();
    scene.add(mesh)
    scene.animate()
  });
</script>
<div bind:this={container}></div>
<h3 class="text-center">Structural</h3>
<div class="minimal-ui">
  <input type="range" min="0" max="90" bind:value={dip} />
  <pre>dip: {dip}</pre>
</div>
