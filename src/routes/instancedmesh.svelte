<style>
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
  import {createThreeInstancedMeshRenderingInstances, createInstancedCylinder, createThreeCylinder} from '../setup/instancedMesh';
  import {createScene} from '../setup/scene.js'
  var container, cylinderContainer, instancedCylinderContainer;

  onMount(() => {
    // three instanced mesh scene
    const scene = createScene(container);
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
    const cylinderScene = createScene(cylinderContainer);
    cylinderScene.getCamera().position.fromArray([3, 4, 6])
    const cylinder = createThreeCylinder();
    cylinderScene.add(cylinder)
    cylinderScene.animate()

    // instanced cylinder
    const instancedCylinderScene = createScene(instancedCylinderContainer);
    instancedCylinderScene.getCamera().position.fromArray([2, 2, 2])
    const instancedCylinderMesh = createInstancedCylinder();
    instancedCylinderScene.add(instancedCylinderMesh)
    instancedCylinderScene.onRender(() => {
      var time = performance.now()
      // instancedCylinderMesh.rotation.y = time * 0.0005
      // instancedCylinderMesh.material.uniforms['sineTime'].value = Math.sin(
      //   time * 0.005
      // )
    })
    instancedCylinderScene.animate()
    window.instancedCylinderScene = instancedCylinderScene
  })
</script>

<svelte:head>
  <title>InstancedMesh!</title>
</svelte:head>

<div class="minimals">
  <div class="minimal-card">
    <div bind:this={container}></div>
    <h3 class="text-center">Three InstancedMesh</h3>
  </div>

  <div class="minimal-card">
    <div bind:this={cylinderContainer}></div>
    <h3 class="text-center">Three CylinderGeometry</h3>
  </div>

  <div class="minimal-card">
    <div bind:this={instancedCylinderContainer}></div>
    <h3 class="text-center">Instanced Cylinder BufferGeometry</h3>
  </div>
</div>
