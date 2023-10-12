<script lang="ts">
	type T = $$Generic;

	export let object: T;
	export let hidden = false;
	export let fields: (keyof T)[] = [];
	export let required = false;
	export let hidden_fields: (keyof T)[] = [];
	export let required_fields: (keyof T)[] = required ? object_keys(object) : [];
	export let type_overrides: Record<keyof T, string> = {}
	export let button = false;
	export let button_text = '';

	export function object_keys<T>(obj: T) {
		// @ts-ignore
		return Object.keys(obj) as (keyof T)[];
	}

	function object_entries<T extends object>(obj: T) {
		return Object.entries(obj) as [keyof T, T[keyof T]][];
	}

	let form: {
		name: keyof T;
		type: string;
		value: T[keyof T];
		// @ts-ignore
	}[] = object_entries(object)
		// @ts-ignore
		.filter(([key, _]) => (fields.length > 0 ? fields.includes(key) : true))
		.map(([key, value]) => ({
			name: key,
			type: typeof value,
			value: value
		}));
</script>

{#each form as { name, type, value } (name)}
	{@const string_name = name.toString()}
	
	{#if type === 'string'}
		<div class="form-control w-full max-w-sm">
			<label
				class:hidden
				class="label"
				for="{string_name}"
			>
				<span class="label-text capitalize"
					>{string_name.replaceAll('_', ' ')}</span
				></label
			>

			<input
				class:hidden
				required="{required_fields.includes(name)}"
				type="{type_overrides[name] ?? type}"
				class="input input-bordered w-full max-w-sm"
				name="{string_name}"
				value
			/>
		</div>
	{:else if type === 'number'}
		<div class="form-control w-full max-w-sm">
			<label
				class:hidden
				class="label"
				for="{string_name}"
			>
				<span class="label-text">{name}</span></label
			>
			<input
				class:hidden
				required="{required_fields.includes(name)}"
				type="number"
				name="{string_name}"
				bind:value
				class="input input-bordered w-full max-w-sm"
			/>
		</div>
	{:else if type === 'boolean'}
		<div class="form-control w-full max-w-sm">
			<label
				class:hidden
				class="label"
				for="{string_name}"
			>
				<span class="label-text capitalize"
					>{string_name.replaceAll('_', ' ')}</span
				></label
			>
			<input
				class:hidden
				required="{required_fields.includes(name)}"
				type="checkbox"
				name="{string_name}"
				{value}
				class="checkbox"
			/>
		</div>
	{:else if type === 'object'}
		<div class="form-control w-full max-w-sm">
			<label
				class:hidden
				class="label"
				for="{string_name}"
			>
				<span class="label-text capitalize"
					>{string_name.replaceAll('_', ' ')}</span
				></label
			>
			class:hidden
			<input
				type="text"
				name="{string_name}"
				{value}
				class="input input-bordered w-full max-w-sm"
			/>
		</div>
	{:else if value instanceof Date}
		<div class="form-control w-full max-w-sm">
			<label
				class:hidden
				class="label"
				for="{string_name}"
			>
				<span class="label-text">{name}</span></label
			>
			<input
				class:hidden
				required="{required_fields.includes(name)}"
				type="date"
				name="{string_name}"
				{value}
				class="input input-bordered w-full max-w-sm"
			/>
		</div>
	{/if}
{/each}
{#if hidden_fields.length > 0}
	<svelte:self
		{object}
		fields="{hidden_fields}"
		hidden
	/>
{/if}
{#if button}
	<div class="modal-action">
		<button class="chonk btn btn-primary btn-wide">
			{button_text}
		</button>
	</div>
{/if}

<style>
	/* Import DaisyUI styles or any other styles you need */
</style>
