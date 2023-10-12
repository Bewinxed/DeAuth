<script lang="ts">
	import Modal from '$components/Modal.svelte';
	export let tooltip: string = '';
	export let item_name: string;
	export let icon: string;
	export let title: string | undefined = undefined;
	export let outline = true;
	let open = false;
</script>

{#if tooltip}
	<div
		class="tooltip"
		data-tip="{tooltip}"
	>
		<button
			style="{$$restProps.style}"
			class:btn-outline="{outline}"
			class="chonk btn relative font-display transition-all hover:-translate-y-[0.1em]
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
		class:btn-outline="{outline}"
		class="chonk btn relative font-display transition-all hover:-translate-y-[0.1em]
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
