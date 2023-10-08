<script lang="ts">
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	export let open = false;
	let contents: HTMLDivElement;
	export let btn_classes = 'btn btn-ghost';
	// export let direction: 'x' | 'y' = 'y';
</script>

<!-- <input
		class="appearance-none opacity-0 absolute w-full h-full"
		type="checkbox"
		bind:checked={open}
	/> -->
<div
	class="relative flex flex-col place-content-center place-items-center transition-all {$$restProps.class}"
>
	<slot name="title" />
	<!-- {#if contents?.innerHTML.length > 0} -->
	<button
		class:rounded-b-none="{open}"
		class="bottom-0 left-0 right-0 flex h-3 w-full items-center justify-center {btn_classes}"
		on:click="{() => (open = !open)}"
	>
		<div
			class:-rotate-180="{open}"
			class="flex place-content-center place-items-center transition-transform duration-300"
		>
			<Icon
				icon="carbon:chevron-down"
				class="inline h-3 w-3"
			/>
		</div>
	</button>
	<!-- {/if} -->
</div>

{#if open}
	<div
		bind:this="{contents}"
		class="w-full"
		transition:slide="{{ axis: 'y' }}"
	>
		<slot />
	</div>
{/if}
