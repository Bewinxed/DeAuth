<script lang="ts">
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import { getDrawerOpen } from '$components/context';
	let data: HTMLSpanElement;
	export let icon: string;
	export let href: string;
	const drawer_open = getDrawerOpen();

	$: aria_current = $page.url.pathname.includes(href);
</script>

<!-- <div class="w-full p-2 h-10 flex place-items-center place-content-center"> -->
<a
	{href}
	class:aria-current="{aria_current}"
	class:bg-base-200="{aria_current}"
	class="tooltip flex place-content-center place-items-center {$drawer_open
		? 'w-full justify-start'
		: 'btn-sm md:justify-center'} capitalize btn btn-ghost tooltip-right w-full rounded-[inherit] transition-all duration-300 before:capitalize after:capitalize @[19rem]:before:hidden @[19rem]:after:hidden md:h-3 {$$restProps.class}"
	data-tip="{data?.innerText}"
>
	<figure class="flex aspect-square place-content-center place-items-center">
		<Icon
			{icon}
			class="h-4 w-4 md:h-5 md:w-5"
		/>
	</figure>
	<!-- <div class="inline"> -->
	<span
		bind:this="{data}"
		class="hidden w-full font-normal text-left @[19rem]:inline md:@[19rem]:w-20"
		style="width: {data?.innerText.length*1.25}ch"><slot /></span
	>
	<!-- </div> -->
</a>

<!-- </div> -->
<style>
	a {
		&.aria-current {
			/* background-color: hsl(var(--bc) / 0.1); */
			/* left red border */
			--size: 0.5rem;
			&::after {
				/* border the div */
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				bottom: 0;
				width: var(--size, 0.5rem);
				border-style: solid;
				border-width: 0 0 10px 10px;
				/* @apply border-primary; */
				/* @apply border; */
				/* border-color: transparent transparent transparent hsl(var(--bc) / 0.1); */
				background-color: hsl(var(--bc) / 0.1);
				/* view-transition-name: active-page; */
			}
		}
	}
</style>
