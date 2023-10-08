<script lang="ts">
	import EmptyState from '$components/EmptyState.svelte';
	import { customDispatch } from '$lib/utils/event_helpers';
	const svetch = new Svetch();

	import PrettyIcon from '$components/PrettyIcon.svelte';

	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { Svetch } from 'src/lib/api/client';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { getOrganization } from '$components/data_contexts.js';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import ModalButton from './apps/[app_id]/ModalButton.svelte';
	export let data;
	const organization = getOrganization();
	let modal_open = false;

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const form = document.querySelector('#modal')?.querySelector('form');
		if (!(form instanceof HTMLFormElement)) return;
		const formData = new FormData(form);
		const name = formData.get('name') as string;
		const svetch = new Svetch();
		svetch
			.post('app/orgs/:org_id/apps', {
				path: {
					org_id: $organization.id
				},
				body: {
					name
				}
			})
			.then((res) => {
				if (!$organization) return;
				if (res.data) {
					$organization.applications = [
						...$organization.applications,
						res.data
					];
					invalidate('user:apps');
					customDispatch(e, 'close');
				}
			});
	}
</script>

{#if $organization}
	<header
		style:--org="page-content-header"
		class="flex place-content-start place-items-center justify-between gap-2 p-4"
	>
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon icon="icon-park-outline:api-app"></PrettyIcon>
			<h1 class="text-xl font-bold">Applications</h1>
		</div>
		<div>
			<ModalButton
				icon="carbon:link"
				item_name="application"
				title="Create Application"
				class="btn btn-sm"
				tooltip="Create"
			>
				<Icon
					icon="carbon:add"
					class="inline"
				/>
				<svelte:fragment slot="modal">
					<form
						method="post"
						class="form-control gap-4"
						on:submit="{handleSubmit}"
					>
						<label
							class="label"
							for="name"
						>
							<span class="label-text capitalize">name</span>
						</label>
						<input
							type="text"
							name="name"
							placeholder=""
							class="input input-bordered"
							value="Untitled Application"
						/>
						<button
							class="btn btn-primary w-full place-self-center justify-self-center"
						>
							Create Application
						</button>
					</form>
				</svelte:fragment>
			</ModalButton>
		</div>
		<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
	</header>

	<div class="flex flex-col gap-4 p-4">
		{#if $organization.applications.length > 0}
			<div class="flex flex-wrap place-content-start gap-2">
				{#each $organization?.applications as application (application.id)}
					<div
						animate:flip
						out:fly
						class="card card-compact border bg-base-100 shadow-xl md:w-48"
						style:--org="app-{application.id}"
					>
						<figure
							class="h-1/3 shadow"
							style:--org="app-image-{application.id}"
						>
							<img
								src="https://doodleipsum.com/700/abstract?i=bca1e8588e68e8c73a6b721edae668c9"
								alt=""
								class="h-full w-full object-cover"
							/>
						</figure>
						<div class="card-body justify-between shadow-inner">
							<h2 class="card-title">
								<a
									style:--org="app-name-{application.id}"
									href="{$page.url.pathname}/apps/{application.id}"
									>{application.name ?? 'Untitled Application'}</a
								>
							</h2>
							<!-- <p>{organization.s}</p> -->
							<div class="card-actions justify-end">
								<!-- PromiseButton for edit/delete -->
								<PromiseButton
									icon="carbon:trash-can"
									grace="{2}"
									confirm="{2}"
									promise="{() =>
										svetch
											.delete('app/orgs/:org_id/apps', {
												query: {
													id: application.id,
													org_id: $organization.id
												},
												path: {
													org_id: $organization.id.toString()
												}
											})
											.then((res) => {
												if (!res.ok) {
													throw res.error;
												}
												invalidate('user:apps');
											})}"
									tooltip="Delete"
									class="btn btn-error btn-sm"
								></PromiseButton>
								<ModalButton
									title="Edit Application"
									class="btn btn-sm"
									tooltip="Edit"
									icon="carbon:edit"
									item_name="application"
								>
									<Icon
										icon="carbon:edit"
										class=" inline"
									/>
									<svelte:fragment slot="modal">
										<form
											method="post"
											class="form-control gap-4"
										>
											<label for="name">Name</label>
											<div class="form-control">
												<label
													class="label"
													for="name"
												>
													<span class="label-text capitalize">name</span>
												</label>
												<input
													type="text"
													name="name"
													placeholder=""
													class="input input-bordered"
													value="Untitled Application"
												/>
											</div>
											<button
												class="btn btn-primary"
												on:click="{async (e) => {
													if (!$organization) return;
													if (!e.target) return;
													const form = e.target.closest('form');
													e.preventDefault();
													await svetch
														.patch('app/orgs/:org_id/apps', {
															query: {
																id: application.id,
																org_id: $organization.id
															},
															path: {
																org_id: $organization.id.toString()
															},
															body: {
																name: form.name.value
															}
														})
														.then((res) => {
															if (!$organization) return;
															if (res.data) {
																$organization.applications =
																	$organization.applications.map((a) => {
																		if (a.id === application.id) {
																			return { ...a, name: form.name.value };
																		}
																		return a;
																	});
																customDispatch(e, 'close');
															}
														});
												}}"
											>
												Create Application
											</button>
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
				item_name="application"
				icon="icon-park-outline:api-app"
				><form
					class="form-control gap-4"
					method="post"
					use:enhance="{({
						formElement,
						formData,
						action,
						cancel,
						submitter
					}) => {
						// `formElement` is this `<form>` element
						// `formData` is its `FormData` object that's about to be submitted
						// `action` is the URL to which the form is posted
						// calling `cancel()` will prevent the submission
						// `submitter` is the `HTMLElement` that caused the form to be submitted
						return async ({ result, update }) => {
							invalidate('user:apps');
							invalidate('user:orgs');

							// `result` is an `ActionResult` object
							// `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
						};
					}}"
				>
					<div class="form-control">
						<label
							class="label"
							for="name"
						>
							<span class="label-text capitalize">name</span>
						</label>
						<input
							type="text"
							name="name"
							placeholder=""
							class="input input-bordered"
							value="Untitled Application"
						/>
					</div>
					<button class="btn btn-primary"> Create Application </button>
				</form></EmptyState
			>
		{/if}
	</div>
{:else}
	<p>No organization found</p>
{/if}

<style>
	header {
		view-transition-name: var(--org);
	}
	div > * > figure {
		view-transition-name: var(--org);
	}
	div > * > h2 > a {
		view-transition-name: var(--org);
	}
</style>
