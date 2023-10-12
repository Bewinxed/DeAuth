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
	import CrudTableDivs from 'src/lib/components/CrudTableDivs.svelte';
	import toast from 'svelte-french-toast';
	import { promise_toast } from 'src/lib/utils/ui_helpers';
	import AutoForm from 'src/lib/components/AutoForm.svelte';
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
						on:click|preventDefault="{async (e) => {
							const form = e.currentTarget.closest('form');
							if (!(form instanceof HTMLFormElement)) return;
							const formData = new FormData(form);
							// check form validity
							if (!form.checkValidity()) {
								form.reportValidity();
								return;
							}

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
		{@const type_overrides={
			url: 'url'
		}}
		<CrudTableDivs select
			key="id"
			{type_overrides}
			data="{$application.redirect_urls}"
			config="{{
				columns: ['created_at', 'url', 'updated_at'],
				actions: ['create', 'update', 'delete']
			}}"
			on:create="{async (e) => {
				const { data } = e.detail;
				const url = data.url;
				await promise_toast(
					svetch
						.put('app/orgs/:org_id/apps/:app_id/redirects', {
							path: {
								app_id: $page.params.app_id,
								org_id: $page.params.org_id
							},
							body: {
								url: url?.toString()
							}
						})
						.then((res) => {
							if (res.data) {
								$application.redirect_urls = [
									...$application.redirect_urls,
									res.data
								];
							}
						}),
					{
						loading: 'Adding Url',
						success: 'Added Url'
					}
				);
			}}"
			on:update="{async (e) => {
				const { data } = e.detail;
				const url = data.url;
				await promise_toast(
					svetch
						.patch('app/orgs/:org_id/apps/:app_id/redirects', {
							path: {
								app_id: $page.params.app_id,
								org_id: $page.params.org_id
							},
							query: {
								id: data.id
							},
							body: {
								id: data.id,
								url: url?.toString()
							}
						})
						.then((res) => {
							if (res.data) {
								$application.redirect_urls = $application.redirect_urls.map(
									(r) => {
										if (r.id === data.id) {
											return { ...r, url: data.url };
										}
										return r;
									}
								);
							}
						}),
					{
						loading: 'Updating Url',
						success: 'Updated Url'
					}
				);
			}}"
			on:delete="{async (e) => {
				const { data } = e.detail;
				await promise_toast(
					svetch
						.delete('app/orgs/:org_id/apps/:app_id/redirects', {
							path: {
								app_id: $page.params.app_id,
								org_id: $page.params.org_id
							},
							query: {
								id: data.id
							}
						})
						.then((res) => {
							if (res.data) {
								$application.redirect_urls = $application.redirect_urls.filter(
									(r) => r.id !== data.id
								);
							}
						}),
					{
						loading: 'Deleting Url',
						success: 'Deleted Url'
					}
				);
			}}"
		>
			<AutoForm
				object="{{
					url: ''
				}}"
				button
				{type_overrides}
				button_text="Add Redirect"
			/>
			
		</CrudTableDivs>

		
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
