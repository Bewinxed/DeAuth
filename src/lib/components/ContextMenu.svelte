<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	// import autoAnimate from '@formkit/auto-animate';

	export let title = '';
	export let description = '';
	export let hover = false;
	export let open = false;
	const close_dispatcher = createEventDispatcher<{ close: void }>();
	const open_dispatcher = createEventDispatcher<{ open: void }>();
</script>

<div
	class:dropdown-hover="{hover}"
	class:dropdown-open="{open}"
	class="dropdown w-fit"
>
	<label
		on:open="{() => {
			console.log('open');
			open_dispatcher('open');
			open = true;
		}}"
		tabindex="0"
		class="{$$restProps.class}"><slot /></label
	>

	<div
		tabindex="0"
		class="dropdown-content z-[1] w-52 bg-transparent p-1"
	>
		<ul class="menu rounded-box bg-base-100 p-2 shadow-xl">
			{#if title}
				<li>
					<a
						class="pointer-events-none mb-1 cursor-default rounded-b-none border-b"
						href="{void 0}"
					>
						<span class="text-sm font-semibold">{title}</span>
						{#if description}
							<span class="text-xs">{description}</span>
						{/if}
					</a>
				</li>
			{/if}
			<div class="gap-0.5 contents"
				on:click="{(e) => {
					// get nearest label
					open = false;
					e.currentTarget.blur();
				}}"
			>
				<slot name="menu" />
			</div>
		</ul>
	</div>
</div>
