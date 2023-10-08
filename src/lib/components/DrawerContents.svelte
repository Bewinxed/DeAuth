<script lang="ts">
	import { getDrawer } from '$components/context';
	import { onMount, type SvelteComponent } from 'svelte';
	import { Limbo, Portal, teleport } from 'svelte-reparent';

	const drawer = getDrawer();

	// let drawer_contents: SvelteComponent['$$slot_def'];

	let counter = 0;

	onMount(() => {
		// drawer.set(drawer_contents, { ...$$restProps });
		// teleport($drawer, 'drawer');
	});
</script>

<!-- <svelte:window on:click={() => (drawer_open = false)} /> -->

<div id="drawer-contents" class="hidden">
	<!-- <Limbo bind:component={$drawer}><slot /></Limbo> -->
</div>
