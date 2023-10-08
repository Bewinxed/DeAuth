<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import type { Prisma } from '@prisma/client';
	import EmptyState from 'src/lib/components/EmptyState.svelte';
	import PrettyIcon from 'src/lib/components/PrettyIcon.svelte';
	import PromiseButton from 'src/lib/components/PromiseButton.svelte';
	import { getApplication } from 'src/lib/components/data_contexts.js';
	import { get_svetch } from 'src/lib/context.js';
	import { flip } from 'svelte/animate';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import ModalButton from '../ModalButton.svelte';
	import { object_entries } from 'src/lib/utils/object_helpers';
	import { onMount } from 'svelte';
	import { goto, invalidate } from '$app/navigation';
	const svetch = get_svetch();
	export let data;
	const application = getApplication();
	const users = writable<{
		[key: number]:
			| Prisma.MemberGetPayload<{
					include: {
						user: true;
					};
			  }>[]
			| undefined;
	}>({ 0: data.users });
	let current_page = 0;
	let limit = 10;

	$: if (!$users[current_page]) {
		$users[current_page] = undefined;
		svetch
			.get('app/orgs/:org_id/apps/:app_id/sessions', {
				path: {
					app_id: $page.params.app_id,
					org_id: $page.params.org_id
				},
				query: {
					skip: (current_page * limit).toString(),
					limit: limit.toString()
				}
			})
			.then((res) => {
				if (res.data) {
					$users[current_page] = res.data;
					$users = $users;
				}
			});
	}

	onMount(() => {
		// if fulfilled, then we have the data
		// set the data
		data.promises.page_2.then((res) => {
			console.log(res);
			if (res) {
				$users[1] = res;
				$users = $users;
			}
		});
	});
</script>

