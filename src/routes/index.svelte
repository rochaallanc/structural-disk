<style>
	h1, figure, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	.scene-container {
		margin: 0 0 1em 0;
    width: 800px;
    height: 800px;
    border: grey 1px solid;
	}

	img {
		width: 100%;
		max-width: 400px;
		margin: 0 0 1em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<script charset="utf-8">
  import {onMount} from 'svelte';
  import {Color,Vector4, Scene, PerspectiveCamera, RawShaderMaterial, InstancedBufferGeometry, Float32BufferAttribute, InstancedBufferAttribute, DoubleSide, Mesh, WebGLRenderer} from 'three';
  import {vertexShader, fragmentShader} from '../setup/instancedMesh';

    var container;

    var camera, scene, renderer;


    function init() {
      camera = new PerspectiveCamera( 50, 1, 1, 10 );
      camera.position.z = 2;
      scene = new Scene();
      // geometry
      var vector = new Vector4();
      var instances = 100;
      var positions = [];
      var offsets = [];
      var colors = [];
      var orientationsStart = [];
      var orientationsEnd = [];

      positions.push( 0.05, - 0.05, 0 );
      positions.push( - 0.05, 0.05, 0 );
      positions.push( 0, 0, 0.05 );

      // instanced attributes
      for ( var i = 0; i < instances; i ++ ) {
        // offsets
        offsets.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
        // colors
        colors.push( Math.random(), Math.random(), Math.random(), Math.random() );
        // orientation start
        vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
        vector.normalize();
        orientationsStart.push( vector.x, vector.y, vector.z, vector.w );
        // orientation end
        vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
        vector.normalize();
        orientationsEnd.push( vector.x, vector.y, vector.z, vector.w );
      }

      var geometry = new InstancedBufferGeometry();
      geometry.maxInstancedCount = instances; // set so its initalized for dat.GUI, will be set in first draw otherwise
      geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
      geometry.setAttribute( 'offset', new InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
      geometry.setAttribute( 'color', new InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
      geometry.setAttribute( 'orientationStart', new InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) );
      geometry.setAttribute( 'orientationEnd', new InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) );

      // material
      var material = new RawShaderMaterial( {
        uniforms: {
          "time": { value: 1.0 },
          "sineTime": { value: 1.0 }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: DoubleSide,
        transparent: true
      });

      var mesh = new Mesh( geometry, material );
      scene.add( mesh );
      renderer = new WebGLRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(800,800);
      renderer.setClearColor(new Color(0,0,0), 1)
      console.log(container)
      container.appendChild( renderer.domElement );
      if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === null ) {
        document.getElementById( 'notSupported' ).style.display = '';
        return;
      }
      window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
      requestAnimationFrame( animate );
      render();
    }

    function render() {
      var time = performance.now();
      var object = scene.children[ 0 ];
      object.rotation.y = time * 0.0005;
      object.material.uniforms[ "time" ].value = time * 0.005;
      object.material.uniforms[ "sineTime" ].value = Math.sin( object.material.uniforms[ "time" ].value * 0.05 );
      renderer.render( scene, camera );
    }

    onMount(() => {
      init();
      animate();
    })
</script>

<svelte:head>
	<title>InstancedMesh!</title>
</svelte:head>

<div bind:this={container} class="scene-container">
</div>
