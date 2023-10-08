<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { getApplication } from '$components/data_contexts.js';
	import { customDispatch } from '$lib/utils/event_helpers';
	import Icon from '@iconify/svelte';
	import type {
		Prisma,
		AccessControlType,
		OAuthProvider
	} from '@prisma/client';
	import { get_svetch } from 'src/lib/context.js';
	import { object_entries } from 'src/lib/utils/object_helpers.js';
	import {
		account_id_patterns,
		provider_account_id_title,
		provider_icons
	} from 'src/lib/utils/ui_helpers';
	import toast from 'svelte-french-toast';
	import { flip } from 'svelte/animate';
	import { writable, type Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	export let data: {
		access_controls: Prisma.user_access_controlGetPayload<object>[];
	};

	export let access_type: AccessControlType;

	const post_payload: Writable<Partial<Prisma.user_access_controlCreateInput>> =
		writable<Partial<Prisma.user_access_controlCreateInput>>({
			access_type
		});

	const svetch = get_svetch();

	async function submitWhitelist(e: Event) {
		// check if form is valid
		if (e.target instanceof HTMLFormElement) {
			if (!e.target.checkValidity()) throw new Error('Invalid form');
		}

		// check pattern
		if ($post_payload.provider && $post_payload.account_id) {
			const invalid = !new RegExp(
				account_id_patterns[$post_payload.provider]
			).test($post_payload.account_id);
			if (invalid) throw new Error(`Invalid ${$post_payload.provider}`);
			if (invalid && e instanceof KeyboardEvent && e.key === 'Enter') {
				toast.error(
					`Invalid ${$post_payload.provider} ${
						provider_account_id_title[$post_payload.provider]
					}`
				);
			}
		}
		const input = $post_payload as Required<typeof $post_payload>;
		if (!input.provider) throw new Error('No provider selected');
		if (!input.account_id) throw new Error('No account id provided');
		await svetch
			.put('app/orgs/:org_id/apps/:app_id/access_control', {
				path: {
					app_id: $page.params.app_id,
					org_id: $page.params.org_id
				},
				body: input
			})
			.then((res) => {
				if (res.data) {
					data.access_controls = [...data.access_controls, res.data];
					invalidate('app:access_controls');
					customDispatch(e, 'close');
				} else {
					throw res.error;
				}
			});
	}
</script>

<form
	class="flex flex-col gap-2"
	on:submit|preventDefault="{submitWhitelist}"
>
	<div class="form-control w-fit max-w-xs">
		<label
			class="label"
			for="name"
		>
			<span class="label-text capitalize">account provider</span>
		</label>
		<ul
			id="dropdown-1"
			class="menu dropdown dropdown-open rounded-box z-[1] w-52 gap-1 border bg-base-100 p-2 shadow"
		>
			{#each object_entries(provider_icons) as [provider, icon] (provider)}
				<li
					animate:flip
					transition:fly
				>
					<button
						class:active="{$post_payload.provider === provider}"
						class="flex place-content-start place-items-center gap-2"
						on:click|preventDefault="{() => {
							$post_payload.provider = provider;
						}}"
					>
						<Icon
							{icon}
							class="h-4 w-4"
						></Icon>
						<span>{provider}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="form-control w-full max-w-xs">
		<label
			class="label"
			for="name"
		>
			<span class="label-text capitalize"
				>{$post_payload.provider
					? provider_account_id_title[$post_payload.provider]
					: 'Account ID'}</span
			>
		</label>
		<input
			pattern="{$post_payload.provider
				? provider_account_id_title[$post_payload.provider]
				: 'text'}"
			name="name"
			placeholder=""
			class="input input-bordered"
			bind:value="{$post_payload.account_id}"
			on:keydown="{(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					submitWhitelist(e);
				}
			}}"
		/>
	</div>

	<PromiseButton
		promise="{submitWhitelist}"
		icon="carbon:upload"
		class="btn btn-primary"
	>
		Whitelist
	</PromiseButton>
</form>

<style>
	header {
		view-transition-name: var(--org);
	}
</style>
