<script lang="ts">
	import { page } from '$app/stores';
	import EmptyState from '$components/EmptyState.svelte';
	import PrettyIcon from '$components/PrettyIcon.svelte';
	import PromiseButton from '$components/PromiseButton.svelte';
	import { getApplication } from '$components/data_contexts';
	import Icon from '@iconify/svelte';
	import { get_svetch } from 'src/lib/context';
	import { customDispatch } from 'src/lib/utils/event_helpers';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import ModalButton from '../ModalButton.svelte';

	const application = getApplication();

	const svetch = get_svetch();

	let permission_name = '';
	let permission_key = '';
	let permission_description = '';
</script>

<header
	id="{$$restProps.id}"
	class="flex place-content-start place-items-center justify-between gap-2 p-4"
>
	<div class="flex flex-col place-content-start place-items-start gap-2">
		<div class="flex place-content-start place-items-center gap-2">
			<PrettyIcon icon="carbon:user-role"></PrettyIcon>
			<h1 class=" text-xl font-bold">User Roles</h1>
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
<div class="p-4">
	{#if $application.app_role.length === 0}
		
		<EmptyState
			icon="carbon:user-role"
			item_name="role"
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
				/>
				<button
					class="btn btn-primary"
					on:click|preventDefault="{async (e) => {
						const form = document
							.querySelector('#modal')
							?.querySelector('form');
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
									$application.app_role = [...$application.app_role, res.data];
								}
							});
					}}"
				>
					Add Redirect
				</button>
			</form>
		</EmptyState>
	{:else}
		<div class="flex flex-wrap place-content-start gap-2">
			{#each $application.app_role as app_role (app_role.id)}
				<div
					animate:flip
					transition:fly
					class="flex w-full justify-between rounded-lg border border-b-2 px-4 py-2 shadow"
				>
					<span class="inline-flex place-items-center gap-2">
						<Icon
							icon="carbon:link"
							class="mr-1 inline"
						/>
						{app_role.name}
					</span>
					<!-- created at -->
					<div class="card">
						<div class="flex place-content-center place-items-center gap-2">
							<p class="text-sm italic">
								Created: {app_role.created_at.toLocaleString(undefined, {
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
											.delete('app/orgs/:org_id/apps/:app_id/app_roles', {
												path: {
													app_id: $page.params.app_id,
													org_id: $page.params.org_id
												},
												query: {
													id: app_role.id
												}
											})
											.then((res) => {
												if (res.data) {
													$application.app_role = $application.app_role.filter(
														(r) => r.id !== app_role.id
													);
												}
											});
									}}"
								></PromiseButton>
								<ModalButton
									title="Edit Role"
									class="btn btn-sm"
									tooltip="{'edit'}"
									icon="carbon:edit"
									item_name="role"
								>
									<Icon
										icon="carbon:edit"
										class=" inline"
									/>
									<svelte:fragment slot="modal">
										<form
											class="form-control gap-4"
											on:submit|preventDefault="{(e) => {
												const form = document
													.querySelector('#modal')
													?.querySelector('form');
												if (!(form instanceof HTMLFormElement)) return;
												const formData = new FormData(form);
												const name = formData.get('name');
												if (!name) return;
												svetch
													.patch('app/orgs/:org_id/apps/:app_id/app_roles', {
														path: {
															app_id: $page.params.app_id,
															org_id: $page.params.org_id
														},
														query: {
															id: app_role.id
														},
														body: {
															id: app_role.id,
															name: name.toString()
														}
													})
													.then((res) => {
														if (res.data) {
															$application.app_role = $application.app_role.map(
																(r) => {
																	if (r.id === app_role.id) {
																		return { ...r, name: app_role.name };
																	}
																	return r;
																}
															);
															customDispatch(e, 'close');
														}
													});
											}}"
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
												bind:value="{app_role.name}"
											/>
											<button class="btn btn-primary"> Edit </button>
										</form>
									</svelte:fragment>
								</ModalButton>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
