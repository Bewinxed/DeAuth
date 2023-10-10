<script lang="ts">
	import Modal from './Modal.svelte';
	export let form_id: string | undefined = undefined;
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import PromiseButton from './PromiseButton.svelte';
	import { customDispatch } from '../utils/event_helpers';
	const dispatcher = createEventDispatcher<{ create: {} }>();
	export let icon: string;
	let open = false;
	export let item_name: string;
	export let promise: ((e: Event) => Promise<any>) | undefined = undefined;
	export let caption: string | undefined = undefined;
</script>

<div
	class="flex flex-col place-content-center place-items-center gap-8 rounded-2xl border bg-base-100 p-10 shadow-inner md:p-16"
>
	<figure
		class="w-20 max-w-sm rotate-12 rounded-full bg-base-300 p-6 text-base-100 shadow-[2px_1px_1px_1px_rgba(204,251,241,0.5)] transition-all hover:-translate-y-2 hover:bg-primary lg:w-40"
	>
		<Icon
			{icon}
			class="h-full w-full"
		></Icon>
	</figure>
	<h1
		class="flex place-content-center place-items-center text-center text-lg font-semibold text-base-content"
	>
		{caption
			? caption
			: `You have no ${item_name}(s) yet, Create one to get started`}
	</h1>
	{#if $$slots.default}
		<button
			class="btn btn-primary btn-outline h-fit"
			on:click="{() => {
				dispatcher('create', {});
				open = true;
			}}"
		>
			<Icon
				icon="carbon:add"
				class="h-4 w-4"
			></Icon>
			<span class="capitalize">Create {item_name}</span>
		</button>
	{/if}
</div>
<Modal
	{item_name}
	{icon}
	bind:open
	><slot />
	{#if promise}
		<div class="modal-action p-4">
			<PromiseButton
				icon="carbon:add"
				type="submit"
				form="{form_id}"
				class="btn btn-primary btn-wide place-self-center justify-self-center"
				{promise}
				on:click="{() => {
					dispatcher('create', {});
					open = true;
				}}"
			>
				Create {item_name}
			</PromiseButton>
		</div>
	{/if}</Modal
>
