<script lang="ts">
	import AccessForm from './AccessForm.svelte';

	import { page } from '$app/stores';
	import EmptyState from '$components/EmptyState.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { getApplication } from '$components/data_contexts.js';
	import { customDispatch } from '$lib/utils/event_helpers';
	import Icon from '@iconify/svelte';
	import type {
		AccessControlType,
		OAuthProvider,
		Prisma
	} from '@prisma/client';
	export let data;
	import { get_svetch } from 'src/lib/context.js';
	import { flip } from 'svelte/animate';
	import { writable, type Writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import ModalButton from '../ModalButton.svelte';

	const provider_icons: Record<OAuthProvider, string> = {
		SOLANA: 'formkit:solana',
		GITHUB: 'simple-icons:github',
		TWITTER: 'simple-icons:twitter',
		DISCORD: 'simple-icons:discord',
		IP_ADDRESS: 'carbon:ip-address'
	};

	const access_types: {
		access_type: AccessControlType;
		icon: string;
		caption: string;
	}[] = [
		{
			access_type: 'WHITELIST',
			icon: 'carbon:white-paper',
			caption:
				'You have no whitelisted users, by default, everyone has access to your application.'
		},
		{
			access_type: 'BLACKLIST',
			icon: 'carbon:stop-outline-filled',
			caption:
				'You have no blacklisted users, Add users here to prevent them from authenticating.'
		}
	];

	const whitelist_input: Writable<
		Partial<Prisma.user_access_controlCreateInput>
	> = writable<Partial<Prisma.user_access_controlCreateInput>>({});
	const blacklist_input: Writable<
		Partial<Prisma.user_access_controlCreateInput>
	> = writable<Partial<Prisma.user_access_controlCreateInput>>({});

	const svetch = get_svetch();
	const application = getApplication();
</script>

{#each access_types as { access_type, icon, caption }, i (access_type)}
	{@const access_type_list = data.access_controls.filter((a) => {
		if (a.access_type === access_type) {
			return a;
		}
	})}
	<header
		style:--org="app-setting-header{i ? 0 : ''}"
		class="flex place-content-start place-items-center justify-between gap-2 p-4"
	>
		<div class="flex place-content-center place-items-center gap-2">
			<PrettyIcon {icon}></PrettyIcon>
			<h1 class="text-xl font-bold capitalize">
				{access_type.toLowerCase()}
			</h1>
		</div>
		<div>
			<ModalButton
				icon="carbon:link"
				item_name="{access_type.toLowerCase()}ed user"
			>
				<Icon
					icon="carbon:add"
					class="inline"
				/>
				<svelte:fragment slot="modal">
					<AccessForm
						{data}
						{access_type}
					/></svelte:fragment
				>
			</ModalButton>
		</div>
		<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
	</header>
	<div class="p-4">
		{#if access_type_list.length > 0}
			<div class="flex flex-wrap place-content-start gap-2">
				{#each access_type_list as access_control (access_control.id)}
					<div
						animate:flip
						transition:fly
						class="flex w-full justify-between rounded-lg border border-b-2 px-4 py-2 shadow"
					>
						<span class="gap-2 place-self-center capitalize">
							<PrettyIcon
								size="small"
								icon="{access_control.provider
									? provider_icons[access_control.provider]
									: ''}"
							/>
							{access_control.provider.replace('_', ' ').toLowerCase()}
						</span>

						<div
							class="tooltip place-self-center"
							data-tip="{access_control.account_id}"
						>
							{#if access_control.account_id.length > 20}
								{access_control.account_id?.slice(
									0,
									5
								)}...{access_control.account_id?.slice(-5)}
							{:else}
								{access_control.account_id}
							{/if}
						</div>
						<!-- created at -->
						<div class="flex place-content-center place-items-center gap-2">
							<p class="text-sm italic">
								Created: {access_control.created_at.toLocaleString(undefined, {
									dateStyle: 'short',
									timeStyle: 'short'
								})}
							</p>
							<div class="card-actions">
								<PromiseButton
									icon="carbon:trash-can"
									class="btn btn-error btn-sm"
									tooltip="{'delete'}"
									promise="{async () => {
										await svetch
											.delete('app/orgs/:org_id/apps/:app_id/access_control', {
												path: {
													app_id: $page.params.app_id,
													org_id: $page.params.org_id
												},
												query: {
													id: access_control.id
												}
											})
											.then((res) => {
												if (res.data) {
													data.access_controls = data.access_controls.filter(
														(r) => r.id !== access_control.id
													);
												}
											});
									}}"
								></PromiseButton>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<EmptyState
				{icon}
				item_name="{access_type.toLowerCase()}ed user"
				{caption}
			>
				<AccessForm
					{data}
					{access_type}
				></AccessForm>
			</EmptyState>
		{/if}
	</div>
{/each}

<style>
	header {
		view-transition-name: var(--org);
	}
</style>
