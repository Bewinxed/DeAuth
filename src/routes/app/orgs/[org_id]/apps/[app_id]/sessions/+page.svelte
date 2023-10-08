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
	const svetch = get_svetch();
	export let data;
	const application = getApplication();
	const sessions = writable<{
		[key: number]: Prisma.SessionGetPayload<object>[] | undefined;
	}>({ 0: data.sessions });
	let current_page = 0;
	let limit = 10;

	$: if (!$sessions[current_page]) {
		$sessions[current_page] = undefined;
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
					$sessions[current_page] = res.data;
					$sessions = $sessions;
				}
			});
	}

	onMount(() => {
		// if fulfilled, then we have the data
		// set the data
		data.promises.page_2.then((res) => {
			console.log(res);
			if (res) {
				$sessions[1] = res;
				$sessions = $sessions;
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
			<h1 class="text-xl font-bold">Active Sessions</h1>
		</div>
		<p class="text-sm italic">
			Find below all active sessions for your application, You can disable any
			session by clicking on the disable button
		</p>
	</div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="flex flex-col gap-2 p-4">
	{#each object_entries($sessions) as [sessions_page, page_sessions] (sessions_page)}
		{#if sessions_page.toString() === current_page.toString()}
			{#if page_sessions === undefined}
				<span class="loading loading-ring loading-lg"></span>
			{:else if page_sessions.length > 0}
				<div class="flex flex-wrap place-content-start gap-2">
					{#each page_sessions as session (session.id)}
						{@const session_created = new Date(Number(session.active_expires))}
						<div
							animate:flip
							transition:fly
							class="flex w-full justify-between rounded-lg border border-b-2 px-4 py-2 shadow"
						>
							<span class="inline-flex place-items-center gap-2">
								<!-- user avatar -->
								<div
									class="tooltip tooltip-primary"
									data-tip="Session ID: {session.id}"
								>
									<Icon
										icon="carbon:information"
										class=" inline text-neutral"
									/>
								</div>
								{#await svetch
									.get( 'app/orgs/:org_id/apps/:app_id/users/:user_id', { path: { app_id: $page.params.app_id, org_id: $page.params.org_id, user_id: session.user_id }, query: { id: session.user_id } } )
									.then((res) => {
										if (res.data) {
											return res.data;
										}
										throw res.error;
									})}
									<span class="loading loading-dots loading-xs"></span>
								{:then user}
									<div class="flex items-center space-x-3">
										<figure class="avatar block">
											<div class="w-8 rounded">
												<img
													src="{user.avatar_url}"
													alt="{user.id}'s avatar"
													class="avatar"
												/>
											</div>
										</figure>
										<div>
											<span class="font-bold">{user.username ?? 'User'}</span>
											<div
												class="tooltip tooltip-primary"
												data-tip="{user.id}"
											>
												<Icon
													icon="carbon:information"
													class=" inline"
												/>
											</div>

											<div class="flex gap-1">
												{#each user.member[0].role_assignments as role}
													{@const app_role = $application.app_role.find(
														(r) => r.id === role.app_role_id
													)}
													{#if app_role}
														<span
															class="badge badge-primary badge-outline badge-sm"
														>
															{app_role.name}
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
							<div class="card">
								<!-- created at -->
								<div class="flex place-content-center place-items-center gap-2">
									<!-- get session creation time using active_expires and accessTokenExpiresIn  -->
									<div
										class="tooltip tooltip-primary"
										data-tip="Created {new Date(
											session.created_at ??
												Number(session.active_expires) -
													Number(session.access_token_expires_in) * 1000
										)
											.toLocaleString(undefined, {
												dateStyle: 'short',
												timeStyle: 'short'
											})
											.toString()}"
									>
										<span class="hidden text-xs md:inline"
											>{session_created.toLocaleString(undefined, {
												dateStyle: 'short'
											})}</span
										>
										<Icon
											icon="carbon:calendar"
											class="inline"
										/>
									</div>
									<div
										class="tooltip tooltip-primary"
										data-tip="Expires {new Date(
											Number(session.active_expires)
										).toLocaleString(undefined, {
											dateStyle: 'short',
											timeStyle: 'short'
										})}"
									>
										<span class="hidden text-xs md:inline"
											>{Math.floor(
												(Number(session.active_expires) - Date.now()) /
													1000 /
													60
											)}min</span
										>

										<Icon
											icon="carbon:time"
											class="inline"
										/>
									</div>

									<div class="card-actions">
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
															id: session.id
														}
													})
													.then((res) => {
														if (res.data) {
															$application.redirect_urls =
																$application.redirect_urls.filter(
																	(r) => r.id !== session.id
																);
														}
													});
											}}"
										></PromiseButton>
									</div>
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
						<button
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
						</button>
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
					disabled="{$sessions[current_page]?.length < limit}"
					aria-disabled="{$sessions[current_page]?.length < limit}"
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