<header
	style:--org="app-setting-header"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex flex-col place-content-start place-items-start gap-2">
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon icon="carbon:virtual-column-key"></PrettyIcon>
			<h1 class="text-xl font-bold">Users</h1>
		</div>
		<p class="text-sm italic">
			Find below all users for your application, Add or remove roles or delete
			users.
		</p>
	</div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="flex flex-col gap-2 p-4">
	{#each object_entries($users) as [member_page, members] (member_page)}
		{#if member_page.toString() === current_page.toString()}
			{#if members === undefined}
				<span class="loading loading-ring loading-lg"></span>
			{:else if members.length > 0}
				<div class="flex flex-wrap place-content-start gap-2">
					{#each members as member, user_index (member.id)}
						<div
							animate:flip
							transition:fly
							class="flex w-full flex-wrap justify-between rounded-lg border border-b-2 px-4 py-2 shadow"
						>
							<span class="inline-flex place-items-center gap-2">
								<!-- user avatar -->
								<div
									class="tooltip tooltip-primary"
									data-tip="User ID: {member.id}"
								>
									<Icon
										icon="carbon:information"
										class=" inline text-neutral"
									/>
								</div>
								{#await svetch
									.get( 'app/orgs/:org_id/apps/:app_id/members/:member_id', { path: { app_id: $page.params.app_id, org_id: $page.params.org_id, member_id: member.user.id } } )
									.then((res) => {
										if (res.data) {
											return res.data;
										}
										throw res.error;
									})}
									<span class="loading loading-dots loading-xs"></span>
								{:then member}
									<div class="flex items-center space-x-3">
										<figure class="avatar block">
											<div class="w-8 rounded">
												<img
													src="{member.user.avatar_url}"
													alt="{member.id}'s avatar"
													class="avatar"
												/>
											</div>
										</figure>
										<div>
											<span class="font-bold">{member.user.username ?? 'User'}</span>
											<div
												class="tooltip tooltip-primary"
												data-tip="{member.id}"
											>
												<Icon
													icon="carbon:information"
													class=" inline"
												/>
											</div>

											<div class="flex gap-1">
												{#each member.role_assignments as role}
													{@const app_role = $application.app_role.find(
														(r) => r.id === role.app_role_id
													)}
													{#if app_role}
														<span class="badge badge-primary badge-outline">
															{app_role.name}
															<button
																class="contents"
																on:click="{() => {
																	svetch
																		.delete(
																			'app/orgs/:org_id/apps/:app_id/members/:member_id/roles/:role_id',
																			{
																				path: {
																					app_id: $page.params.app_id,
																					org_id: $page.params.org_id,
																					role_id: role.id.toString(),
																					member_id: member.id
																				}
																			}
																		)
																		.then((res) => {
																			if (res.data) {
																				invalidate('app:users');
																			}
																		});
																}}"
															>
																<Icon
																	icon="carbon:close"
																	class="inline rounded-full bg-error text-white"
																/>
															</button>
														</span>
													{/if}
												{/each}
											</div>
										</div>
									</div>
								{:catch error}
									<Icon
										icon="carbon:user-x-ray"
										class="inline text-error"
									/>
								{/await}
							</span>

							<!-- created at -->
							<div
								class="flex place-content-center place-items-center justify-end gap-2"
							>
								<!-- get session creation time using active_expires and accessTokenExpiresIn  -->
								<div
									class="tooltip tooltip-primary"
									data-tip="Created {member.created_at

										.toLocaleString(undefined, {
											dateStyle: 'short',
											timeStyle: 'short'
										})
										.toString()}"
								>
									<span class="hidden text-xs md:inline"
										>{member.created_at.toLocaleString(undefined, {
											dateStyle: 'short'
										})}</span
									>
									<Icon
										icon="carbon:calendar"
										class="inline"
									/>
								</div>

								<div class="card-actions">
									<!-- impersonation button  -->
									<PromiseButton
										icon="carbon:user-role"
										class="btn btn-sm"
										tooltip="{'impersonate'}"
										promise="{async () => {
											await fetch(
												`${$page.url.pathname}/${member.user_id}/impersonate`
											)
												// handle redirect
												.then((res) => {
													if (res.redirected) {
														// handle redirect
														goto(res.url);
													}
												});
										}}"
									></PromiseButton>
									<PromiseButton
										icon="carbon:trash-can"
										class="btn btn-error btn-sm"
										tooltip="{'delete'}"
										promise="{async () => {
											await svetch
												.delete('app/orgs/:org_id/apps/:app_id/redirects', {
													path: {
														app_id: $page.params.app_id,
														org_id: $page.params.org_id
													},
													query: {
														id: member.id
													}
												})
												.then((res) => {
													if (res.data) {
														$application.redirect_urls =
															$application.redirect_urls.filter(
																(r) => r.id !== member.id
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
			{:else if (current_page = 0)}
				<EmptyState
					icon="carbon:link"
					item_name="redirect url"
				>
					<form class="form-control gap-4">
						<label
							class="label"
							for="name"
						>
							<span class="label-text capitalize">name</span>
						</label>
						<!-- <input
				type="url"
				name="name"
				placeholder=""
				class="input input-bordered"
				bind:value="{new_redirect}"
			/> -->
						<!-- <button
							class="btn btn-primary"
							on:click="{async () => {
								await svetch
									.put('app/orgs/:org_id/apps/:app_id/redirects', {
										path: {
											app_id: $page.params.app_id,
											org_id: $page.params.org_id
										},
										body: {
											// url: new_redirect
										}
									})
									.then((res) => {
										if (res.data) {
											// $application.redirect_urls = [
											// ...$application.redirect_urls,
											// res.data
											// ];
										}
									});
							}}"
						>
							Add Redirect
						</button> -->
					</form>
				</EmptyState>
			{/if}
			<div class="join place-self-center">
				<button
					aria-disabled="{current_page === 0}"
					disabled="{current_page === 0}"
					class="btn join-item"
					on:click="{() => {
						current_page--;
					}}">«</button
				>
				<button class="btn join-item">Page {current_page + 1}</button>
				<button
					class="btn join-item"
					disabled="{$users[current_page]?.length < limit}"
					aria-disabled="{$users[current_page]?.length < limit}"
					on:click="{() => {
						current_page++;
						current_page = current_page;
					}}"
				>
					{#await data.promises.page_2}
						<span class="loading loading-dots loading-xs"></span>
					{:catch}
						»
					{/await}

					»</button
				>
			</div>
		{/if}
	{/each}
</div>

<style>
	header {
		view-transition-name: var(--org);
	}
</style>
