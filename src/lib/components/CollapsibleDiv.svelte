<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	export let open = false;
	let contents: HTMLDivElement;
	// export let direction: 'x' | 'y' = 'y';
</script>

<div tabindex="0" class="collapse" role="button">
	<input type="checkbox" bind:checked={open} />
	<div class="collapse-title text-xl font-medium"><slot name="title" /></div>
	<div class="collapse-content">
		<slot />
	</div>
</div>
