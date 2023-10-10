<script lang="ts">
	import Modal from '$components/Modal.svelte';

	export let item_name: string;
	export let icon: string;
	export let title: string | undefined = undefined;
	let open = false;
	
</script>

<button
	class="btn btn-outline font-display {$$restProps.class}"
	on:click={() => {
		open = true;
	}}
>
	<slot />
</button>

<Modal on:close={() => (open = false)} {title} {item_name} bind:open {icon}>
	<slot name="modal" /></Modal
>
