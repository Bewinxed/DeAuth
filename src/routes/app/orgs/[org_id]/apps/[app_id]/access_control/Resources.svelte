<script lang="ts">
  import ResourceManagement from './ResourceManagement.svelte';

	import { page } from '$app/stores';
	import EmptyState from '$components/EmptyState.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import { getApplication } from '$components/data_contexts';
	import Icon from '@iconify/svelte';
	import type { Prisma } from '@prisma/client';
	import AutoForm from 'src/lib/components/AutoForm.svelte';
	import { get_svetch } from 'src/lib/context';
	import { customDispatch } from 'src/lib/utils/event_helpers';
	import toast from 'svelte-french-toast';
	import ModalButton from '../ModalButton.svelte';
	export let resources: Prisma.AppResourcesGetPayload<{
		include: {
			permissions: true;
		};
	}>[];
	export let roles: Prisma.app_roleGetPayload<{
		include: {
			assigned_permissions: true;
		};
	}>[];

	const application = getApplication();

	const blank_resource: (typeof resources)[number] = {
		id: 0,
		created_at: new Date(),
		updated_at: new Date(),
		key: '',
		description: '',
		application_id: $application.id,
		modified_by_user_id: $page.data.session.user.id,
		permissions: []
	};

	async function handleSubmit(e: Event) {
		// get closest form
		const form = e.target as HTMLFormElement;
		if (!form) throw new Error('form not found');
		const formData = new FormData(form);
		console.log(formData);
		// if form is valid
		if (!form.checkValidity()) {
			// if not valid, trigger html5 validation UI
			form.reportValidity();
			console.error('form invalid');
			return;
		}

		const key = formData.get('key')?.toString();
		const description = formData.get('description')?.toString();

		if (!key) throw new Error('key not found');
		if (!description) throw new Error('description not found');

		await svetch
			.put('app/orgs/:org_id/apps/:app_id/resources', {
				path: {
					app_id: $page.params.app_id,
					org_id: $page.params.org_id
				},
				body: {
					key,
					description
				}
			})
			.then((res) => {
				if (res.data) {
					// modify the item
					resources = [...resources, { ...res.data, permissions: [] }];
					customDispatch(e, 'close');
				} else {
					toast.error(res.error?.message);
					throw res.error;
				}
			});
	}

	const svetch = get_svetch();
</script>

<header
	id="{$$restProps.id}"
	class="flex flex-col place-content-start place-items-start justify-between gap-4 p-4"
>
	<div class="flex w-full justify-between">
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon
				icon="carbon:user-role"
				size="medium"
			></PrettyIcon>
			<h1 class=" text-lg font-bold">Resources</h1>
		</div>
		<div>
			<ModalButton
				icon="carbon:link"
				item_name="resource"
			>
				<Icon
					icon="carbon:add"
					class="inline"
				/>
				<svelte:fragment slot="modal">
					<form on:submit="{handleSubmit}">
						<AutoForm
							required
							fields="{['key', 'description']}"
							hidden_fields="{['application_id']}"
							object="{blank_resource}"
						/>
						<div class="modal-action">
							<button class="btn btn-primary"> Edit </button>
						</div>
					</form>
				</svelte:fragment>
			</ModalButton>
		</div>
	</div>
	<p class="text-sm italic">
		The Resource Management Section serves as a central hub for managing all the
		resources associated with a particular application within the system. A
		resource, in this context, represents a distinct entity or item within an
		application that can be accessed or manipulated through various permissions.
	</p>

	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="p-4">
	{#if resources.length === 0}
		<EmptyState
			icon="carbon:group-resource"
			item_name="resource"
		>
			<form
				class="form-control gap-4"
				on:submit|preventDefault="{handleSubmit}"
			>
				<AutoForm
					required
					fields="{['key', 'description']}"
					hidden_fields="{['application_id']}"
					object="{blank_resource}"
				/>
				<!-- <div class="modal-action"> -->
				<button class="btn btn-primary"> Create Resource </button>
				<!-- </div> -->
			</form>
		</EmptyState>
	{:else}
		<ResourceManagement bind:resources bind:roles={roles}></ResourceManagement>
	{/if}
</div>
