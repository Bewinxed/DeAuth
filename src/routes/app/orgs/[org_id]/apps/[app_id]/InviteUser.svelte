<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import type { Prisma } from '@prisma/client';
	import ContextMenu from 'src/lib/components/ContextMenu.svelte';
	import { get_svetch } from 'src/lib/context';
	import { customDispatch } from 'src/lib/utils/event_helpers';
	import { object_entries } from 'src/lib/utils/object_helpers';
	import { provider_icons, trim_id } from 'src/lib/utils/ui_helpers';
	import toast from 'svelte-french-toast';
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	const svetch = get_svetch();
	const member_search_results = writable<
		| Prisma.MemberGetPayload<{
				include: {
					user: {
						select: {
							username: true;
							avatar_url: true;
							key: {
								select: {
									id: true;
								};
							};
						};
					};
				};
		  }>[]
		| undefined
	>(undefined);

	let provider: string | undefined;
	let account_id: string | undefined;

	$: if (account_id && account_id.length > 3) {
		svetch
			.get('app/orgs/:org_id/members', {
				path: {
					org_id: $page.params.org_id
				},
				query: {
					query: account_id,
					limit: 10,
					skip: 0
				}
			})
			.then((res) => {
				if (res.data) {
					member_search_results.set(res.data);
				}
			});
	}

	async function handleFormSubmit(e: Event) {
		if (e.target instanceof HTMLFormElement) {
			if (!e.target.checkValidity()) throw new Error('Invalid form');
		}
		if (!provider) throw new Error('No provider selected');
		if (!account_id) throw new Error('No account id provided');
		svetch
			.put('app/orgs/:org_id/apps/:app_id/invites', {
				path: {
					app_id: $page.params.app_id,
					org_id: $page.params.org_id
				},
				body: {
					key_id,
					from_user_id: $page.data.session.user.userId
				}
			})
			.then(async (res) => {
				if (res.data) {
					toast.success(`Invite sent to ${res.data.username ?? account_id}`, {
						// icon: res.data.avatar_url
					});
				}
				if (res.error) {
					toast.error(res.error.message);
				}
			});
	}

	$: key_id = `${provider}:${account_id}`;
</script>

<form
	class="form-control gap-4"
	on:submit|preventDefault="{handleFormSubmit}"
>
	<div class="form-control">
		<label
			class="label"
			for="provider"
		>
			<span class="label-text capitalize">account provider</span>
		</label>
		<ul
			id="provider"
			class="menu dropdown dropdown-open rounded-box z-[1] w-52 gap-1 border bg-base-100 p-2 shadow"
		>
			{#each object_entries(provider_icons) as [oauth_provider, icon] (oauth_provider)}
				<li>
					<button
						class:active="{oauth_provider === provider}"
						class="flex place-content-start place-items-center gap-2"
						on:click|preventDefault="{() => {
							provider = oauth_provider;
						}}"
					>
						<Icon
							{icon}
							class="h-4 w-4"
						></Icon>
						<span class="capitalize">{oauth_provider.replace('_', ' ')}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
	<div class="form-control">
		<label
			class="label"
			for="account_id"
		>
			<span class="label-text capitalize">Account ID</span>
		</label>
		<input
			type="text"
			name="account_id"
			class="input input-bordered"
			bind:value="{account_id}"
		/>
		{#key account_id}
			{#if account_id && account_id.length > 3}
				<div
					class="h-24"
					transition:slide="{{ axis: 'y' }}"
				>
					<ContextMenu open>
						<svelte:fragment slot="menu"
							>{#if !$member_search_results}
								<span class="loading loading-dots loading-xs"></span>
							{:else if $member_search_results.length === 0}
								<li class="btn-disabled">
									<!-- icon -->
									<span class="text-base-content"
										><Icon
											icon="carbon:border-none"
											class="inline"
										/> No results</span
									>
								</li>
							{:else}
								{#each $member_search_results as member (member.id)}
									<li>
										<button
											class="flex place-content-start place-items-center gap-2"
											on:click|preventDefault="{(e) => {
												[provider, account_id] =
													member.user.key[0].id.split(':');
												customDispatch(e, 'select');
											}}"
										>
											<img
												src="{member.user.avatar_url}"
												alt=""
												class="h-8 w-8 rounded-full"
											/>
											<span class="capitalize"
												>{member.user.username ?? trim_id(member.id)}</span
											>
										</button>
									</li>
								{/each}
							{/if}</svelte:fragment
						>
					</ContextMenu>
				</div>
			{:else if account_id && account_id.length > 0}{/if}
		{/key}
	</div>
	{#if $member_search_results}
		{@const is_found = $member_search_results.find(
			(member) => member.user.key[0].id === key_id
		)}
		<div class="form-group">
			<button
				class:btn-disabled="{!is_found}"
				type="submit"
				class="btn btn-primary"
			>
				{is_found ? 'Invite' : 'Search First'}
			</button>
		</div>
	{/if}
</form>
