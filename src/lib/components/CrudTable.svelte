<script lang="ts">
	import { customDispatch } from '../utils/event_helpers';

	import AutoForm from './AutoForm.svelte';

	import type { CrudOperation, Prisma } from '@prisma/client';

	import { slide } from 'svelte/transition';
	type T = $$Generic;
	import Icon from '@iconify/svelte';
	import ModalButton from 'src/routes/app/orgs/[org_id]/apps/[app_id]/ModalButton.svelte';
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	export let data: T[] = [];
	export let config: {
		columns?: (keyof T)[];
		actions: CrudOperation[];
		editable_fields?: (keyof T)[];
		hidden_fields?: (keyof T)[];
	} = {
		columns: [],
		actions: [],
		editable_fields: [],
		hidden_fields: []
	};
	// if columns not specified
	if (!config.columns?.length) {
		config.columns = data.length > 0 ? object_keys<T>(data[0]) : [];
	}
	export let hover = false;
	export let select = false;
	export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
	export let pin_rows = false;
	export let pin_cols = false;
	export let mock_data = false;
	export let paginate = false;
	export let item_name = 'item';
	export let current_page = 1;
	export let items_per_page = 10;

	let expanded_rows = new Set();

	$: start = paginate ? (current_page - 1) * items_per_page : 0;
	$: end = paginate ? current_page * items_per_page : data.length;
	$: max_page = Math.ceil(data.length / items_per_page);

	if (mock_data && data.length < 20) {
		data = Array(20)
			.fill(0)
			.map((_) => data)
			.flat();
	}

	let selected: T[] = [];

	const size_classes = {
		xs: 'table-xs',
		sm: 'table-sm',
		md: 'table-md',
		lg: 'table-lg'
	};

	function object_keys<T>(obj: T) {
		// @ts-ignore
		return Object.keys(obj) as (keyof T)[];
	}

	const dispatch_create = createEventDispatcher<{
		create: {
			data: T;
		};
	}>();
	const dispatch_read = createEventDispatcher<{
		read: {
			data: T;
		};
	}>();
	const dispatch_update = createEventDispatcher<{
		update: {
			data: T;
		};
	}>();
	const dispatch_delete = createEventDispatcher<{
		delete: {
			data: T;
		};
	}>();
	const dispatch_custom = createEventDispatcher<{
		custom: {
			data: T;
		};
	}>();
	const crud_operations: Record<
		CrudOperation | 'custom',
		{
			name: string;
			operation: CrudOperation | 'custom';
			icon: string;
			class: string;
			dispatcher: EventDispatcher<{
				create: { data: T };
				read: { data: T };
				update: { data: T };
				delete: { data: T };
				custom: { data: T };
			}>;
		}
	> = {
		create: {
			name: 'create',
			operation: 'create',
			icon: 'carbon:add-alt',
			class: 'btn-success',
			dispatcher: dispatch_create
		},
		read: {
			name: 'read',
			operation: 'read',
			icon: 'carbon:search',
			class: 'btn-primary',
			dispatcher: dispatch_read
		},
		update: {
			name: 'update',
			operation: 'update',
			icon: 'carbon:edit',
			class: 'btn-warning',
			dispatcher: dispatch_update
		},
		delete: {
			name: 'delete',
			operation: 'delete',
			icon: 'carbon:trash-can',
			class: 'btn-error',
			dispatcher: dispatch_delete
		},
		custom: {
			name: 'custom',
			operation: 'custom',
			icon: 'carbon:settings',
			class: 'btn-secondary',
			dispatcher: dispatch_custom
		}
	};

	// responsive crud table
</script>

