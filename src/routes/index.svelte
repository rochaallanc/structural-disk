<style>
  .text-center {
    text-align: center;
  }

  .minimals {
    display: flex;
    flex-direction: row;
  }

  .scene-container {
    display: inline-block;
    margin: 0 1rem;
  }
</style>

<script charset="utf-8">
  import {onMount} from 'svelte';
  import {createThreeInstancedMeshRenderingInstances, createInstancedCylinder, createThreeCylinder} from '../setup/instancedMesh';
  import {createScene} from '../setup/scene.js'
  var container, cylinderContainer, instancedCylinderContainer;
  onMount(() => {
    // three instanced mesh scene
    const scene = createScene(container, {width: 400, height: 400});
    const mesh = createThreeInstancedMeshRenderingInstances();
    scene.add(mesh)
    scene.onRender(() => {
      var time = performance.now()
      mesh.rotation.y = time * 0.0005
      mesh.material.uniforms['time'].value = time * 0.005
      mesh.material.uniforms['sineTime'].value = Math.sin(
        mesh.material.uniforms['time'].value * 0.05
      )
    })
    scene.animate()

    // cylinder minimal
    const cylinderScene = createScene(cylinderContainer, {width: 400, height: 400});
    cylinderScene.add(createThreeCylinder())
    cylinderScene.animate()

    // instanced cylinder
    const instancedCylinderScene = createScene(instancedCylinderContainer, {width: 400, height: 400});
    instancedCylinderScene.add(createThreeCylinder())
    instancedCylinderScene.animate()
  })
</script>

<svelte:head>
  <title>InstancedMesh!</title>
</svelte:head>

<div class="minimals">
  <div class="scene-container">
    <h3 class="text-center">Three InstancedMesh Example</h3>
    <div bind:this={container}>
    </div>
  </div>
  <div class="scene-container">
    <h3 class="text-center">Three Cylinder InstancedMesh Example</h3>
    <div bind:this={cylinderContainer}>
    </div>
  </div>
  <div class="scene-container">
    <h3 class="text-center">Instanced Cylinder BufferGeometry</h3>
    <div bind:this={instancedCylinderContainer}>
    </div>
  </div>
</div>
