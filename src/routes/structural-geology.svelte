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
  import {createThreeCylinder} from '../setup/instancedMesh';
  import {createScene} from '../setup/scene.js'
  var container;
  let dip = 45;
  onMount(() => {
    const scene = createScene(container, {width: 800, height: 800});
    const mesh = createThreeCylinder();
    scene.getCamera().position.set(2, 2, 4)
    scene.add(mesh)
    scene.animate()
  });
</script>
<div class="container">
  <div bind:this={container}></div>
  <div class="minimal-ui">
    <b>dip</b>: {dip} <input type="range" min="0" max="90" bind:value={dip} />
  </div>
</div>
