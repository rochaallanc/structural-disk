<script>
	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid #b6f5b4;
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(70,183,66);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
  <ul>
    <li><a aria-current='{segment === undefined ? "page" : undefined}' href='.'>Home</a></li>
    <li><a aria-current='{segment === "scene" ? "page" : undefined}' href='/scene'>Scene</a></li>
    <li><a aria-current='{segment === "instancedmesh" ? "page" : undefined}' href='/instancedmesh'>InstancedMesh</a>
    </li>
    <li><a aria-current='{segment === "structural-geology" ? "page" : undefined}' href='/structural-geology'>Structural
        Geology</a></li>

    <!-- for the blog link, we're using rel=prefetch so that Sapper prefetches
		     the blog data when we hover over the link or tap it on a touchscreen -->
    <!--<li><a rel=prefetch aria-current='{segment === "blog" ? "page" : undefined}' href='blog'>blog</a></li>-->
  </ul>
</nav>
