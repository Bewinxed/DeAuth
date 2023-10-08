<script lang="ts">
	import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import {
		getDrawer,
		getDrawerOpen,
		setDrawer,
		setDrawerOpen
	} from '$components/context';
	import { fade, fly, slide } from 'svelte/transition';
	import { Portal, Limbo, teleport } from 'svelte-reparent';
	import AutoHiddenIcon from '$components/AutoHiddenIcon.svelte';
	import { onDestroy, onMount } from 'svelte';
	const drawer_open = getDrawerOpen();
	const drawer_store = getDrawer();

	// $: console.log('drawer store length', $drawer_store.length);

	let screen_width: number;

	// if the screen is lg, open the drawer
	$: if (screen_width > 1024) {
		$drawer_open = true;
	} else {
		$drawer_open = false;
	}

	let sidebar: HTMLElement;
	let sidebar_contents: HTMLElement;
	let sidebar_original_height: number;

	// Function to handle mouse wheel scrolling
	function handleWheel(event: WheelEvent) {
		event.preventDefault();

		const newScrollY = scrollY + event.deltaY;

		// Limit the scroll to the original content height
		const maxScrollY = Math.max(
			0,
			sidebar_original_height -
				(sidebar.clientHeight - sidebar.clientHeight * 0.2)
		);

		scrollY = Math.min(maxScrollY, Math.max(0, newScrollY));

		if (sidebar_contents) {
			sidebar_contents.style.transform = `translateY(-${scrollY}px)`;
		}
	}

	let startY: number | null = null;

	function handleTouchStart(event: TouchEvent) {
		startY = event.touches[0].clientY;
	}

	function handleTouchMove(event: TouchEvent) {
		event.preventDefault();
		if (!startY) return;

		const currentY = event.touches[0].clientY;
		const deltaY = startY - currentY; // Reverse the direction for touch scrolling

		const newScrollY = scrollY + deltaY;

		// Limit the scroll to the original content height
		const maxScrollY = Math.max(
			0,
			sidebar_original_height -
				(sidebar.clientHeight - sidebar.clientHeight * 0.2)
		);

		scrollY = Math.min(maxScrollY, Math.max(0, newScrollY));

		if (sidebar_contents) {
			sidebar_contents.style.transform = `translateY(-${scrollY}px)`;
		}

		startY = currentY;
	}

	let scrollY = 0;

	beforeNavigate(() => {
		// drawer_store.unset();
	});

	onMount(() => {
		if (sidebar) {
			sidebar.addEventListener('wheel', handleWheel);
			sidebar.addEventListener('touchstart', handleTouchStart);
			sidebar.addEventListener('touchmove', handleTouchMove);
		}

		if (sidebar_contents) {
			sidebar_original_height = sidebar_contents.clientHeight;
		}
	});

	onDestroy(() => {
		// Clean up event listeners on component destruction
		if (sidebar) {
			sidebar.removeEventListener('wheel', handleWheel);
			sidebar.removeEventListener('touchstart', handleTouchStart);
			sidebar.removeEventListener('touchmove', handleTouchMove);
		}
	});
</script>

<svelte:window bind:innerWidth="{screen_width}" />

{#if $drawer_store.length > 0}
	<div
		class="flex h-full min-h-screen flex-shrink-0 transition-all duration-300 {$drawer_open
			? 'w-80'
			: 'w-16 md:w-20'}"
	></div>
	<aside
		bind:this="{sidebar}"
		transition:slide="{{ duration: 300, axis: 'x' }}"
		class="fixed top-0 z-[9] h-full max-h-fit min-h-screen border-r-2 bg-base-100 pt-20 text-base-content {$drawer_open
			? 'w-80 @container/aside'
			: 'w-16 @container/aside md:w-20'} transition-all duration-300"
	>
		<div
			class="relative
		"
			bind:this="{sidebar_contents}"
		>
			{#key $drawer_store.length}
				<nav
					class="flex min-h-max w-full flex-col place-content-start place-items-center rounded-xl p-1 transition-transform duration-300 md:p-2"
					in:slide="{{ axis: 'y', delay: 300 }}"
					out:slide="{{ axis: 'y', duration: 300 }}"
				>
					<svelte:component
						this="{$drawer_store.at(-1)?.component}"
						{...$drawer_store.at(-1)?.props}
					/>
				</nav>
				<div class="divider"></div>
				<!-- <span>Links</span> -->
				<div class="w-full p-2">
					<div class="join join-vertical w-full border">
						<AutoHiddenIcon
							icon="carbon:user-admin"
							href="/app/account">Account</AutoHiddenIcon
						>
						<AutoHiddenIcon
							icon="carbon:settings"
							href="/app/settings">Settings</AutoHiddenIcon
						>
						<!-- help icon -->
						<AutoHiddenIcon
							icon="carbon:help"
							href="/app/help">Help</AutoHiddenIcon
						>
						<!-- documentation -->
						<AutoHiddenIcon
							icon="carbon:document"
							href="/app/docs">Docs</AutoHiddenIcon
						>
					</div>
				</div>

				<!-- <Portal key="drawer" component={$drawer_store} /> -->
			{/key}
		</div>
	</aside>
{/if}
<slot />

<style>
	aside {
		scrollbar-width: none;
		view-transition-name: drawer;
	}

	aside::-webkit-scrollbar {
		display: none;
	}
</style>
