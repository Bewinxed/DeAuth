<script lang="ts">
	import { page } from '$app/stores';
	import PrettyIcon from '$components/PrettyIcon.svelte';
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
	import { fly } from 'svelte/transition';
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

	let create_resource = false;

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

	async function groupRolePermissionsByResource(role: (typeof roles)[number]) {
		// group assigned permissions by resource
		return role.assigned_permissions.reduce(
			(acc, permission) => {
				const resource = resources.find((r) =>
					r.permissions.find((p) => p.id === permission.permission_id)
				);
				if (resource) {
					if (acc[resource.id]) {
						acc[resource.id].push(permission);
					} else {
						acc[resource.id] = [permission];
					}
				}
				return acc;
			},
			{} as Record<number, (typeof role)['assigned_permissions']>
		);
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
	<ul class="menu menu-sm w-full rounded-lg border bg-base-100 shadow">
		<h1 class="border-b text-lg font-semibold">
			<Icon
				icon="carbon:software-resource"
				class=" inline"
			/>
			Resources
		</h1>
		{#each resources as resource}
			<li class="justify-start">
				<div
					class="justify-start"
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
					{#each object_entries(crud_icons).filter(([key, icon]) => !resource.permissions.find((p) => p.operation === key)) as [key, icon]}
						<li>
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
								<PrettyIcon
									size="small"
									{icon}
								></PrettyIcon>
								{key}
							</button>
						</li>
					{/each}
					<li class="text-error">
						<button
					class=""
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
									resources = resources.filter((r) => r.id !== resource.id);
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
						<li class="justify-start">
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
								class="inline-flex w-32 justify-start gap-1"
								href="{void 0}"
							>
								<ContextMenu
									hover
									title="Edit Resource Permission"
									class="btn btn-ghost btn-xs"
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
									<div
										class="inline-flex place-content-center place-items-center gap-1"
									>
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
	<ul class="menu menu-sm w-full rounded-lg border bg-base-100 shadow">
		<h1 class="border-b text-lg font-semibold">
			<Icon
				icon="carbon:user-role"
				class=" inline"
			/>
			Roles
		</h1>
		{#each roles as role}
			{#await groupRolePermissionsByResource(role) then role_permissions_groupby_resource}
				<li class="transition-colors aria-[dropEffect=link]:hover">
					<div
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
						on:drop|preventDefault="{(e) => {
							if (e.dataTransfer) {
								console.log(e.dataTransfer);
								const { action, data } = JSON.parse(
									e.dataTransfer.getData('text/plain')
								);
								console.log(data);
								if (action === 'resource_to_role') {
									promise_toast(handleDropResourceOnRole(data, role.id), {
										loading: 'Adding resource to role...',
										success: 'Resource added to role'
									});
								} else if (action === 'permission_to_role') {
									promise_toast(handleDropPermissionOnRole(data, role.id), {
										loading: 'Adding permission to role...',
										success: 'Permission added to role'
									});
								}
							}
							e.dataTransfer?.clearData();
							e.currentTarget.classList.remove('btn-neutral');
							e.currentTarget.classList.remove('text-neutral-contents');
						}}"
					>
						<a
							class="inline-flex place-content-center place-items-center gap-1"
							href="{void 0}"
						>
							<button
								class="btn btn-square btn-ghost btn-xs p-0"
								on:click="{async () => {
									toast.promise(
										svetch
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
											}),
										{
											loading: 'Deleting role...',
											success: 'Role deleted',
											error: 'Failed to delete role'
										}
									);
								}}"
							>
								<Icon
									icon="carbon:close"
									class="h-4 w-4"
								></Icon>
							</button>
							{role.name}
						</a>
						<div class="dropdown dropdown-bottom w-fit">
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label
								tabindex="0"
								class="btn btn-square btn-outline btn-xs m-1"
								><Icon
									icon="carbon:add"
									class="h-4 w-4"
								></Icon></label
							>
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<ul
								tabindex="0"
								class="menu dropdown-content rounded-box z-[1] w-52 bg-base-100 p-2 shadow"
							>
								<li>
									<a
										class="border-b"
										href="{void 0}"
									>
										Add Operation
									</a>
								</li>
								<!-- {#each object_entries(crud_icons).filter(([key, icon]) => !role.assigned_permissions.find((p) => p.operation === key)) as [key, icon]}
										<li>
											<button
												on:click="{async () => {
													await svetch
														.put(
															'app/orgs/:org_id/apps/:app_id/resources/:resource_id',
															{
																path: {
																	app_id: $page.params.app_id,
																	org_id: $page.params.org_id,
																	resource_id: role.id.toString()
																},
																body: {
																	operation: key
																}
															}
														)
														.then((res) => {
															if (res.data) {
																resources = resources.map((r) => {
																	if (
																		res.data &&
																		r.id === res.data.resource_id
																	) {
																		r.permissions = [
																			...r.permissions,
																			res.data
																		];
																	}
																	return r;
																});
															}
														});
												}}"
											>
												<PrettyIcon
													size="small"
													{icon}
												></PrettyIcon>
												{key}
											</button>
										</li>
									{/each} -->
							</ul>
						</div>
					</div>
					<ul>
						{#each object_entries(role_permissions_groupby_resource) as [resource_id, role_permissions] (`resource-${resource_id}`)}
							{@const resource = resources.find(
								(resource) => resource.id === parseInt(resource_id)
							)}
							<li
								animate:flip="{{
									duration: 300
								}}"
								transition:fly
								class="justify-start"
							>
								{#if resource}
									<a
										class="inline-flex justify-start gap-1"
										href="{void 0}"
									>
										<div class="dropdown-bottom dropdown">
											<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
											<!-- svelte-ignore a11y-label-has-associated-control -->
											<label
												tabindex="0"
												class="btn btn-square btn-ghost btn-xs m-1"
												><Icon
													icon="carbon:overflow-menu-horizontal"
													class="h-4 w-4"
												></Icon></label
											>
											<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
											<ul
												tabindex="0"
												class="menu dropdown-content rounded-box z-[1] w-fit bg-base-100 p-2 shadow"
											>
												<li class="place-content-start place-items-center">
													<button
														class="btn btn-ghost btn-xs p-0 px-2 font-serif font-normal capitalize"
														on:click="{async () => {
															await svetch
																.delete(
																	'app/orgs/:org_id/apps/:app_id/app_roles/:app_role_id/permissions',
																	{
																		path: {
																			app_id: $page.params.app_id,
																			org_id: $page.params.org_id,
																			app_role_id: role.id.toString()
																		},
																		body: role.assigned_permissions.map(
																			(p) => p.id
																		)
																	}
																)
																.then((res) => {
																	if (res.data) {
																		roles = roles.map((r) => {
																			if (res.data && r.id === role.id) {
																				r.assigned_permissions = [];
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
											</ul>
										</div>
										{resource.key}
									</a>
									<ul>
										{#each role_permissions as permission (`role-permission-${permission.id}`)}
											{@const operation_permission = resource.permissions.find(
												(p) => p.id === permission.permission_id
											)}

											<li
												animate:flip
												transition:fly
											>
												{#if operation_permission}
													<a
														href="{void 0}"
														class="justify-start"
													>
														<div class="dropdown-bottom dropdown">
															<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
															<!-- svelte-ignore a11y-label-has-associated-control -->
															<label
																tabindex="0"
																class="btn btn-square btn-ghost btn-xs m-1"
																><Icon
																	icon="carbon:overflow-menu-horizontal"
																	class="h-4 w-4"
																></Icon></label
															>
															<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
															<ul
																tabindex="0"
																class="menu dropdown-content rounded-box z-[1] w-fit bg-base-100 p-2 shadow"
															>
																<li
																	class="place-content-start place-items-center"
																>
																	<button
																		class="btn btn-ghost btn-xs p-0 px-2 font-serif font-normal capitalize"
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
															</ul>
														</div>
														<span class="badge badge-sm gap-1 font-mono">
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
