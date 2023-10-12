<script lang="ts">
	import { page } from '$app/stores';
	import figure from '$components/PrettyIcon.svelte';
	import { getApplication } from '$components/data_contexts';
	import Icon from '@iconify/svelte';
	import type { Prisma } from '@prisma/client';
	import ContextMenu from 'src/lib/components/ContextMenu.svelte';
	import { get_svetch } from 'src/lib/context';
	import { customDispatch } from 'src/lib/utils/event_helpers';
	import { object_entries } from 'src/lib/utils/object_helpers';
	import { crud_icons, promise_toast } from 'src/lib/utils/ui_helpers';
	import toast from 'svelte-french-toast';
	import { flip } from 'svelte/animate';
	import { crossfade, fly, scale } from 'svelte/transition';
	import ModalButton from '../ModalButton.svelte';
	import AutoForm from 'src/lib/components/AutoForm.svelte';
	const [send, receive] = crossfade({ ...fly, duration: 125 });
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

	async function group_role_permissions_by_resource(
		role: (typeof roles)[number]
	) {
		// for the role, group role => list of resources => list of permission that the role has for that resource
		const role_permission_map = new Map<
			(typeof resources)[number],
			(typeof role)['assigned_permissions']
		>();

		const permissionResourceMap = new Map(
			resources.flatMap((r) => r.permissions.map((p) => [p.id, r]))
		);

		for (const permission of role.assigned_permissions) {
			const resource = permissionResourceMap.get(permission.permission_id);
			if (resource) {
				if (role_permission_map.has(resource)) {
					role_permission_map.set(resource, [
						...role_permission_map.get(resource)!,
						permission
					]);
				} else {
					role_permission_map.set(resource, [permission]);
				}
			}
		}
		return role_permission_map;
	}

	async function updateRolePermissions(
		role_id: number,
		permissions: (typeof resources)[number]['permissions']
	) {
		await svetch
			.put('app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions', {
				path: {
					app_id: $page.params.app_id,
					org_id: $page.params.org_id,
					app_role_id: role_id.toString()
				},
				body: permissions
			})
			.then((res) => {
				if (res.data) {
					roles = roles.map((role) => {
						if (res.data && role.id === role_id) {
							role.assigned_permissions = [
								...role.assigned_permissions,
								...res.data
							];
						}
						return role;
					});
				} else throw res.error?.message;
			});
	}

	async function handleDropResourceOnRole(
		data: (typeof resources)[number],
		role_id: number
	) {
		if (!data.permissions.length) {
			throw 'There are no permissions to add';
		}
		// if all resource permissions are already assigned to role
		if (
			data.permissions.every(
				(p) =>
					roles.find((r) => r.id === role_id) &&
					roles
						.find((r) => r.id === role_id)
						?.assigned_permissions.find((ap) => ap.permission_id === p.id)
			)
		) {
			throw 'All permissions are already assigned to this role';
		}

		await svetch
			.put('app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions', {
				path: {
					app_id: $page.params.app_id,
					org_id: $page.params.org_id,
					app_role_id: role_id.toString()
				},
				body: data.permissions
			})
			.then((res) => {
				if (res.data) {
					roles = roles.map((role) => {
						if (res.data && role.id === role_id) {
							role.assigned_permissions = res.data.map((p) => {
								const existing = role.assigned_permissions.find(
									(ap) => ap.permission_id === p.permission_id
								);
								if (existing) {
									return existing;
								}
								return p;
							});
						}
						return role;
					});
				} else throw res.error?.message;
			});
		console.log(data);
	}

	async function handleDropPermissionOnRole(
		data: (typeof resources)[number]['permissions'][number] & {
			app_role_id: number;
		},
		role_id: number
	) {
		if (roles.find((r) => r.id === role_id)) {
			// check if resource is already assigned to role
			if (
				roles
					.find((r) => r.id === role_id)
					?.assigned_permissions.find((p) => p.permission_id === data.id)
			) {
				throw 'Resource is already assigned to role';
			}
		} else {
			throw 'Role does not exist';
		}

		await svetch
			.put('app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions', {
				path: {
					app_id: $page.params.app_id,
					org_id: $page.params.org_id,
					app_role_id: role_id.toString()
				},
				body: [data]
			})
			.then((res) => {
				if (res.data) {
					roles = roles.map((r) => {
						if (res.data && r.id === role_id) {
							r.assigned_permissions = [...r.assigned_permissions, ...res.data];
						}
						return r;
					});
				} else throw res.error?.message;
			});
		console.log(data);
	}

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

<div class="p-2 text-sm">
	<span
		>Drag a resource to a role to assign all the resource permissions to that
		role, drag a permission to a role to assign that permission to that role</span
	>
