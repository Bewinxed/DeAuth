<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, onNavigate } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import { getOrganizations } from '$components/data_contexts.js';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { Svetch } from 'src/lib/api/client';
	import Icon from '@iconify/svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import EmptyState from '$components/EmptyState.svelte';
	import Modal from '$components/Modal.svelte';
	import ModalButton from './orgs/[org_id]/apps/[app_id]/ModalButton.svelte';
	import { customDispatch, formPromise } from 'src/lib/utils/event_helpers';
	import AutoForm from 'src/lib/components/AutoForm.svelte';
	import toast from 'svelte-french-toast';
	const organizations = getOrganizations();

	async function handleSubmit(e: Event) {
		e.preventDefault();
		const form = document.querySelector('#modal')?.querySelector('form');
		if (!(form instanceof HTMLFormElement)) return;
		const formData = new FormData(form);
		const name = formData.get('name') as string;
		if (!name) {
			toast.error('Name is required');
			return;
		}

		const svetch = new Svetch();
		svetch
			.post('app/orgs', {
				body: {
					name
				}
			})
			.then((res) => {
				if (res.data) {
					invalidate('user:orgs');
					customDispatch(e, 'close');
				}
			});
	}
	export let data;
	const svetch = new Svetch();
</script>

<div class="flex h-full w-full flex-col gap-4 p-4">
	<header
		class="flex justify-between"
		style:--org="page-content-header"
	>
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon icon="carbon:building"></PrettyIcon>
			<h1 class=" text-xl font-bold">Organizations</h1>
			<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
		</div>
		<div>
			{#if $organizations.length > 0}
				<ModalButton
					icon="carbon:building"
					item_name="organization"
					title="Create Organization"
					class="btn"
					tooltip="Create"
					promise="{handleSubmit}"
				>
					<Icon
						icon="carbon:add"
						class="inline"
					/>
					<svelte:fragment slot="modal">
						<form
							class="form-control gap-4"
							method="post"
							on:submit="{handleSubmit}"
						>
							<AutoForm
								button
								object="{{
									name: 'Untitled Organization'
								}}"
								fields="{['name']}"
							></AutoForm>
						</form>
					</svelte:fragment>
				</ModalButton>
			{/if}
		</div>
	</header>
	{#if $organizations.length > 0}
		<div class="flex flex-wrap place-content-start gap-2">
			{#each $organizations as organization (organization.id)}
				<div
					class:shadow-2xl="{$navigating?.to?.params?.org_id ===
						organization.id}"
					class:scale-110="{$navigating?.to?.params?.org_id ===
						organization.id}"
					animate:flip
					out:fly
					class="card card-compact w-40 border shadow-xl md:w-48"
					style:--org="org-{organization.id}"
				>
					<figure
						class="h-1/3 shadow"
						style:--org="org-image-{organization.id}"
					>
						<img
							src="https://doodleipsum.com/700/outline?i=645d2db1f8992c831b3de908271f67e0"
							alt=""
							class="h-full w-full object-cover"
						/>
					</figure>
					<div class="card-body justify-between shadow-inner">
						<h2 class="card-title font-display">
							<a
								style:--org="org-name-{organization.id}"
								href="{$page.url.pathname}/orgs/{organization.id}"
								>{organization.name ?? 'Untitled Organization'}</a
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
										.delete('app/orgs', {
											query: {
												id: organization.id
											}
										})
										.then(() => {
											invalidate('user:orgs');
										})}"
								tooltip="Delete"
								class="chonk btn !btn-square btn-error  btn-sm border"
							></PromiseButton>
							<PromiseButton
								icon="carbon:edit"
								confirm="{5}"
								promise="{() => svetch.editOrganization(organization.id)}"
								tooltip="Edit"
								class="chonk btn !btn-square btn-sm border border-neutral"
							></PromiseButton>
						</div>
					</div>
				</div>
				<!-- <div class="w-40 rounded-xl border p-2 shadow">
					<PromiseButton confirm>Test</PromiseButton>
					<h2>{organization.name}</h2>
					<p>{organization.id}</p>
					<p>{organization.owner_id}</p>
					<a class="btn-link" href="{$page.url.pathname}/orgs/{organization.id}">GoTo</a>
				</div> -->
			{/each}
		</div>
	{:else}
		<EmptyState
			form_id="create-org"
			item_name="organization"
			caption="You have no organizations. Create one now to get started, Organizations are used to group applications together, you can manage roles and add custom branding to it, as well as to individual applications."
			icon="carbon:building"
			><form
				id="create-org"
				class="form-control gap-4"
				method="post"
				on:submit|preventDefault="{handleSubmit}"
			>
				<AutoForm
					button
					object="{{
						name: 'Untitled Organization'
					}}"
					fields="{['name']}"
				></AutoForm>
			</form></EmptyState
		>
	{/if}
</div>

<style>
	header {
		view-transition-name: var(--org);
	}
	.card {
		& img {
			view-transition-name: var(--org);
		}
	}

	.card > * > h2 > a {
		view-transition-name: var(--org);
	}
</style>
