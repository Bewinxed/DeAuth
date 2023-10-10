<script lang="ts">
	import { page } from '$app/stores';
	import EmptyState from '$components/EmptyState.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import { getApplication } from '$components/data_contexts';
	import AutoForm from 'src/lib/components/AutoForm.svelte';
	import CrudTable from 'src/lib/components/CrudTable.svelte';
	import { get_svetch } from 'src/lib/context';

	const application = getApplication();

	const svetch = get_svetch();
</script>

<header
	id="{$$restProps.id}"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex flex-col place-content-start place-items-start gap-2">
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon
				icon="carbon:user-role"
				size="medium"
			></PrettyIcon>
			<h1 class=" text-lg font-bold">User Roles</h1>
		</div>
		<p class="text-sm italic">
			By default, all members are created with the role of <span class="badge"
				>MEMBER</span
			>. You can add more roles here and it will be provided to your application
			when the user authenticates
		</p>
	</div>
	<!-- <figure class="w-4 h-4 inline text-base-content"><Icon icon="carbon:chevron-right" class="h-4 w-4"></Icon></figure> -->
</header>
<div class="p-4 flex">
	{#if $application.app_role.length === 0}
		<EmptyState
			icon="carbon:user-role"
			item_name="role"
		>
			<form class="form-control gap-4" on:submit|preventDefault={async (e) => {
				const form = e.currentTarget;
				if (!(form instanceof HTMLFormElement)) return;
				const formData = new FormData(form);
				const name = formData.get('name');
				if (!name) return;
				await svetch
					.put('app/orgs/:org_id/apps/:app_id/app_roles', {
						path: {
							app_id: $page.params.app_id,
							org_id: $page.params.org_id
						},
						body: {
							name: name.toString()
						}
					})
					.then((res) => {
						if (res.data) {
							$application.app_role = [...$application.app_role, {...res.data, app_role_assignment: [], assigned_permissions: []}];
						}
					});
			
			}}>
				<AutoForm
				object={{
					name: '',
					default_for_new_member: false,
					application_id: $page.params.app_id
				}}
				fields={['name', 'default_for_new_member']}
				hidden_fields={['application_id']}

				>
					
				</AutoForm>
				<button
					class="btn btn-primary"
					
				>
					Add Redirect
				</button>
			</form>
		</EmptyState>
	{:else}
		<CrudTable
			class="max-h-96"
			pin_cols
			
			select
			paginate
			hover
			data="{$application.app_role}"
			config="{{
				// columns: ['name', 'created_at' ],
				actions: ['create', 'delete', 'update'],
				columns: [
					'created_at',
					'name',
					'updated_at',
					'default_for_new_member'
				]
			}}"
			on:update="{async (e) => {
				const name = e.detail.data.get('name');
				if (!name) throw new Error('name is required');
				await svetch
					.put('app/orgs/:org_id/apps/:app_id/app_roles', {
						path: {
							app_id: $page.params.app_id,
							org_id: $page.params.org_id
						},
						body: {
							name: name.toString()
						}
					})
					.then((res) => {
						if (res.data) {
							// modify the item
							$application.app_role = $application.app_role.map((role) => {
								if (res.data && role.id === res.data.id) {
									return res.data;
								}
								return role;
							});
						}
					});
			}}"
			on:delete="{async (e) => {
				await svetch
					.delete('app/orgs/:org_id/apps/:app_id/app_roles', {
						path: {
							app_id: $page.params.app_id,
							org_id: $page.params.org_id
						},
						query: {
							id: e.detail.data.id
						}
					})
					.then((res) => {
						if (res.data) {
							$application.app_role = $application.app_role.filter(
								(role) => role.id !== e.detail.data.id
							);
						}
					});
			}}"
			on:create="{async (e) => {
				const name = e.detail.data.get('name');
				if (!name) return;
				await svetch
					.put('app/orgs/:org_id/apps/:app_id/app_roles', {
						path: {
							app_id: $page.params.app_id,
							org_id: $page.params.org_id
						},
						body: {
							name: name.toString()
						}
					})
					.then((res) => {
						if (res.data) {
							$application.app_role = [...$application.app_role, res.data];
						}
					});
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
				/>
			</div>
			<div class="modal-action">
				<button class="btn btn-primary"> Edit </button>
			</div>
			<svelte:fragment slot="edit">
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
					/>
				</div>
				<div class="modal-action">
					<button class="btn btn-primary"> Edit </button>
				</div>
			</svelte:fragment>
		</CrudTable>
	{/if}
</div>
