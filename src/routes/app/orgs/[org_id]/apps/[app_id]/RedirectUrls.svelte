<script lang="ts">
	import { page } from '$app/stores';
	import EmptyState from '$components/EmptyState.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { getApplication } from '$components/data_contexts.js';
	import { customDispatch } from '$lib/utils/event_helpers';
	import Icon from '@iconify/svelte';
	import { Svetch } from 'src/lib/api/client.js';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import ModalButton from './ModalButton.svelte';
	const svetch = new Svetch();
	let new_redirect: string;
	const application = getApplication();
</script>

<header
	id="{$$restProps.id}"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex place-content-start place-items-center gap-2">
		<PrettyIcon icon="carbon:link"></PrettyIcon>
		<h1 class="text-xl font-bold">Redirect Urls</h1>
	</div>
	<div>
		<ModalButton
			icon="carbon:link"
			item_name="redirect url"
		>
			<Icon
				icon="carbon:add"
				class="inline"
			/>
			<svelte:fragment slot="modal"
				><form class="form-control gap-4">
					<input
						type="url"
						name="name"
						placeholder=""
						class="input input-bordered"
						bind:value="{new_redirect}"
					/>
					<button
						class="btn btn-primary"
						on:click="{async (e) => {
							await svetch
								.put('app/orgs/:org_id/apps/:app_id/redirects', {
									path: {
										app_id: $page.params.app_id,
										org_id: $page.params.org_id
									},
									body: {
										url: new_redirect
									}
								})
								.then((res) => {
									if (res.data) {
										$application.redirect_urls = [
											...$application.redirect_urls,
											res.data
										];
									}
									customDispatch(e, 'close');
								});
						}}"
					>
						Add Redirect
					</button>
				</form></svelte:fragment
			>
		</ModalButton>
	</div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="p-4">
	{#if $application.redirect_urls.length > 0}
		<div class="flex place-content-start gap-2">
			{#each $application.redirect_urls as redirect (redirect.id)}
				<div
					animate:flip
					transition:fly
					class="flex justify-between rounded-lg border border-b-2 px-4 py-2 shadow"
				>
					<span class="break-all">
						<Icon
							icon="carbon:link"
							class="inline"
						/>
						{redirect.url}
					</span>
					<!-- created at -->
					<div class="flex place-content-center place-items-center gap-2">
						<p class="text-sm italic">
							Created: {redirect.created_at.toLocaleString(undefined, {
								dateStyle: 'short',
								timeStyle: 'short'
							})}
						</p>
						<div class="card-actions">
							<PromiseButton
								icon="carbon:trash-can"
								square
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
												id: redirect.id
											}
										})
										.then((res) => {
											if (res.data) {
												$application.redirect_urls =
													$application.redirect_urls.filter(
														(r) => r.id !== redirect.id
													);
											}
										});
								}}"
							></PromiseButton>
							<ModalButton
								title="Edit Redirect"
								class="btn btn-sm"
								tooltip="{'edit'}"
								icon="carbon:edit"
								item_name="redirect url"
							>
								<Icon
									icon="carbon:edit"
									class=" inline"
								/>
								<svelte:fragment slot="modal">
									<form
										class="form-control gap-4"
										on:submit|preventDefault="{(e) => {
											const form = e.currentTarget;
											const formData = new FormData(form);
											const url = formData.get('url');
											if (!url) {
												throw new Error('No url');
											}

											svetch
												.patch('app/orgs/:org_id/apps/:app_id/redirects', {
													path: {
														app_id: $page.params.app_id,
														org_id: $page.params.org_id
													},
													query: {
														id: redirect.id
													},
													body: {
														id: redirect.id,
														url: url?.toString()
													}
												})
												.then((res) => {
													if (res.data) {
														$application.redirect_urls =
															$application.redirect_urls.map((r) => {
																if (r.id === redirect.id) {
																	return { ...r, url: redirect.url };
																}
																return r;
															});
														customDispatch(e, 'close');
													}
												});
										}}"
									>
										<label
											class="label"
											for="url"
										>
											<span class="label-text capitalize">url</span>
										</label>
										<input
											type="text"
											name="url"
											placeholder=""
											class="input input-bordered"
											bind:value="{redirect.url}"
										/>
										<button class="btn btn-primary"> Edit </button>
									</form>
								</svelte:fragment>
							</ModalButton>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
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
				<input
					type="url"
					name="name"
					placeholder=""
					class="input input-bordered"
					bind:value="{new_redirect}"
				/>
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
									url: new_redirect
								}
							})
							.then((res) => {
								if (res.data) {
									$application.redirect_urls = [
										...$application.redirect_urls,
										res.data
									];
								}
							});
					}}"
				>
					Add Redirect
				</button>
			</form>
		</EmptyState>
	{/if}
</div>

<style>
	header {
		view-transition-name: var(--org);
	}
</style>