<div class=" flex flex-col w-full flex-grow-0 place-items-center place-content-center rounded-xl border shadow {$$restProps.class}">
	<div class="max-w-[75vw] overflow-auto">
		<table class="table table-auto {size_classes[size]}">
			{#if config.columns}
				<thead class="">
					{#if select}
						<th class="table-cell">
							<input
								type="checkbox"
								class="checkbox"
							/>
						</th>
					{/if}
					{#each config.columns as column}
						<th class="table-cell capitalize">
							{column.toString().replaceAll('_', ' ')}
						</th>
					{/each}
					<th class="table-cell place-items-center">
						<span>Actions</span>
						{#if config.actions.includes('create')}
							<ModalButton
								{item_name}
								icon="carbon:add-alt"
								class="btn-ghost btn-xs"
							>
								+
								<svelte:fragment slot="modal"
									><form
										class=""
										on:submit|preventDefault="{(e) => {
											// get form data and form valid
											if (e.target instanceof HTMLFormElement) {
												const form = e.target;
												const data = new FormData(form);
												// if form invalid, trigger invalid event
												if (!form.checkValidity()) {
													form.reportValidity();
													return;
												}
												// dispatch create event
												dispatch_create('create', {
													data: Object.fromEntries(data)
												});
												customDispatch(e, 'close');
											}
										}}"
									>
										<slot />
									</form></svelte:fragment
								>
							</ModalButton>
						{/if}
					</th>
				</thead>
				<tbody>
					{#each data.slice(start, end) as row}
						<tr class:hover>
							{#if select}
								<td class="table-cell">
									<input
										type="checkbox"
										class="checkbox"
									/>
								</td>
							{/if}
							{#each config.columns as column}
								{@const cell = row[column]}
								<!-- if date, show it as date hh:mm:ss -->
								{#if cell instanceof Date}
									<td class="">
										{cell.toLocaleString()}
									</td>
									<!-- if too long, truncate on smaller screens -->
									<!-- handle booleans -->
								{:else if typeof cell === 'boolean'}
									<td class="">
										<input
											disabled
											aria-disabled="true"
											class="checkbox input-disabled"
											type="checkbox"
											checked="{cell}"
										/>
									</td>
								{:else if typeof cell === 'string'}
									<td class="text-ellipsis">
										{cell}
									</td>
								{:else}
									<td class="">
										{cell}
									</td>
								{/if}
							{/each}
							<td class="">
								<div class="flex flex-wrap gap-1">
									{#each config.actions.filter((r) => r !== 'create') as action}
										{#if action === 'update'}
											<ModalButton
												title="Edit {item_name}"
												{item_name}
												icon="carbon:add-alt"
												class="btn-square btn-ghost btn-sm"
											>
												<Icon
													icon="carbon:edit"
													class=" inline"
												/>
												<svelte:fragment slot="modal">
													<form
														class=""
														on:submit|preventDefault="{(e) => {
															// get form data and form valid
															if (e.target instanceof HTMLFormElement) {
																const form = e.target;
																const data = new FormData(form);
																//
																// if form invalid, trigger invalid event
																if (!form.checkValidity()) {
																	form.reportValidity();
																	return;
																}
																// dispatch create event
																dispatch_update('update', {
																	data: Object.fromEntries(data)
																});
																customDispatch(e, 'close');
															}
														}}"
													>
														<AutoForm
															required
															fields="{config.editable_fields}"
															hidden_fields="{config.hidden_fields}"
															object="{row}"
														/>
														<div class="modal-action">
															<button class="btn btn-primary">
																<Icon
																	icon="carbon:save"
																	class=" inline"
																/>
																Save</button
															>
														</div>
													</form>
												</svelte:fragment>
											</ModalButton>
										{:else}
											<button
												class="btn btn-square btn-sm {crud_operations[action]
													.class}"
												on:click="{() =>
													crud_operations[action].dispatcher(action, {
														data: row
													})}"
											>
												<Icon
													icon="{crud_operations[action].icon}"
													class="h-4 w-4"
												/>
											</button>
										{/if}
									{/each}
								</div>
							</td>
						</tr>
						<!-- content here -->
					{/each}
				</tbody>
			{/if}
		</table>
	</div>
	<div class="join rounded-b-none">
		<!-- Previous Button -->
		{#if current_page > 1}
			<button
				transition:slide="{{ axis: 'x' }}"
				on:click="{() => (current_page = current_page - 1)}"
				class="btn join-item btn-sm">«</button
			>
		{/if}

		<!-- First Page Button -->
		<button
			on:click="{() => (current_page = 1)}"
			class:btn-active="{current_page === 1}"
			class="btn join-item btn-sm"
		>
			1
		</button>

		<!-- Middle Page Buttons -->
		{#each Array.from({ length: 3 }).map((_, i) => i + 2) as page}
			{#if page <= max_page}
				<button
					on:click="{() => (current_page = page)}"
					class:btn-active="{current_page === page}"
					class="btn join-item btn-sm"
				>
					{page}
				</button>
			{/if}
		{/each}

		<!-- Last Page Button -->
		{#if max_page > 1}
			<button
				on:click="{() => (current_page = max_page)}"
				class:btn-active="{current_page === max_page}"
				class="btn join-item btn-sm"
			>
				{max_page}
			</button>
		{/if}

		<!-- Next Button -->
		{#if current_page < max_page}
			<button
				transition:slide="{{ axis: 'x' }}"
				on:click="{() => (current_page = current_page + 1)}"
				class="btn join-item btn-sm">»</button
			>
		{/if}
	</div>
</div>
