<script lang="ts">
	import autoAnimate from '@formkit/auto-animate';

	export let title = '';
	export let description = '';
	export let hover = false;
</script>

<div
	class:dropdown-hover="{hover}"
	class="dropdown dropdown-hover w-fit"
>
	<label
		tabindex="0"
		class="{$$restProps.class}"><slot /></label
	>
	<div
		tabindex="0"
		class="dropdown-content z-[1] w-52 bg-transparent p-1"
	>
		<ul
			class="menu rounded-box bg-base-100 p-2 shadow-xl "
			use:autoAnimate
		>
			{#if title}
				<li>
					<a
						class="mb-1 rounded-b-none border-b"
						href="{void 0}"
					>
						<span class="font-bold">{title}</span>
						{#if description}
							<span class="text-xs">{description}</span>
						{/if}
					</a>
				</li>
			{/if}
			<slot name="menu" />
		</ul>
	</div>
</div>
