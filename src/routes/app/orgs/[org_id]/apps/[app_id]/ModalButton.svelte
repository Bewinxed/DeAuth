<script lang="ts">
	import Modal from '$components/Modal.svelte';
	export let tooltip: string = '';
	export let item_name: string;
	export let icon: string;
	export let title: string | undefined = undefined;
	let open = false;
</script>

{#if tooltip}
	<div
		class="tooltip"
		data-tip="{tooltip}"
	>
		<button
			class="btn btn-outline relative font-display chonk transition-all hover:-translate-y-[0.1em]
			 {$$restProps.class}"
			on:click="{() => {
				open = true;
			}}"
		>
			<slot />
		</button>
	</div>
{:else}
	<button
		class="btn btn-outline relative font-display chonk transition-all hover:-translate-y-[0.1em]
		{$$restProps.class}"
		on:click="{() => {
			open = true;
		}}"
	>
		<slot />
	</button>
{/if}

<Modal
	on:close="{() => (open = false)}"
	{title}
	{item_name}
	bind:open
	{icon}
>
	<slot name="modal" /></Modal
>