</div>
<div class="flex flex-col gap-2 sm:flex-row">
	<ul class="menu menu-sm w-full rounded-lg border bg-base-100 shadow-md">
		<div
			class="place-contents-center flex place-items-center justify-between gap-2 border-b p-1 text-lg font-semibold"
		>
			<h1 class="place-contents-center flex place-items-center gap-[inherit]">
				<Icon
					icon="carbon:software-resource"
					class=" inline"
				/>
				Resources
			</h1>
			<ModalButton
				icon="carbon:link"
				item_name="resource"
				tooltip="create a new resource"
				class="btn btn-square btn-xs"
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
							object="{{
								id: 0,
								created_at: new Date(),
								updated_at: new Date(),
								key: '',
								description: '',
								application_id: $application.id,
								modified_by_user_id: $page.data.session.user.id,
								permissions: []
							}}"
						/>
						<div class="modal-action">
							<button class="btn btn-primary"> Edit </button>
						</div>
					</form>
				</svelte:fragment>
			</ModalButton>
		</div>

		{#each resources as resource}
			<li class="justify-start">
				<div
					class="justify-start gap-1 px-1"
					role="listitem"
					draggable="{true}"
					on:dragstart="{(e) => {
						e.dataTransfer?.setData(
							'text/plain',
							JSON.stringify({ action: 'resource_to_role', data: resource })
						);
						if (!e.dataTransfer) return;
						e.dataTransfer.dropEffect = 'link';
						console.log('set to link');
					}}"
				>
					<ContextMenu
						hover
						title="Add Operation"
						class="btn btn-ghost btn-xs "
					>
						<Icon
							icon="carbon:overflow-menu-horizontal"
							class="h-4 w-4"
						></Icon>
						<svelte:fragment slot="menu">
							{#each object_entries(crud_icons).filter(([key, icon]) => !resource.permissions.find((p) => p.operation === key)) as [key, icon] (key)}
								<li
									animate:flip
									out:send="{{ key: `${resource.id}-${key}` }}"
								>
									<button
										class="capitalize"
										on:click="{async () => {
											await svetch
												.put(
													'app/orgs/:org_id/apps/:app_id/resources/:resource_id',
													{
														path: {
															app_id: $page.params.app_id,
															org_id: $page.params.org_id,
															resource_id: resource.id.toString()
														},
														body: {
															operation: key
														}
													}
												)
												.then((res) => {
													if (res.data) {
														resources = resources.map((r) => {
															if (res.data && r.id === res.data.resource_id) {
																r.permissions = [...r.permissions, res.data];
															}
															return r;
														});
													}
												});
										}}"
									>
										<figure class="btn btn-xs">
											<Icon
												{icon}
												class="h-4 w-4"
											></Icon>
										</figure>
										{key}
									</button>
								</li>
							{/each}
							<li class="mt-1 border-t border-t-error text-error">
								<button
									class="rounded-t-none"
									on:click="{async () => {
										await svetch
											.delete('app/orgs/:org_id/apps/:app_id/resources', {
												path: {
													app_id: $page.params.app_id,
													org_id: $page.params.org_id
												},
												query: {
													id: resource.id.toString()
												}
											})
											.then((res) => {
												if (res.data) {
													resources = resources.filter(
														(r) => r.id !== resource.id
													);
												}
											});
									}}"
								>
									<Icon
										icon="carbon:trash-can"
										class="h-4 w-4"
									/>
									Delete
								</button>
							</li>
						</svelte:fragment>
					</ContextMenu>
					<a
						class="inline-flex place-content-center place-items-center gap-1"
						href="{void 0}"
					>
						{resource.key}
					</a>
				</div>

				<ul>
					{#each resource.permissions as permission, i (`permission-${permission.id}`)}
						<li
							animate:flip
							out:send="{{ key: `${resource.id}-${permission.operation}` }}"
							in:receive="{{ key: `${resource.id}-${permission.operation}` }}"
							class="justify-start"
						>
							<a
								draggable="{true}"
								on:dragstart="{(e) => {
									e.dataTransfer?.setData(
										'text/plain',
										JSON.stringify({
											action: 'permission_to_role',
											data: permission
										})
									);
									if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
								}}"
								class="inline-flex w-32 justify-start gap-1 px-1"
								href="{void 0}"
							>
								<ContextMenu
									hover
									title="Resource"
									class="btn btn-ghost btn-xs "
								>
									<Icon
										icon="carbon:overflow-menu-horizontal"
										class="h-4 w-4"
									></Icon>
									<svelte:fragment slot="menu">
										<li>
											<a
												class="mb-1"
												href="{void 0}"
											>
												<Icon
													icon="carbon:edit"
													class="h-4 w-4"
												/>
												Edit
											</a>
										</li>
										<li class="text-error">
											<button
												class="capitalize"
												on:click="{async () => {
													await svetch
														.delete(
															'app/orgs/:org_id/apps/:app_id/resources/:resource_id',
															{
																path: {
																	app_id: $page.params.app_id,
																	org_id: $page.params.org_id,
																	resource_id: resource.id.toString()
																},
																query: {
																	id: permission.id.toString()
																}
															}
														)
														.then((res) => {
															if (res.data) {
																resources = resources.map((r) => {
																	if (res.data && r.id === resource.id) {
																		r.permissions = r.permissions.filter(
																			(p) => p.id !== permission.id
																		);
																	}
																	return r;
																});
															} else {
																toast.error(res.error.message);
																throw res.error;
															}
														});
												}}"
											>
												<Icon
													icon="carbon:trash-can"
													class="h-4 w-4"
												/>
												Delete
											</button>
										</li>
									</svelte:fragment>
								</ContextMenu>
								<div>
									<div class="badge badge-outline badge-md gap-1 font-mono">
										<Icon
											icon="{crud_icons[permission.operation]}"
											class="inline"
										/>
										{permission.operation}
									</div>
								</div>
							</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>

	<ul class="menu menu-sm w-full rounded-lg border bg-base-100 shadow-md">
		<div
			class="place-contents-center flex place-items-center justify-between gap-2 border-b p-1 text-lg font-semibold"
		>
			<h1 class="place-contents-center flex place-items-center gap-[inherit]">
				<Icon
					icon="carbon:user-role"
					class=" inline"
				/>
				Roles
			</h1>
			<ModalButton
				icon="carbon:link"
				item_name="role"
				class="btn btn-square btn-xs"
			>
				<svelte:fragment slot="modal">
					<form
						class="form-control gap-4"
						on:submit|preventDefault="{async (e) => {
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
										$application.app_role = [
											...$application.app_role,
											{
												...res.data,
												app_role_assignment: [],
												assigned_permissions: []
											}
										];
									}
								});
						}}"
					>
						<AutoForm
							object="{{
								name: '',
								default_for_new_member: false,
								application_id: $page.params.app_id
							}}"
							fields="{['name', 'default_for_new_member']}"
							hidden_fields="{['application_id']}"
						></AutoForm>
						<button class="btn btn-primary"> Add Redirect </button>
					</form>
				</svelte:fragment>
				<Icon
					icon="carbon:add"
					class="inline"
				/>
			</ModalButton>
		</div>
		{#each roles as role, i}
			{#await group_role_permissions_by_resource(role) then role_permissions_groupby_resource}
				<li class="transition-colors aria-[dropEffect=link]:hover">
					<div
						class="justify-start gap-1 px-1"
						role="listitem"
						on:dragenter="{(e) => {
							// prevent pointer events on child elements
							e.currentTarget.classList.add('btn-neutral');
							e.currentTarget.classList.add('text-neutral-contents');
						}}"
						on:dragover|preventDefault="{(e) => {
							// prevent pointer events on child elements
							e.currentTarget.classList.add('btn-neutral');
							e.currentTarget.classList.add('text-neutral-contents');
						}}"
						on:dragleave="{(e) => {
							// timeout

							e.currentTarget.classList.remove('btn-neutral');
							e.currentTarget.classList.remove('text-neutral-contents');
						}}"
						on:drop|preventDefault="{async (e) => {
							if (e.dataTransfer) {
								const { action, data } = JSON.parse(
									e.dataTransfer.getData('text/plain')
								);
								const permissions =
									action === 'resource_to_role' ? data.permissions : [data];
								await promise_toast(
									updateRolePermissions(role.id, permissions),
									{
										loading: `Adding ${
											action === 'resource_to_role' ? 'resource' : 'permission'
										} to role...`,
										success: `${
											action === 'resource_to_role' ? 'Resource' : 'Permission'
										} added to role`
									}
								);
							}
							e.dataTransfer?.clearData();
							e.currentTarget.classList.remove('btn-neutral');
							e.currentTarget.classList.remove('text-neutral-contents');
						}}"
					>
						<ContextMenu
							hover
							title="Role"
							class="btn btn-ghost btn-xs "
						>
							<Icon
								icon="carbon:overflow-menu-horizontal"
								class="h-4 w-4"
							></Icon>
							<svelte:fragment slot="menu">
								<li>
									<a href="{void 0}">
										<Icon
											icon="carbon:edit"
											class="h-4 w-4"
										/>
										Edit
									</a>
								</li>
								<li class="text-error">
									<button
										class="capitalize"
										on:click="{async () => {
											await svetch
												.delete('app/orgs/:org_id/apps/:app_id/app_roles', {
													path: {
														app_id: $page.params.app_id,
														org_id: $page.params.org_id
													},
													query: {
														id: role.id.toString()
													}
												})
												.then((res) => {
													if (res.data) {
														roles = roles.filter((r) => r.id !== role.id);
													} else throw res.error;
												});
										}}"
									>
										<Icon
											icon="carbon:trash-can"
											class="h-4 w-4"
										/>
										Delete
									</button>
								</li></svelte:fragment
							>
						</ContextMenu>
						{role.name}
					</div>
					<ul>
						{#each role_permissions_groupby_resource.entries() as [resource, role_permissions] (`resource-${resource.id}`)}
							<li class="justify-start">
								{#if resource}
									<a href="{void 0}">
										<ContextMenu
											hover
											title="{role.name}:{resource.key}"
											class="btn btn-ghost btn-xs "
										>
											<Icon
												icon="carbon:overflow-menu-horizontal"
												class="h-4 w-4"
											></Icon>
											<svelte:fragment slot="menu">
												<li>
													<a href="{void 0}">
														<Icon
															icon="carbon:edit"
															class="h-4 w-4"
														/>
														Edit
													</a>
												</li>
												<li class="text-error">
													<button
														class="capitalize"
														on:click="{async () => {
															const permissions_to_delete =
																role_permissions.map((p) => p.id);
															await promise_toast(
																svetch
																	.delete(
																		'app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions',
																		{
																			path: {
																				app_id: $page.params.app_id,
																				org_id: $page.params.org_id,
																				app_role_id: role.id.toString()
																			},
																			body: permissions_to_delete
																		}
																	)
																	.then((res) => {
																		if (res.data) {
																			roles = roles.map((r) => {
																				if (res.data && r.id === role.id) {
																					r.assigned_permissions =
																						r.assigned_permissions.filter(
																							(p) =>
																								!permissions_to_delete.includes(
																									p.id
																								)
																						);
																				}
																				return r;
																			});
																		} else {
																			toast.error(res.error.message);
																			throw res.error;
																		}
																	}),
																{
																	loading: 'Deleting permissions...',
																	success: 'Permissions deleted'
																}
															);
														}}"
													>
														<Icon
															icon="carbon:trash-can"
															class="h-4 w-4"
														/>
														Delete
													</button>
												</li>
											</svelte:fragment>
										</ContextMenu>

										{resource.key}
									</a>

									<ul>
										{#each role_permissions as permission (`${role.id}-${resource.id}-${permission.permission_id}`)}
											{@const operation_permission = resource.permissions.find(
												(p) => p.id === permission.permission_id
											)}

											<li
												animate:flip
												in:receive="{{
													key: `${resource.id}-${operation_permission?.operation}`
												}}"
												out:send="{{
													key: `${resource.id}-${operation_permission?.operation}`
												}}"
											>
												{#if operation_permission}
													<a
														href="{void 0}"
														class="justify-start"
													>
														<ContextMenu
															hover
															title="{role.name}:{resource.key}:{operation_permission.operation}"
															class="btn btn-ghost btn-xs "
														>
															<Icon
																icon="carbon:overflow-menu-horizontal"
																class="h-4 w-4"
															></Icon>

															<svelte:fragment slot="menu">
																<li>
																	<a href="{void 0}">
																		<Icon
																			icon="carbon:edit"
																			class="h-4 w-4"
																		/>
																		Edit
																	</a>

																</li>
																<li class="text-error">
																	<button
																		class="capitalize"
																		on:click="{async () => {
																			await svetch
																				.delete(
																					'app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions/:permission_id',
																					{
																						path: {
																							app_id: $page.params.app_id,
																							org_id: $page.params.org_id,
																							app_role_id: role.id.toString(),
																							permission_id:
																								permission.id.toString()
																						}
																					}
																				)
																				.then((res) => {
																					if (res.data) {
																						roles = roles.map((r) => {
																							if (
																								res.data &&
																								r.id === role.id
																							) {
																								r.assigned_permissions =
																									r.assigned_permissions.filter(
																										(p) =>
																											p.id !== permission.id
																									);
																							}
																							return r;
																						});
																					} else {
																						toast.error(res.error.message);
																						throw res.error;
																					}
																				});
																		}}"
																	>
																		<Icon
																			icon="carbon:trash-can"
																			class="h-4 w-4"
																		/>
																		Delete
																	</button>
																</li>
																
															</svelte:fragment>
															</ContextMenu>
														<span
															class="badge badge-outline badge-md gap-1 font-mono"
														>
															<Icon
																icon="{crud_icons[
																	operation_permission.operation
																]}"
																class="inline"
															/>
															{operation_permission.operation}</span
														>
													</a>
												{/if}
											</li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>
				</li>
			{/await}
		{/each}
	</ul>
</div>
