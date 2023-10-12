<script lang="ts">
	import { flip } from 'svelte/animate';

	import { writable } from 'svelte/store';

	import { customDispatch } from '../utils/event_helpers';

	import AutoForm from './AutoForm.svelte';

	import type { CrudOperation, Prisma } from '@prisma/client';

	import { fade, fly, slide } from 'svelte/transition';
	type T = $$Generic;
	import Icon from '@iconify/svelte';
	import ModalButton from 'src/routes/app/orgs/[org_id]/apps/[app_id]/ModalButton.svelte';
	import { createEventDispatcher, type EventDispatcher } from 'svelte';
	export let key: keyof T | undefined = undefined;
	export let data: T[] = [];
	// crud without 'all' and has 'custom'
	export let config: {
		columns?: (keyof T)[];
		// keys of crudoperation except "all", as well as "custom"
		actions: (Exclude<CrudOperation, 'all'> | 'custom')[];
		editable_fields?: (keyof T)[];
		hidden_fields?: (keyof T)[];
		type_overrides?: Record<keyof T, string>
	} = {
		columns: [],
		actions: [],
		editable_fields: [],
		hidden_fields: [],
		// @ts-ignore
		type_overrides: {}
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
		xs: 'text-xs',
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-base'
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

	const crud_operations: {
		[key in Exclude<CrudOperation, 'all'> | 'custom']: {
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
		};
	} = {
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

	// account for select checkbox
	const column_template_string = `${select ? '2em' : ''} repeat(${
		config.columns?.length + (select ? 1 : 0)
	}, minmax(auto, 300px))`;
	const minimum_cell_width = 300;
</script>

<div
	style:--minimum_cell_width="{minimum_cell_width}"
	class="flex w-full flex-col rounded-xl border p-4 shadow"
>
	<div class="max-w-[65vw] sm:max-w-[unset]">
		<!-- Table -->
		<ul
			role="table"
			class="grid max-w-[65vw] gap-2 overflow-auto sm:max-w-[unset] {size_classes[
				size
			]} {$$restProps.class}"
			style="grid-template-columns: {column_template_string}; grid-template-rows: repeat({data.slice(
				start,
				end
			).length}, minmax(auto, 1fr));"
		>
			{#if config.columns}
				<!-- header spans whole table -->
				<li
					class="contents"
					style=""
				>
					{#if select}
						<div class="">
							<input
								type="checkbox"
								class="checkbox"
							/>
						</div>
					{/if}
					{#each config.columns as column}
						<div class=" capitalize">
							{column.toString().replaceAll('_', ' ')}
						</div>
					{/each}
					<div class="">
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
					</div>
				</li>

				{#each data.slice(start, end) as row, i (key ? row[key] : i)}
					<!-- Table Rows -->
					<li
						animate:flip="{{ duration: 500 }}"
						role="row"
						class="contents"
						style=""
					>
						{#if select}
							<div class="">
								<input
									type="checkbox"
									class="checkbox"
								/>
							</div>
						{/if}
						{#each config.columns as column (`${key ? row[key] : i}-${String(column)}`)}
							{@const cell = row[column]}
							<!-- if date, show it as date hh:mm:ss -->
							<div
								class=""
								class:text-ellipsis="{typeof cell === 'string'}"
							>
								{#if cell instanceof Date}
									{cell.toLocaleString()}

									<!-- if too long, truncate on smaller screens -->
									<!-- handle booleans -->
								{:else if typeof cell === 'boolean'}
									<input
										disabled
										aria-disabled="true"
										class="checkbox input-disabled"
										type="checkbox"
										checked="{cell}"
									/>
								{:else if typeof cell === 'string'}
									{cell}
								{:else}
									{cell}
								{/if}
							</div>
						{/each}

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
													type_overrides={config.type_overrides}
													required
													fields="{config.editable_fields}"
													hidden_fields="{config.hidden_fields}"
													object="{row}"
												/>
												<div class="modal-action">
													<button class="chonk btn btn-primary">
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
									{@const operation = crud_operations[action]}
									{#if operation}
										<button
											class="chonk btn btn-square btn-sm border border-neutral {operation.class}"
											on:click="{() =>
												operation.dispatcher(action, {
													data: row
												})}"
										>
											<Icon
												icon="{operation.icon}"
												class="h-4 w-4"
											/>
										</button>
									{/if}
								{/if}
							{/each}
						</div>
					</li>

					<!-- content here -->
				{/each}
			{/if}
		</ul>
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
